import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode
  className?: string
  variant?: string
  size?: string
}

export function Button({ children, className = '', variant: _variant, size: _size, ...props }: ButtonProps) {
  void _variant
  void _size
  const base = 'inline-flex items-center justify-center px-4 py-2 rounded'
  return (
    <button className={`${base} ${className}`} {...props}>
      {children}
    </button>
  )
}

export default Button
