"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import ReviewCard from "@/components/ReviewCard"
import { Package, User, Star, Loader2, ArrowLeft, ArrowUpFromLine } from "lucide-react"
import Link from "next/link"

export default function ResourceDetailPage() {
 const params = useParams()
 const router = useRouter()
 const [resource, setResource] = useState<any>(null)
 const [loading, setLoading] = useState(true)
 const [borrowing, setBorrowing] = useState(false)
 const [rating, setRating] = useState(5)
 const [comment, setComment] = useState("")
 const [submittingReview, setSubmittingReview] = useState(false)
 const [borrowRequestId, setBorrowRequestId] = useState<string | null>(null)
 const [returning, setReturning] = useState(false)

 useEffect(() => {
  async function load() {
   try {
    const [resRes, borrowRes, userRes] = await Promise.all([
     fetch(`/api/resources/${params.id}`),
     fetch("/api/borrow"),
     fetch("/api/user"),
    ])
    if (resRes.ok) setResource(await resRes.json())
    if (borrowRes.ok && userRes.ok) {
     const requests = await borrowRes.json()
     const user = await userRes.json()
     const activeBorrow = requests.find(
      (r: any) =>
       r.resourceId === params.id &&
       r.borrowerId === user.id &&
       r.status === "approved" &&
       !r.returnedAt
     )
     if (activeBorrow) setBorrowRequestId(activeBorrow.id)
    }
   } catch {} finally {
    setLoading(false)
   }
  }
  load()
 }, [params.id])

 async function handleBorrow() {
  setBorrowing(true)
  try {
   const response = await fetch("/api/borrow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resourceId: params.id }),
   })
   if (!response.ok) {
    const err = await response.json()
    alert(err.error || "Failed to submit borrow request")
    return
   }
   alert("Borrow request submitted successfully!")
   router.push("/dashboard/resources")
  } catch {
   alert("Something went wrong. Please try again.")
  } finally {
   setBorrowing(false)
  }
 }

 async function handleInitiateReturn() {
  if (!borrowRequestId) return
  setReturning(true)
  try {
   const res = await fetch("/api/borrow/initiate-return", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requestId: borrowRequestId }),
   })
   if (res.ok) {
    alert("Return initiated! The owner has been notified to confirm.")
    setBorrowRequestId(null)
    // Reload resource
    const resData = await fetch(`/api/resources/${params.id}`)
    if (resData.ok) setResource(await resData.json())
   } else {
    const err = await res.json()
    alert(err.error || "Failed to initiate return")
   }
  } finally {
   setReturning(false)
  }
 }

 async function handleReviewSubmit(e: React.FormEvent) {
  e.preventDefault()
  if (!comment.trim()) return
  setSubmittingReview(true)
  try {
   await fetch("/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
     resourceId: params.id,
     rating,
     comment,
    }),
   })
   setComment("")
   setRating(5)
   const res = await fetch(`/api/resources/${params.id}`)
   if (res.ok) setResource(await res.json())
  } finally {
   setSubmittingReview(false)
  }
 }

 if (loading) {
  return (
   <div className="max-w-4xl mx-auto p-8">
    <Card className="bg-card/50 border-border/50">
     <CardContent className="p-8"><div className="h-64 bg-muted rounded animate-pulse" /></CardContent>
    </Card>
   </div>
  )
 }

 if (!resource) {
  return (
   <div className="max-w-4xl mx-auto p-8 text-center">
    <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-40" />
    <p className="text-lg font-medium mb-2">Resource not found</p>
    <Link href="/resources">
     <Button variant="outline">Browse Resources</Button>
    </Link>
   </div>
  )
 }

 return (
  <div className="max-w-4xl mx-auto p-8 space-y-6">
   <Link href="/resources" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
    <ArrowLeft className="w-4 h-4" /> Back to Resources
   </Link>

   <Card className="bg-card/60 border-border/50 overflow-hidden">
    <div className="h-48 bg-gradient-to-br from-primary/10 via-chart-2/5 to-chart-3/10 flex items-center justify-center">
     <Package className="w-16 h-16 text-primary/40" />
    </div>
    <CardHeader>
     <div className="flex items-start justify-between">
      <div>
       <CardTitle className="text-2xl">{resource.title}</CardTitle>
       <div className="flex items-center gap-3 mt-2">
        <Badge variant="outline">{resource.category}</Badge>
        <Badge variant={resource.available ? "default" : "secondary"}>
         {resource.available ? "Available" : "Borrowed"}
        </Badge>
       </div>
      </div>
     </div>
    </CardHeader>
    <CardContent className="space-y-4">
     <p className="text-muted-foreground">{resource.description}</p>
     <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <User className="w-4 h-4" />
      <span>Shared by {resource.owner?.name || resource.owner?.email}</span>
     </div>
     <div className="flex gap-3">
      {resource.available && (
       <Button onClick={handleBorrow} disabled={borrowing} className="gap-2">
        {borrowing && <Loader2 className="w-4 h-4 animate-spin" />}
        Request to Borrow
       </Button>
      )}
      {borrowRequestId && (
       <Button
        variant="outline"
        onClick={handleInitiateReturn}
        disabled={returning}
        className="gap-2"
       >
        {returning ? (
         <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
         <ArrowUpFromLine className="w-4 h-4" />
        )}
        Initiate Return
       </Button>
      )}
     </div>
    </CardContent>
   </Card>

   <Separator />

   {/* Reviews Section */}
   <div>
    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
     <Star className="w-5 h-5" /> Reviews ({resource.reviews?.length || 0})
    </h2>

    {resource.reviews?.length > 0 ? (
     <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
      {resource.reviews.map((review: any) => (
       <ReviewCard key={review.id} review={review} />
      ))}
     </div>
    ) : (
     <p className="text-muted-foreground text-sm mb-6">No reviews yet. Be the first to review!</p>
    )}

    {/* Write a Review */}
    <Card className="bg-card/60 border-border/50">
     <CardHeader>
      <CardTitle className="text-base">Write a Review</CardTitle>
     </CardHeader>
     <CardContent>
      <form onSubmit={handleReviewSubmit} className="space-y-4">
       <div className="space-y-2">
        <Label>Rating</Label>
        <div className="flex items-center gap-1">
         {Array.from({ length: 5 }).map((_, i) => (
          <button
           key={i}
           type="button"
           onClick={() => setRating(i + 1)}
           className="p-0.5"
          >
           <Star
            className={`w-6 h-6 cursor-pointer transition-colors ${
             i < rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground/30 hover:text-yellow-400/50"
            }`}
           />
          </button>
         ))}
        </div>
       </div>
       <div className="space-y-2">
        <Label htmlFor="comment">Comment</Label>
        <Textarea
         id="comment"
         placeholder="Share your experience..."
         rows={3}
         value={comment}
         onChange={(e) => setComment(e.target.value)}
         required
        />
       </div>
       <Button type="submit" disabled={submittingReview}>
        {submittingReview && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        Submit Review
       </Button>
      </form>
     </CardContent>
    </Card>
   </div>
  </div>
 )
}
