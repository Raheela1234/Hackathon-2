// Tags display and input components

'use client';

import React, { useState } from 'react';
import { Input } from './Input';

interface TagsDisplayProps {
  tags: string[];
  variant?: 'display' | 'small';
  className?: string;
}

/**
 * Display a list of tags
 */
export function TagsDisplay({ tags, variant = 'display', className = '' }: TagsDisplayProps) {
  if (!tags.length) {
    return <span className="text-gray-500 text-xs">No tags</span>;
  }

  const sizeClasses = variant === 'small' ? 'px-1.5 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {tags.map(tag => (
        <span
          key={tag}
          className={`inline-flex items-center rounded-full bg-[#A78BFA]/10 text-[#A78BFA] border border-[#A78BFA]/30 ${sizeClasses}`}
        >
          #{tag}
        </span>
      ))}
    </div>
  );
}

interface TagsInputProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  availableTags?: string[];
  placeholder?: string;
  maxTags?: number;
}

/**
 * Input component for selecting and adding tags
 */
export function TagsInput({
  selectedTags,
  onTagsChange,
  availableTags = [],
  placeholder = 'Add tags...',
  maxTags = 10,
}: TagsInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim()) {
      const filtered = availableTags.filter(
        tag =>
          tag.toLowerCase().includes(value.toLowerCase()) &&
          !selectedTags.includes(tag)
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag) && selectedTags.length < maxTags) {
      onTagsChange([...selectedTags, tag]);
      setInputValue('');
      setSuggestions([]);
    }
  };

  const removeTag = (tag: string) => {
    onTagsChange(selectedTags.filter(t => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (!selectedTags.includes(newTag)) {
        addTag(newTag);
      }
    } else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
      removeTag(selectedTags[selectedTags.length - 1]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full"
        />

        {/* Suggestions dropdown */}
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#0F1020] border border-[#A78BFA]/30 rounded-lg shadow-lg z-10">
            {suggestions.map(tag => (
              <button
                key={tag}
                onClick={() => addTag(tag)}
                className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-[#A78BFA]/10 transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected tags display */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map(tag => (
            <button
              key={tag}
              onClick={() => removeTag(tag)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#A78BFA]/10 text-[#A78BFA] border border-[#A78BFA]/30 hover:border-[#A78BFA]/50 transition-colors text-xs"
              title="Click to remove"
            >
              #{tag}
              <span>✕</span>
            </button>
          ))}
        </div>
      )}

      {selectedTags.length >= maxTags && (
        <p className="text-xs text-gray-500">Maximum {maxTags} tags reached</p>
      )}
    </div>
  );
}
