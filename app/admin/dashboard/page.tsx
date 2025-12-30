"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { QrCode, Users, DollarSign, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
  const [subscribers, setSubscribers] = useState<{ email: string, created_at: string }[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSubscribers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('pre_checkout_emails')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      console.error('Error fetching subscribers:', error)
    } else if (data) {
      setSubscribers(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const totalSubscribers = subscribers.length
  const checkedIn = Math.floor(totalSubscribers * 0.8) // example placeholder
  const revenue = totalSubscribers * 100 // example: assume $100 per ticket
  const confirmed = Math.floor(totalSubscribers * 0.9)

  const sampleData = [
    { name: 'Jan', sales: 400 },
    { name: 'Feb', sales: 300 },
    { name: 'Mar', sales: 500 },
    { name: 'Apr', sales: 200 },
  ]

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6">
      <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card className="bg-neutral-900/70">
          <CardContent className="p-4 flex items-center gap-2">
            <Users className="h-5 w-5"/> 
            <div>
              <div className="text-sm">Subscribers</div>
              <div className="font-bold">{totalSubscribers}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-neutral-900/70">
          <CardContent className="p-4 flex items-center gap-2">
            <QrCode className="h-5 w-5"/> 
            <div>
              <div className="text-sm">Checked-in</div>
              <div className="font-bold">{checkedIn}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-neutral-900/70">
          <CardContent className="p-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5"/> 
            <div>
              <div className="text-sm">Revenue</div>
              <div className="font-bold">${revenue}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-neutral-900/70">
          <CardContent className="p-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5"/> 
            <div>
              <div className="text-sm">Confirmed</div>
              <div className="font-bold">{confirmed}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscribers Table */}
      <Card className="bg-neutral-900/70 p-4 mb-6">
        <CardContent>
          <h2 className="mb-4 text-xl font-semibold">Subscribers List</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-neutral-100">
                <thead>
                  <tr className="border-b border-neutral-700">
                    <th className="px-4 py-2">#</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Subscribed At</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((sub, index) => (
                    <tr key={index} className="border-b border-neutral-800 hover:bg-neutral-800/30">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{sub.email}</td>
                      <td className="px-4 py-2">{new Date(sub.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sales Chart */}
      <Card className="bg-neutral-900/70 p-4">
        <CardContent>
          <h2 className="mb-4 text-xl font-semibold">Sales (sample)</h2>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <BarChart data={sampleData}>
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Bar dataKey="sales" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="mt-6 flex gap-2">
        <Button onClick={fetchSubscribers} className="rounded-md">Refresh</Button>
        <Button variant="outline" onClick={() => alert('Export CSV not implemented')} className="rounded-md">Export</Button>
      </div>
    </div>
  )
}
