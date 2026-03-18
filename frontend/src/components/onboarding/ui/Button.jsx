import React from 'react'

export default function Button({ children, variant = 'primary', className = '', type = 'button', loading = false, ...rest }) {
  const base = variant === 'primary' ? 'btn-primary' : 'btn-secondary'
  return (
    <button
      type={type}
      className={`${base} ${className} ${loading ? 'opacity-70' : ''}`}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {loading ? 'Please wait…' : children}
    </button>
  )
}
