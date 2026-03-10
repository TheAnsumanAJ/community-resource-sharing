"use client"

import { useEffect, useState } from "react"
import BorrowRequestCard from "@/components/BorrowRequestCard"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRightLeft } from "lucide-react"

export default function Requests() {
 const [requests, setRequests] = useState<any[]>([])
 const [loading, setLoading] = useState(true)
 const [userId, setUserId] = useState<string>("")

 useEffect(() => {
  async function load() {
   try {
    const [reqRes, userRes] = await Promise.all([
     fetch("/api/borrow"),
     fetch("/api/user"),
    ])
    if (reqRes.ok) setRequests(await reqRes.json())
    if (userRes.ok) {
     const userData = await userRes.json()
     setUserId(userData.id)
    }
   } catch {} finally {
    setLoading(false)
   }
  }
  load()
 }, [])

 async function accept(id: string) {
  await fetch("/api/borrow/accept", {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ requestId: id }),
  })
  refreshRequests()
 }

 async function reject(id: string) {
  await fetch("/api/borrow/reject", {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ requestId: id }),
  })
  refreshRequests()
 }

 async function initiateReturn(id: string) {
  const res = await fetch("/api/borrow/initiate-return", {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ requestId: id }),
  })
  if (res.ok) {
   alert("Return initiated! The owner has been notified to confirm.")
  }
  refreshRequests()
 }

 async function confirmReturn(id: string) {
  const res = await fetch("/api/borrow/return", {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ requestId: id }),
  })
  if (res.ok) {
   alert("Return confirmed! The resource is now available again.")
  }
  refreshRequests()
 }

 async function refreshRequests() {
  const res = await fetch("/api/borrow")
  if (res.ok) setRequests(await res.json())
 }

 const pendingRequests = requests.filter((r) => r.status === "pending")
 const activeRequests = requests.filter(
  (r) => (r.status === "approved" || r.status === "return_initiated") && !r.returnedAt
 )
 const completedRequests = requests.filter((r) => r.status === "rejected" || r.returnedAt)

 function isOwner(req: any) {
  return req.resource?.ownerId === userId
 }

 function isBorrower(req: any) {
  return req.borrowerId === userId
 }

 if (loading) {
  return (
   <div className="space-y-4">
    {[1, 2, 3].map((i) => (
     <Card key={i} className="bg-card/50 border-border/50">
      <CardContent className="p-6"><div className="h-20 bg-muted rounded animate-pulse" /></CardContent>
     </Card>
    ))}
   </div>
  )
 }

 return (
  <div className="space-y-6">
   <div>
    <h1 className="text-3xl font-bold tracking-tight mb-1">Borrow Requests</h1>
    <p className="text-muted-foreground">Manage incoming and outgoing borrow requests</p>
   </div>

   <Tabs defaultValue="pending" className="w-full">
    <TabsList>
     <TabsTrigger value="pending" className="gap-2">
      Pending
      {pendingRequests.length > 0 && (
       <span className="w-5 h-5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs flex items-center justify-center">
        {pendingRequests.length}
       </span>
      )}
     </TabsTrigger>
     <TabsTrigger value="active" className="gap-2">
      Active
      {activeRequests.length > 0 && (
       <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 text-xs flex items-center justify-center">
        {activeRequests.length}
       </span>
      )}
     </TabsTrigger>
     <TabsTrigger value="completed">Completed</TabsTrigger>
    </TabsList>

    <TabsContent value="pending" className="mt-4">
     {pendingRequests.length === 0 ? (
      <EmptyState text="No pending requests" />
     ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       {pendingRequests.map((req) => (
        <BorrowRequestCard
         key={req.id}
         request={req}
         isOwner={isOwner(req)}
         isBorrower={isBorrower(req)}
         onAccept={accept}
         onReject={reject}
        />
       ))}
      </div>
     )}
    </TabsContent>

    <TabsContent value="active" className="mt-4">
     {activeRequests.length === 0 ? (
      <EmptyState text="No active borrows" />
     ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       {activeRequests.map((req) => (
        <BorrowRequestCard
         key={req.id}
         request={req}
         isOwner={isOwner(req)}
         isBorrower={isBorrower(req)}
         onInitiateReturn={initiateReturn}
         onReturn={confirmReturn}
        />
       ))}
      </div>
     )}
    </TabsContent>

    <TabsContent value="completed" className="mt-4">
     {completedRequests.length === 0 ? (
      <EmptyState text="No completed requests" />
     ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       {completedRequests.map((req) => (
        <BorrowRequestCard
         key={req.id}
         request={req}
         isOwner={isOwner(req)}
         isBorrower={isBorrower(req)}
        />
       ))}
      </div>
     )}
    </TabsContent>
   </Tabs>
  </div>
 )
}

function EmptyState({ text }: { text: string }) {
 return (
  <Card className="bg-card/50 border-border/50">
   <CardContent className="p-12 text-center text-muted-foreground">
    <ArrowRightLeft className="w-10 h-10 mx-auto mb-3 opacity-40" />
    <p>{text}</p>
   </CardContent>
  </Card>
 )
}