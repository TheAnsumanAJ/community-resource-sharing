"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Check, CheckCheck } from "lucide-react"

type Notification = {
 id: string
 message: string
 read: boolean
 createdAt: string
}

export default function Notifications() {
 const [notifications, setNotifications] = useState<Notification[]>([])
 const [loading, setLoading] = useState(true)

 useEffect(() => {
  async function load() {
   try {
    const res = await fetch("/api/notifications")
    if (res.ok) setNotifications(await res.json())
   } catch {} finally {
    setLoading(false)
   }
  }
  load()
 }, [])

 async function markAsRead(id: string) {
  await fetch("/api/notifications", {
   method: "PUT",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ id, read: true }),
  })
  setNotifications((prev) =>
   prev.map((n) => (n.id === id ? { ...n, read: true } : n))
  )
 }

 async function markAllRead() {
  await fetch("/api/notifications", {
   method: "PUT",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ markAllRead: true }),
  })
  setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
 }

 const unreadCount = notifications.filter((n) => !n.read).length

 return (
  <div className="space-y-6">
   <div className="flex items-center justify-between">
    <div>
     <h1 className="text-3xl font-bold tracking-tight mb-1">Notifications</h1>
     <p className="text-muted-foreground">
      {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
     </p>
    </div>
    {unreadCount > 0 && (
     <Button variant="outline" size="sm" className="gap-2" onClick={markAllRead}>
      <CheckCheck className="w-4 h-4" /> Mark All Read
     </Button>
    )}
   </div>

   {loading ? (
    <div className="space-y-3">
     {[1, 2, 3, 4].map((i) => (
      <Card key={i} className="bg-card/50 border-border/50">
       <CardContent className="p-4"><div className="h-12 bg-muted rounded animate-pulse" /></CardContent>
      </Card>
     ))}
    </div>
   ) : notifications.length === 0 ? (
    <Card className="bg-card/50 border-border/50">
     <CardContent className="p-12 text-center text-muted-foreground">
      <Bell className="w-12 h-12 mx-auto mb-4 opacity-40" />
      <p className="text-lg font-medium mb-1">No notifications</p>
      <p className="text-sm">We&apos;ll notify you when something happens.</p>
     </CardContent>
    </Card>
   ) : (
    <div className="space-y-2">
     {notifications.map((notif) => (
      <Card
       key={notif.id}
       className={`bg-card/60 border-border/50 transition-all ${
        !notif.read ? "border-l-2 border-l-primary" : ""
       }`}
      >
       <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
         {!notif.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
         <div>
          <p className={`text-sm ${notif.read ? "text-muted-foreground" : "font-medium"}`}>
           {notif.message}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
           {new Date(notif.createdAt).toLocaleDateString("en-US", {
            month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
           })}
          </p>
         </div>
        </div>
        {!notif.read && (
         <Button variant="ghost" size="sm" onClick={() => markAsRead(notif.id)}>
          <Check className="w-4 h-4" />
         </Button>
        )}
       </CardContent>
      </Card>
     ))}
    </div>
   )}
  </div>
 )
}
