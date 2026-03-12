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
  <aside className="w-full md:w-64 min-h-auto md:min-h-[calc(100vh-4rem)] border-b md:border-b-0 md:border-r border-border/50 bg-sidebar flex flex-row md:flex-col overflow-x-auto md:overflow-visible shrink-0 items-center md:items-stretch">
   <div className="p-2 md:p-4 shrink-0">
    <Link href="/resources/new">
     <Button className="w-auto md:w-full gap-2 shadow-md shadow-primary/10 whitespace-nowrap">
      <Plus className="w-4 h-4" />
      <span className="hidden md:inline">New Resource</span>
      <span className="md:hidden">New</span>
     </Button>
    </Link>
   </div>

   <Separator orientation="vertical" className="md:hidden h-8 mx-1 opacity-50 shrink-0" />
   <Separator className="hidden md:block opacity-50" />

   <nav className="flex-1 px-2 py-2 md:px-3 md:py-4 flex flex-row md:flex-col gap-1 md:gap-1.5 md:space-y-1 items-center md:items-stretch min-w-max md:min-w-0">
    {mainLinks.map((link) => {
     const isActive =
      pathname === link.href ||
      (link.href !== "/dashboard" && pathname.startsWith(link.href))
     return (
      <Link
       key={link.href}
       href={link.href}
       className={cn(
        "flex items-center gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap shrink-0",
        isActive
         ? "bg-primary/10 text-primary shadow-sm"
         : "text-muted-foreground hover:bg-accent hover:text-foreground"
       )}
      >
       <link.icon className={cn("w-4 h-4 shrink-0", isActive && "text-primary")} />
       <span className="hidden md:inline">{link.label}</span>
       <span className="md:hidden text-xs">{link.label.split(' ')[0]}</span>
       {link.label === "Notifications" && (
        <span className="ml-1 md:ml-auto w-2 h-2 rounded-full bg-chart-1 animate-pulse shrink-0" />
       )}
      </Link>
     )
    })}
   </nav>

   {role === "admin" && (
    <div className="flex flex-row md:flex-col items-center md:items-stretch shrink-0">
     <Separator orientation="vertical" className="md:hidden h-8 mx-1 opacity-50" />
     <Separator className="hidden md:block opacity-50" />
     <div className="px-2 py-2 md:px-3 md:py-4 flex flex-row md:flex-col items-center md:items-stretch">
      <p className="hidden md:block px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
       Admin
      </p>
      <Link
       href="/dashboard/admin"
       className={cn(
        "flex items-center gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap",
        pathname === "/dashboard/admin"
         ? "bg-primary/10 text-primary shadow-sm"
         : "text-muted-foreground hover:bg-accent hover:text-foreground"
       )}
      >
       <Shield className="w-4 h-4 shrink-0" />
       <span className="hidden md:inline">Admin Panel</span>
       <span className="md:hidden text-xs">Admin</span>
      </Link>
     </div>
    </div>
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