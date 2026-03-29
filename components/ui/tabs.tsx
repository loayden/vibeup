import React from 'react'

type BaseTabsProps = {
  children: React.ReactNode
  className?: string
}

export function Tabs({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}

export function TabsList({ children, className = '' }: BaseTabsProps) {
  return <div className={className}>{children}</div>
}

export function TabsTrigger({ children, className = '' }: BaseTabsProps) {
  return <button className={className}>{children}</button>
}

export function TabsContent({ children, className = '' }: BaseTabsProps) {
  return <div className={className}>{children}</div>
}

export default Tabs
