"use client"

import { useEffect, useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuTrigger,
 DropdownMenuSeparator,
 DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"

type Notification = {
 id: string
 message: string
 read: boolean
 createdAt: string
}

export default function NotificationDropdown() {
 const [notifications, setNotifications] = useState<Notification[]>([])
 const [loading, setLoading] = useState(true)

 useEffect(() => {
  loadNotifications()
 }, [])

 async function loadNotifications() {
  try {
   const res = await fetch("/api/notifications")
   if (res.ok) {
    const data = await res.json()
    setNotifications(data)
   }
  } catch {} finally {
   setLoading(false)
  }
 }

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

 const unreadCount = notifications.filter((n) => !n.read).length

 return (
  <DropdownMenu>
   <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon" className="relative">
     <Bell className="w-4 h-4" />
     {unreadCount > 0 && (
      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-chart-1 text-[10px] font-bold text-white flex items-center justify-center">
       {unreadCount > 9 ? "9+" : unreadCount}
      </span>
     )}
    </Button>
   </DropdownMenuTrigger>
   <DropdownMenuContent align="end" className="w-80">
    <DropdownMenuLabel className="flex items-center justify-between">
     <span>Notifications</span>
     {unreadCount > 0 && (
      <span className="text-xs text-muted-foreground font-normal">
       {unreadCount} unread
      </span>
     )}
    </DropdownMenuLabel>
    <DropdownMenuSeparator />
    <ScrollArea className="max-h-72">
     {notifications.length === 0 ? (
      <div className="p-4 text-center text-sm text-muted-foreground">
       No notifications yet
      </div>
     ) : (
      notifications.slice(0, 10).map((notif) => (
       <DropdownMenuItem
        key={notif.id}
        className="flex flex-col items-start gap-1 px-4 py-3 cursor-pointer"
        onClick={() => !notif.read && markAsRead(notif.id)}
       >
        <div className="flex items-center gap-2 w-full">
         {!notif.read && (
          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
         )}
         <span className={`text-sm flex-1 ${notif.read ? "text-muted-foreground" : "text-foreground font-medium"}`}>
          {notif.message}
         </span>
        </div>
        <span className="text-xs text-muted-foreground pl-4">
         {new Date(notif.createdAt).toLocaleDateString()}
        </span>
       </DropdownMenuItem>
      ))
     )}
    </ScrollArea>
   </DropdownMenuContent>
  </DropdownMenu>
 )
}
