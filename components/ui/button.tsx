import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode
  className?: string
  /**
   * "gold"  → gold gradient luxury button (default)
   * "ghost" → subtle white-glass ghost button
   * "raw"   → no luxury styles applied, only className
   */
  variant?: 'gold' | 'ghost' | 'raw'
  size?: string
}

export function Button({
  children,
  className = '',
  variant = 'gold',
  size: _size,
  ...props
}: ButtonProps) {
  void _size

  const variantClass =
    variant === 'ghost'
      ? 'liquid-button-ghost'
      : variant === 'raw'
        ? ''
        : 'liquid-button-gold'

  return (
    <button
      className={`${variantClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
