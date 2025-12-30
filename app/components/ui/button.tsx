import React from 'react'

export function Button({ children, className = '', variant, size, ...props }: any) {
  const base = 'inline-flex items-center justify-center px-4 py-2 rounded'
  return (
    <button className={`${base} ${className}`} {...props}>
      {children}
    </button>
  )
}

export default Button
