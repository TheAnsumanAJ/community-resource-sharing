"use client"

import { useRouter } from "next/navigation"
import ResourceForm from "@/components/ResourceForm"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewResourcePage() {
 const router = useRouter()

 async function handleSubmit(data: { title: string; description: string; category: string }) {
  await fetch("/api/resources", {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify(data),
  })
  router.push("/dashboard/resources")
 }

 return (
  <div className="max-w-xl mx-auto p-8">
   <Link
    href="/dashboard/resources"
    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
   >
    <ArrowLeft className="w-4 h-4" /> Back to Resources
   </Link>

   <ResourceForm onSubmit={handleSubmit} submitLabel="Create Resource" />
  </div>
 )
}
