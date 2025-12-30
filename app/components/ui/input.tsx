import React from 'react'

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...props} className={`border border-neutral-700 bg-transparent px-3 py-2 rounded ${props.className ?? ''}`} />
  )
}

export default Input
