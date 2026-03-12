"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, User, ArrowUpFromLine, Mail } from "lucide-react"
import Link from "next/link"

type Resource = {
 id: string
 title: string
 description: string
 category: string
 image?: string
 available: boolean
 owner?: { name?: string; email: string }
}

export default function ResourceCard({ resource }: { resource: Resource }) {
 const [borrowRequestId, setBorrowRequestId] = useState<string | null>(null)
 const [returning, setReturning] = useState(false)

 useEffect(() => {
  // Check if current user has an active approved borrow for this resource
  async function checkBorrow() {
   try {
    const [borrowRes, userRes] = await Promise.all([
     fetch("/api/borrow"),
     fetch("/api/user"),
    ])
    if (borrowRes.ok && userRes.ok) {
     const requests = await borrowRes.json()
     const user = await userRes.json()
     const activeBorrow = requests.find(
      (r: any) =>
       r.resourceId === resource.id &&
       r.borrowerId === user.id &&
       r.status === "approved" &&
       !r.returnedAt
     )
     if (activeBorrow) setBorrowRequestId(activeBorrow.id)
    }
   } catch {}
  }
  if (!resource.available) checkBorrow()
 }, [resource.id, resource.available])

 async function handleInitiateReturn() {
  if (!borrowRequestId) return
  setReturning(true)
  try {
   const res = await fetch("/api/borrow/initiate-return", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requestId: borrowRequestId }),
   })
   if (res.ok) {
    alert("Return initiated! The owner has been notified.")
    setBorrowRequestId(null)
   }
  } finally {
   setReturning(false)
  }
 }

 return (
  <Card className="group bg-card/60 border-border/50 hover:border-primary/30 hover:bg-card/80 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
   <div className="h-36 bg-gradient-to-br from-primary/10 via-chart-2/5 to-chart-3/10 flex items-center justify-center">
    <Package className="w-12 h-12 text-primary/40 group-hover:text-primary/60 transition-colors" />
   </div>
   <CardContent className="p-5">
    <div className="flex items-start justify-between mb-2">
     <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
      {resource.title}
     </h3>
     <Badge
      variant={resource.available ? "default" : "secondary"}
      className="text-xs shrink-0 ml-2"
     >
      {resource.available ? "Available" : "Borrowed"}
     </Badge>
    </div>
    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
     {resource.description}
    </p>
    <div className="flex items-start justify-between gap-2">
     <div className="flex flex-col gap-1.5 text-xs text-muted-foreground min-w-0">
      <div className="flex items-center gap-1.5">
       <User className="w-3 h-3 shrink-0" />
       <span className="truncate">{resource.owner?.name || "Unknown"}</span>
      </div>
      {resource.owner?.email && (
       <a href={`mailto:${resource.owner.email}`} onClick={e => e.stopPropagation()} className="flex items-center gap-1.5 hover:text-primary transition-colors min-w-0">
        <Mail className="w-3 h-3 shrink-0" />
        <span className="truncate">{resource.owner.email}</span>
       </a>
      )}
     </div>
     <Badge variant="outline" className="text-xs shrink-0">
      {resource.category}
     </Badge>
    </div>
    <div className="mt-4 flex gap-2">
     <Link href={`/resources/${resource.id}`} className="flex-1">
      <Button variant="secondary" size="sm" className="w-full">
       View Details
      </Button>
     </Link>
     {borrowRequestId && (
      <Button
       variant="outline"
       size="sm"
       className="gap-1 shrink-0"
       onClick={handleInitiateReturn}
       disabled={returning}
      >
       <ArrowUpFromLine className="w-3 h-3" />
       {returning ? "..." : "Return"}
      </Button>
     )}
    </div>
   </CardContent>
  </Card>
 )
}
