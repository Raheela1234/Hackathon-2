// Search bar component

'use client';

import React, { useState, useCallback } from 'react';
import { createSearchDebounce } from '@/lib/utils/search';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceDelay?: number;
  autoFocus?: boolean;
  className?: string;
}

/**
 * Real-time search bar component with debouncing
 */
export function SearchBar({
  placeholder = 'Search tasks...',
  onSearch,
  debounceDelay = 300,
  autoFocus = false,
  className = '',
}: SearchBarProps) {
  const [value, setValue] = useState('');

  // Use a stable debounce function
  const debouncedSearch = useCallback(
    createSearchDebounce((query) => {
      onSearch(query);
    }, debounceDelay),
    [onSearch, debounceDelay]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedSearch(newValue);
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full pl-10 pr-10 py-2 rounded-lg bg-[#1A1B2E] border border-[#A78BFA]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#A78BFA] focus:ring-2 focus:ring-[#A78BFA]/20 transition-colors"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-300 transition-colors"
          title="Clear search"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
