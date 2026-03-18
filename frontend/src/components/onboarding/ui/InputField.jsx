import React from 'react'

export default function InputField({ label, name, registerFn, registerOptions, error, ...props }) {
  return (
    <div>
      {label && <label className="block text-sm text-[var(--text-muted)] mb-1">{label}</label>}
      <input
        {...(registerFn ? registerFn(name, registerOptions) : {})}
        name={name}
        className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
        {...props}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}
