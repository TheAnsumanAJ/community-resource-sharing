"use client"

import { useEffect, useState } from "react"
import AdminStats from "@/components/AdminStats"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from "@/components/ui/table"
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select"
import { Shield, Trash2, Users } from "lucide-react"

type UserType = {
 id: string
 email: string
 name?: string
 role: string
 createdAt: string
 _count?: { resources: number; borrowRequests: number }
}

export default function AdminPage() {
 const [users, setUsers] = useState<UserType[]>([])
 const [loading, setLoading] = useState(true)
 const [forbidden, setForbidden] = useState(false)

 useEffect(() => {
  async function load() {
   try {
    const res = await fetch("/api/admin/users")
    if (res.status === 403) {
     setForbidden(true)
     return
    }
    if (res.ok) setUsers(await res.json())
   } catch {} finally {
    setLoading(false)
   }
  }
  load()
 }, [])

 async function changeRole(userId: string, role: string) {
  await fetch("/api/admin/users", {
   method: "PUT",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ userId, role }),
  })
  setUsers((prev) =>
   prev.map((u) => (u.id === userId ? { ...u, role } : u))
  )
 }

 async function deleteUser(userId: string) {
  if (!confirm("Are you sure you want to delete this user?")) return
  await fetch(`/api/admin/users?id=${userId}`, { method: "DELETE" })
  setUsers((prev) => prev.filter((u) => u.id !== userId))
 }

 if (forbidden) {
  return (
   <Card className="bg-card/50 border-border/50">
    <CardContent className="p-12 text-center text-muted-foreground">
     <Shield className="w-12 h-12 mx-auto mb-4 opacity-40" />
     <p className="text-lg font-medium mb-1">Access Denied</p>
     <p className="text-sm">You need admin privileges to view this page.</p>
    </CardContent>
   </Card>
  )
 }

 return (
  <div className="space-y-8">
   <div>
    <h1 className="text-3xl font-bold tracking-tight mb-1">Admin Panel</h1>
    <p className="text-muted-foreground">Platform overview and user management</p>
   </div>

   <AdminStats />

   <Card className="bg-card/60 border-border/50">
    <CardHeader>
     <CardTitle className="flex items-center gap-2">
      <Users className="w-5 h-5" /> User Management
     </CardTitle>
    </CardHeader>
    <CardContent>
     {loading ? (
      <div className="h-40 bg-muted rounded animate-pulse" />
     ) : (
      <Table>
       <TableHeader>
        <TableRow>
         <TableHead>User</TableHead>
         <TableHead>Email</TableHead>
         <TableHead>Role</TableHead>
         <TableHead>Resources</TableHead>
         <TableHead>Borrows</TableHead>
         <TableHead>Joined</TableHead>
         <TableHead className="text-right">Actions</TableHead>
        </TableRow>
       </TableHeader>
       <TableBody>
        {users.map((user) => (
         <TableRow key={user.id}>
          <TableCell className="font-medium">{user.name || "—"}</TableCell>
          <TableCell className="text-muted-foreground text-sm">{user.email}</TableCell>
          <TableCell>
           <Select
            value={user.role}
            onValueChange={(val) => changeRole(user.id, val)}
           >
            <SelectTrigger className="w-24 h-8">
             <SelectValue />
            </SelectTrigger>
            <SelectContent>
             <SelectItem value="user">User</SelectItem>
             <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
           </Select>
          </TableCell>
          <TableCell>{user._count?.resources ?? 0}</TableCell>
          <TableCell>{user._count?.borrowRequests ?? 0}</TableCell>
          <TableCell className="text-sm text-muted-foreground">
           {new Date(user.createdAt).toLocaleDateString()}
          </TableCell>
          <TableCell className="text-right">
           <Button
            size="icon"
            variant="ghost"
            className="w-8 h-8 text-destructive hover:text-destructive"
            onClick={() => deleteUser(user.id)}
           >
            <Trash2 className="w-4 h-4" />
           </Button>
          </TableCell>
         </TableRow>
        ))}
       </TableBody>
      </Table>
     )}
    </CardContent>
   </Card>
  </div>
 )
}
