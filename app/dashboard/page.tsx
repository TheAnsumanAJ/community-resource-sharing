"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ResourceCard from "@/components/ResourceCard"
import { Package, ArrowRightLeft, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
 const [resources, setResources] = useState<any[]>([])
 const [requests, setRequests] = useState<any[]>([])
 const [stats, setStats] = useState<any>(null)
 const [loading, setLoading] = useState(true)

 useEffect(() => {
  async function load() {
   try {
    const [resRes, reqRes, statRes] = await Promise.all([
     fetch("/api/resources"),
     fetch("/api/borrow"),
     fetch("/api/admin/report"),
    ])

    if (resRes.ok) setResources(await resRes.json())
    if (reqRes.ok) setRequests(await reqRes.json())
    if (statRes.ok) setStats(await statRes.json())
   } catch {} finally {
    setLoading(false)
   }
  }
  load()
 }, [])

 const statCards = [
  { label: "Resources", value: stats?.resources ?? "—", icon: Package, color: "text-chart-1" },
  { label: "Borrow Requests", value: stats?.borrows ?? "—", icon: ArrowRightLeft, color: "text-chart-2" },
  { label: "Users", value: stats?.users ?? "—", icon: Users, color: "text-chart-3" },
 ]

 return (
  <div className="space-y-8">
   <div>
    <h1 className="text-3xl font-bold tracking-tight mb-1">Dashboard</h1>
    <p className="text-muted-foreground">Welcome back! Here&apos;s an overview of your community.</p>
   </div>

   {/* Stats */}
   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {statCards.map((s) => (
     <Card key={s.label} className="bg-card/60 border-border/50">
      <CardContent className="p-6 flex items-center justify-between">
       <div>
        <p className="text-sm text-muted-foreground">{s.label}</p>
        <p className="text-2xl font-bold">{s.value}</p>
       </div>
       <s.icon className={`w-8 h-8 ${s.color} opacity-60`} />
      </CardContent>
     </Card>
    ))}
   </div>

   {/* Recent Resources */}
   <div>
    <div className="flex items-center justify-between mb-4">
     <h2 className="text-xl font-semibold">Recent Resources</h2>
     <Link href="/dashboard/resources">
      <Button variant="ghost" size="sm">View All</Button>
     </Link>
    </div>
    {loading ? (
     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
       <Card key={i} className="bg-card/50 border-border/50">
        <CardContent className="p-6"><div className="h-32 bg-muted rounded animate-pulse" /></CardContent>
       </Card>
      ))}
     </div>
    ) : resources.length === 0 ? (
     <Card className="bg-card/50 border-border/50">
      <CardContent className="p-8 text-center text-muted-foreground">
       <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
       <p>No resources yet. Create your first resource!</p>
       <Link href="/resources/new">
        <Button className="mt-4" size="sm">Create Resource</Button>
       </Link>
      </CardContent>
     </Card>
    ) : (
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {resources.slice(0, 6).map((r: any) => (
       <ResourceCard key={r.id} resource={r} />
      ))}
     </div>
    )}
   </div>

   {/* Recent Requests */}
   <div>
    <div className="flex items-center justify-between mb-4">
     <h2 className="text-xl font-semibold">Recent Borrow Requests</h2>
     <Link href="/dashboard/requests">
      <Button variant="ghost" size="sm">View All</Button>
     </Link>
    </div>
    {requests.length === 0 ? (
     <Card className="bg-card/50 border-border/50">
      <CardContent className="p-8 text-center text-muted-foreground">
       <ArrowRightLeft className="w-10 h-10 mx-auto mb-3 opacity-40" />
       <p>No borrow requests yet.</p>
      </CardContent>
     </Card>
    ) : (
     <div className="space-y-3">
      {requests.slice(0, 5).map((req: any) => (
       <Card key={req.id} className="bg-card/60 border-border/50">
        <CardContent className="p-4 flex items-center justify-between">
         <div>
          <p className="font-medium text-sm">{req.resource?.title || req.resourceId}</p>
          <p className="text-xs text-muted-foreground">
           by {req.borrower?.name || req.borrower?.email || req.borrowerId}
          </p>
         </div>
         <Badge variant="outline" className="capitalize">{req.returnedAt ? "returned" : req.status}</Badge>
        </CardContent>
       </Card>
      ))}
     </div>
    )}
   </div>
  </div>
 )
}