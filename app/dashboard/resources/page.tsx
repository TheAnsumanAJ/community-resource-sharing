"use client"

import { useEffect, useState } from "react"
import ResourceCard from "@/components/ResourceCard"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select"
import { Search, Plus, Package, Trash2, Edit } from "lucide-react"
import Link from "next/link"
import {
 Dialog,
 DialogContent,
 DialogHeader,
 DialogTitle,
} from "@/components/ui/dialog"
import ResourceForm from "@/components/ResourceForm"

const categories = ["All", "Tools", "Books", "Electronics", "Sports", "Kitchen", "Garden", "Furniture", "Other"]

export default function DashboardResources() {
 const [resources, setResources] = useState<any[]>([])
 const [search, setSearch] = useState("")
 const [category, setCategory] = useState("All")
 const [loading, setLoading] = useState(true)
 const [editingResource, setEditingResource] = useState<any>(null)
 const [editOpen, setEditOpen] = useState(false)

 async function loadResources() {
  setLoading(true)
  try {
   const params = new URLSearchParams()
   if (search) params.set("search", search)
   if (category && category !== "All") params.set("category", category)

   const res = await fetch(`/api/resources?${params.toString()}`)
   if (res.ok) setResources(await res.json())
  } catch {} finally {
   setLoading(false)
  }
 }

 useEffect(() => { loadResources() }, [search, category])

 async function handleDelete(id: string) {
  if (!confirm("Delete this resource?")) return
  await fetch(`/api/resources/${id}`, { method: "DELETE" })
  loadResources()
 }

 async function handleEdit(data: { title: string; description: string; category: string }) {
  if (!editingResource) return
  await fetch(`/api/resources/${editingResource.id}`, {
   method: "PUT",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify(data),
  })
  setEditOpen(false)
  setEditingResource(null)
  loadResources()
 }

 return (
  <div className="space-y-6">
   <div className="flex items-center justify-between">
    <div>
     <h1 className="text-3xl font-bold tracking-tight mb-1">Resources</h1>
     <p className="text-muted-foreground">Manage and browse community resources</p>
    </div>
    <Link href="/resources/new">
     <Button className="gap-2">
      <Plus className="w-4 h-4" /> New Resource
     </Button>
    </Link>
   </div>

   {/* Filters */}
   <div className="flex gap-3">
    <div className="relative flex-1 max-w-sm">
     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
     <Input
      placeholder="Search resources..."
      className="pl-9"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
     />
    </div>
    <Select value={category} onValueChange={setCategory}>
     <SelectTrigger className="w-40">
      <SelectValue />
     </SelectTrigger>
     <SelectContent>
      {categories.map((cat) => (
       <SelectItem key={cat} value={cat}>{cat}</SelectItem>
      ))}
     </SelectContent>
    </Select>
   </div>

   {/* Resource Grid */}
   {loading ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
     {[1, 2, 3, 4, 5, 6].map((i) => (
      <Card key={i} className="bg-card/50 border-border/50">
       <CardContent className="p-6"><div className="h-48 bg-muted rounded animate-pulse" /></CardContent>
      </Card>
     ))}
    </div>
   ) : resources.length === 0 ? (
    <Card className="bg-card/50 border-border/50">
     <CardContent className="p-12 text-center text-muted-foreground">
      <Package className="w-12 h-12 mx-auto mb-4 opacity-40" />
      <p className="text-lg font-medium mb-1">No resources found</p>
      <p className="text-sm">Try adjusting your search or create a new resource.</p>
     </CardContent>
    </Card>
   ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
     {resources.map((r: any) => (
      <div key={r.id} className="relative group">
       <ResourceCard resource={r} />
       <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
         size="icon"
         variant="secondary"
         className="w-7 h-7"
         onClick={() => { setEditingResource(r); setEditOpen(true) }}
        >
         <Edit className="w-3 h-3" />
        </Button>
        <Button
         size="icon"
         variant="destructive"
         className="w-7 h-7"
         onClick={() => handleDelete(r.id)}
        >
         <Trash2 className="w-3 h-3" />
        </Button>
       </div>
      </div>
     ))}
    </div>
   )}

   {/* Edit Dialog */}
   <Dialog open={editOpen} onOpenChange={setEditOpen}>
    <DialogContent className="max-w-lg">
     <DialogHeader>
      <DialogTitle>Edit Resource</DialogTitle>
     </DialogHeader>
     {editingResource && (
      <ResourceForm
       initialData={editingResource}
       onSubmit={handleEdit}
       submitLabel="Save Changes"
      />
     )}
    </DialogContent>
   </Dialog>
  </div>
 )
}
