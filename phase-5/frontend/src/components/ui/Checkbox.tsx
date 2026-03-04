// T035: Checkbox component with large click area - Updated with Purple Theme

import React from 'react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export function Checkbox({ label, className = '', id, ...props }: CheckboxProps) {
  const checkboxId = id || label?.toLowerCase().replace(/\s+/g, '-') || `checkbox-${Math.random()}`;

  return (
    <div className="flex items-center">
      <input
        id={checkboxId}
        type="checkbox"
        className={`
          h-5 w-5 rounded border-2 border-[#A78BFA] bg-[#0B0B12] text-[#A78BFA]
          focus:ring-2 focus:ring-[#A78BFA] focus:ring-offset-2 focus:ring-offset-[#0B0B12]
          hover:border-[#C4B5FD] transition-colors
          checked:bg-[#A78BFA] checked:border-[#A78BFA]
          cursor-pointer
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      />
      {label && (
        <label
          htmlFor={checkboxId}
          className="ml-3 text-sm font-medium text-gray-300 cursor-pointer select-none"
        >
          {label}
        </label>
      )}
    </div>
  );
}
