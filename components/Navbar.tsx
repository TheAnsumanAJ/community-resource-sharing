"use client"

import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
import { Package } from "lucide-react"
import NotificationDropdown from "./NotificationDropdown"

export default function Navbar() {
 return (
  <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
   <div className="flex items-center justify-between h-16 px-6">
    <div className="flex items-center gap-6">
     <Link href="/dashboard" className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
       <Package className="w-4 h-4 text-primary-foreground" />
      </div>
      <span className="font-bold text-lg tracking-tight hidden sm:inline">CommunityShare</span>
     </Link>
    </div>

    <div className="flex items-center gap-3">
     <NotificationDropdown />
     <div className="w-px h-6 bg-border/50" />
     <UserButton
      appearance={{
       elements: {
        avatarBox: "w-8 h-8",
       },
      }}
     />
    </div>
   </div>
  </header>
 )
}
