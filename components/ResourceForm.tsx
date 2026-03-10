"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

const categories = [
 "Tools",
 "Books",
 "Electronics",
 "Sports",
 "Kitchen",
 "Garden",
 "Furniture",
 "Other",
]

type ResourceFormProps = {
 initialData?: {
  title: string
  description: string
  category: string
 }
 onSubmit: (data: { title: string; description: string; category: string }) => Promise<void>
 submitLabel?: string
}

export default function ResourceForm({
 initialData,
 onSubmit,
 submitLabel = "Create Resource",
}: ResourceFormProps) {
 const [title, setTitle] = useState(initialData?.title || "")
 const [description, setDescription] = useState(initialData?.description || "")
 const [category, setCategory] = useState(initialData?.category || "")
 const [loading, setLoading] = useState(false)

 async function handleSubmit(e: React.FormEvent) {
  e.preventDefault()
  if (!title || !description || !category) return
  setLoading(true)
  try {
   await onSubmit({ title, description, category })
  } finally {
   setLoading(false)
  }
 }

 return (
  <Card className="bg-card/60 border-border/50 max-w-xl">
   <CardHeader>
    <CardTitle>{initialData ? "Edit Resource" : "Create New Resource"}</CardTitle>
   </CardHeader>
   <CardContent>
    <form onSubmit={handleSubmit} className="space-y-5">
     <div className="space-y-2">
      <Label htmlFor="title">Title</Label>
      <Input
       id="title"
       placeholder="Enter resource title"
       value={title}
       onChange={(e) => setTitle(e.target.value)}
       required
      />
     </div>

     <div className="space-y-2">
      <Label htmlFor="description">Description</Label>
      <Textarea
       id="description"
       placeholder="Describe the resource..."
       rows={4}
       value={description}
       onChange={(e) => setDescription(e.target.value)}
       required
      />
     </div>

     <div className="space-y-2">
      <Label htmlFor="category">Category</Label>
      <Select value={category} onValueChange={setCategory} required>
       <SelectTrigger>
        <SelectValue placeholder="Select a category" />
       </SelectTrigger>
       <SelectContent>
        {categories.map((cat) => (
         <SelectItem key={cat} value={cat}>
          {cat}
         </SelectItem>
        ))}
       </SelectContent>
      </Select>
     </div>

     <Button type="submit" className="w-full" disabled={loading}>
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {submitLabel}
     </Button>
    </form>
   </CardContent>
  </Card>
 )
}
