"use client"

import { useEffect, useState } from "react"
import ResourceCard from "@/components/ResourceCard"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select"
import { Search, Package } from "lucide-react"

const categories = ["All", "Tools", "Books", "Electronics", "Sports", "Kitchen", "Garden", "Furniture", "Other"]

export default function ResourcesPage() {
 const [resources, setResources] = useState<any[]>([])
 const [search, setSearch] = useState("")
 const [category, setCategory] = useState("All")
 const [loading, setLoading] = useState(true)

 useEffect(() => {
  async function load() {
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
  load()
 }, [search, category])

 return (
  <div className="max-w-6xl mx-auto p-8">
   <div className="mb-8">
    <h1 className="text-3xl font-bold tracking-tight mb-1">Browse Resources</h1>
    <p className="text-muted-foreground">Find tools, books, and more from your community</p>
   </div>

   <div className="flex gap-3 mb-6">
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
      <p className="text-sm">Try adjusting your search or filters.</p>
     </CardContent>
    </Card>
   ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
     {resources.map((r: any) => (
      <ResourceCard key={r.id} resource={r} />
     ))}
    </div>
   )}
  </div>
 )
}
