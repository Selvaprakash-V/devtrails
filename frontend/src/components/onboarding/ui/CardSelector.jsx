import React from 'react'

export default function CardSelector({ options = [], selected, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((opt) => {
        const isSelected = selected === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value)}
            className={`p-4 flex items-center gap-3 text-left rounded-lg transition-colors border ${isSelected ? 'border-[var(--accent)] bg-[var(--accent-soft)]' : 'border-[var(--border)] bg-[var(--bg)]'}`}
          >
            {opt.icon && <div className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm">{opt.icon}</div>}
            <div className="flex-1">
              <div className="text-sm font-medium text-[var(--text)]">{opt.label}</div>
              {opt.subtitle && <div className="text-xs text-[var(--text-muted)]">{opt.subtitle}</div>}
            </div>
          </button>
        )
      })}
    </div>
  )
}
