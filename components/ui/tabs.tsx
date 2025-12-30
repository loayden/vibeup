import React from 'react'

export function Tabs({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}

export function TabsList({ children, className = '' }: any) {
  return <div className={className}>{children}</div>
}

export function TabsTrigger({ children, className = '' }: any) {
  return <button className={className}>{children}</button>
}

export function TabsContent({ children, className = '' }: any) {
  return <div className={className}>{children}</div>
}

export default Tabs
