"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Loader2, Save, User } from "lucide-react"

export default function ProfilePage() {
 const [user, setUser] = useState<any>(null)
 const [loading, setLoading] = useState(true)
 const [saving, setSaving] = useState(false)
 const [name, setName] = useState("")
 const [phone, setPhone] = useState("")
 const [bio, setBio] = useState("")
 const [saved, setSaved] = useState(false)

 useEffect(() => {
  async function load() {
   try {
    const res = await fetch("/api/user")
    if (res.ok) {
     const data = await res.json()
     setUser(data)
     setName(data.name || "")
     setPhone(data.phone || "")
     setBio(data.bio || "")
    }
   } catch {} finally {
    setLoading(false)
   }
  }
  load()
 }, [])

 async function handleSave() {
  setSaving(true)
  setSaved(false)
  try {
   const res = await fetch("/api/user", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone, bio }),
   })
   if (res.ok) {
    const data = await res.json()
    setUser(data)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
   }
  } finally {
   setSaving(false)
  }
 }

 if (loading) {
  return (
   <div className="max-w-2xl mx-auto p-8">
    <Card className="bg-card/50 border-border/50">
     <CardContent className="p-8"><div className="h-64 bg-muted rounded animate-pulse" /></CardContent>
    </Card>
   </div>
  )
 }

 return (
  <div className="max-w-2xl mx-auto p-8">
   <h1 className="text-3xl font-bold tracking-tight mb-6">My Profile</h1>

   <Card className="bg-card/60 border-border/50">
    <CardHeader>
     <div className="flex items-center gap-4">
      <Avatar className="w-16 h-16">
       <AvatarImage src={user?.avatar || ""} />
       <AvatarFallback className="bg-primary/10 text-primary text-xl">
        {name ? name.charAt(0).toUpperCase() : <User className="w-6 h-6" />}
       </AvatarFallback>
      </Avatar>
      <div>
       <CardTitle>{name || "Your Name"}</CardTitle>
       <p className="text-sm text-muted-foreground">{user?.email}</p>
       <Badge variant="outline" className="mt-1 capitalize">{user?.role}</Badge>
      </div>
     </div>
    </CardHeader>

    <Separator />

    <CardContent className="p-6 space-y-5">
     <div className="space-y-2">
      <Label htmlFor="name">Full Name</Label>
      <Input
       id="name"
       placeholder="Enter your full name"
       value={name}
       onChange={(e) => setName(e.target.value)}
      />
     </div>

     <div className="space-y-2">
      <Label htmlFor="phone">Phone</Label>
      <Input
       id="phone"
       placeholder="Enter your phone number"
       value={phone}
       onChange={(e) => setPhone(e.target.value)}
      />
     </div>

     <div className="space-y-2">
      <Label htmlFor="bio">Bio</Label>
      <Textarea
       id="bio"
       placeholder="Tell us about yourself..."
       rows={4}
       value={bio}
       onChange={(e) => setBio(e.target.value)}
      />
     </div>

     <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
      {saving ? (
       <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
       <Save className="w-4 h-4" />
      )}
      {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
     </Button>
    </CardContent>
   </Card>
  </div>
 )
}