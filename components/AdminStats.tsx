"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Package, ArrowRightLeft, TrendingUp } from "lucide-react"

type Stats = {
 users: number
 resources: number
 borrows: number
}

const statConfig = [
 {
  key: "users" as const,
  label: "Total Users",
  icon: Users,
  gradient: "from-chart-1/20 to-chart-1/5",
  iconColor: "text-chart-1",
 },
 {
  key: "resources" as const,
  label: "Total Resources",
  icon: Package,
  gradient: "from-chart-2/20 to-chart-2/5",
  iconColor: "text-chart-2",
 },
 {
  key: "borrows" as const,
  label: "Borrow Requests",
  icon: ArrowRightLeft,
  gradient: "from-chart-3/20 to-chart-3/5",
  iconColor: "text-chart-3",
 },
]

export default function AdminStats() {
 const [stats, setStats] = useState<Stats | null>(null)

 useEffect(() => {
  async function load() {
   const res = await fetch("/api/admin/report")
   const data = await res.json()
   setStats(data)
  }
  load()
 }, [])

 if (!stats) {
  return (
   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {[1, 2, 3].map((i) => (
     <Card key={i} className="bg-card/50 border-border/50">
      <CardContent className="p-6">
       <div className="h-16 animate-pulse bg-muted rounded" />
      </CardContent>
     </Card>
    ))}
   </div>
  )
 }

 return (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
   {statConfig.map((cfg) => (
    <Card key={cfg.key} className="bg-card/60 border-border/50 hover:border-border transition-colors overflow-hidden relative">
     <div className={`absolute inset-0 bg-gradient-to-br ${cfg.gradient} pointer-events-none`} />
     <CardContent className="p-6 relative">
      <div className="flex items-center justify-between mb-3">
       <span className="text-sm text-muted-foreground font-medium">{cfg.label}</span>
       <cfg.icon className={`w-5 h-5 ${cfg.iconColor}`} />
      </div>
      <p className="text-3xl font-bold">{stats[cfg.key]}</p>
      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
       <TrendingUp className="w-3 h-3" />
       <span>Updated just now</span>
      </div>
     </CardContent>
    </Card>
   ))}
  </div>
 )
}