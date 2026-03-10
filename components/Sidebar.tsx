"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import {
 LayoutDashboard, Package, ArrowRightLeft, Bell, Shield, User, Star, Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const mainLinks = [
 { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
 { href: "/dashboard/resources", label: "My Resources", icon: Package },
 { href: "/dashboard/requests", label: "Borrow Requests", icon: ArrowRightLeft },
 { href: "/dashboard/reviews", label: "Reviews", icon: Star },
 { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
]

export default function Sidebar() {
 const pathname = usePathname()
 const [role, setRole] = useState<string>("user")

 useEffect(() => {
  async function loadRole() {
   try {
    const res = await fetch("/api/user")
    if (res.ok) {
     const data = await res.json()
     setRole(data.role || "user")
    }
   } catch {}
  }
  loadRole()
 }, [])

 return (
  <aside className="w-64 min-h-[calc(100vh-4rem)] border-r border-border/50 bg-sidebar flex flex-col">
   <div className="p-4">
    <Link href="/resources/new">
     <Button className="w-full gap-2 shadow-md shadow-primary/10">
      <Plus className="w-4 h-4" />
      New Resource
     </Button>
    </Link>
   </div>

   <Separator className="opacity-50" />

   <nav className="flex-1 px-3 py-4 space-y-1">
    {mainLinks.map((link) => {
     const isActive =
      pathname === link.href ||
      (link.href !== "/dashboard" && pathname.startsWith(link.href))
     return (
      <Link
       key={link.href}
       href={link.href}
       className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
        isActive
         ? "bg-primary/10 text-primary shadow-sm"
         : "text-muted-foreground hover:bg-accent hover:text-foreground"
       )}
      >
       <link.icon className={cn("w-4 h-4", isActive && "text-primary")} />
       {link.label}
       {link.label === "Notifications" && (
        <span className="ml-auto w-2 h-2 rounded-full bg-chart-1 animate-pulse" />
       )}
      </Link>
     )
    })}
   </nav>

   {role === "admin" && (
    <>
     <Separator className="opacity-50" />
     <div className="px-3 py-4">
      <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
       Admin
      </p>
      <Link
       href="/dashboard/admin"
       className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
        pathname === "/dashboard/admin"
         ? "bg-primary/10 text-primary shadow-sm"
         : "text-muted-foreground hover:bg-accent hover:text-foreground"
       )}
      >
       <Shield className="w-4 h-4" />
       Admin Panel
      </Link>
     </div>
    </>
   )}

   <Separator className="opacity-50" />
   <div className="px-3 py-4">
    <Link
     href="/profile"
     className={cn(
      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
      pathname === "/profile"
       ? "bg-primary/10 text-primary shadow-sm"
       : "text-muted-foreground hover:bg-accent hover:text-foreground"
     )}
    >
     <User className="w-4 h-4" />
     My Profile
    </Link>
   </div>
  </aside>
 )
}