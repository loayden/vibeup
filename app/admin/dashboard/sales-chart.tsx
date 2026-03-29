"use client"

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

type SalesChartProps = {
  data: Array<{
    name: string
    sales: number
  }>
}

export function SalesChart({ data }: SalesChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#9CA3AF" />
        <YAxis stroke="#9CA3AF" />
        <Tooltip />
        <Bar dataKey="sales" fill="#F59E0B" />
      </BarChart>
    </ResponsiveContainer>
  )
}
