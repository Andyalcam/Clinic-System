'use client';

import { ReactNode, useState } from 'react';

interface SearchSelectProps<T> {
  items: T[];
  placeholder: string;
  getItemKey: (item: T) => string;
  getItemLabel: (item: T) => string;
  onSelect: (item: T) => void;
  renderItem?: (item: T, isHighlighted: boolean) => ReactNode;
  renderNoResults?: (search: string) => ReactNode;
  onEmptyEnter?: (search: string) => void | Promise<void>;
  onEscape?: () => void;
  searchValue?: string;
  onSearchValueChange?: (value: string) => void;
}

export default function SearchSelect<T>({
  items,
  placeholder,
  getItemKey,
  getItemLabel,
  onSelect,
  renderItem,
  renderNoResults,
  onEmptyEnter,
  onEscape,
  searchValue,
  onSearchValueChange,
}: SearchSelectProps<T>) {
  const [internalSearch, setInternalSearch] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const search = searchValue ?? internalSearch;

  const setSearch = (value: string) => {
    if (onSearchValueChange) {
      onSearchValueChange(value);
      return;
    }

    setInternalSearch(value);
  };

  const filtered = items.filter((item) =>
    getItemLabel(item).toLowerCase().includes(search.toLowerCase().trim())
  );

  const handleSelect = (item: T) => {
    onSelect(item);
    setSearch(getItemLabel(item));
  };

  return (
    <div>
      <input
        placeholder={placeholder}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setHighlightedIndex(0);
        }}
        onKeyDown={async (e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex((prev) =>
              Math.min(prev + 1, filtered.length - 1)
            );
          }

          if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex((prev) => Math.max(prev - 1, 0));
          }

          if (e.key === 'Enter') {
            e.preventDefault();

            if (filtered.length > 0) {
              const selected = filtered[highlightedIndex];
              handleSelect(selected);
            } else if (onEmptyEnter) {
              await onEmptyEnter(search);
            }
          }

          if (e.key === 'Escape') {
            onEscape?.();
          }
        }}
      />

      {search && (
        <div style={{ border: '1px solid #ccc', marginTop: 5 }}>
          {filtered.length > 0 ? (
            filtered.map((item, index) => (
              <div
                key={getItemKey(item)}
                style={{
                  padding: 5,
                  cursor: 'pointer',
                  backgroundColor: index === highlightedIndex ? '#eee' : 'white',
                }}
                onClick={() => handleSelect(item)}
              >
                {renderItem
                  ? renderItem(item, index === highlightedIndex)
                  : getItemLabel(item)}
              </div>
            ))
          ) : (
            renderNoResults?.(search)
          )}
        </div>
      )}
    </div>
  );
}
