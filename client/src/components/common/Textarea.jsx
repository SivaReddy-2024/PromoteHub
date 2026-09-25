import React from 'react';

const Textarea = ({
  label,
  id,
  name,
  placeholder,
  value,
  onChange,
  rows = 4,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const textareaId = id || name;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative rounded-lg shadow-sm">
        <textarea
          id={textareaId}
          name={name}
          rows={rows}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          className={`block w-full rounded-lg text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed p-3.5 ${
            error
              ? 'border border-rose-300 focus:border-rose-500 focus:ring-rose-200'
              : 'border border-slate-300 focus:border-brand-500 focus:ring-brand-100'
          }`}
          {...props}
        />
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
          <span>•</span> {error}
        </p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Textarea;
