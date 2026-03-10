"use client"

import { useEffect, useState } from "react"
import ReviewCard from "@/components/ReviewCard"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

export default function ReviewsPage() {
 const [resources, setResources] = useState<any[]>([])
 const [reviews, setReviews] = useState<Record<string, any[]>>({})
 const [loading, setLoading] = useState(true)

 useEffect(() => {
  async function load() {
   try {
    const res = await fetch("/api/resources")
    if (res.ok) {
     const data = await res.json()
     setResources(data)

     // Load reviews for each resource
     const reviewMap: Record<string, any[]> = {}
     await Promise.all(
      data.slice(0, 20).map(async (r: any) => {
       const reviewRes = await fetch(`/api/reviews?resourceId=${r.id}`)
       if (reviewRes.ok) {
        const reviewData = await reviewRes.json()
        if (reviewData.length > 0) {
         reviewMap[r.id] = reviewData
        }
       }
      })
     )
     setReviews(reviewMap)
    }
   } catch {} finally {
    setLoading(false)
   }
  }
  load()
 }, [])

 const resourcesWithReviews = resources.filter((r) => reviews[r.id]?.length > 0)

 return (
  <div className="space-y-6">
   <div>
    <h1 className="text-3xl font-bold tracking-tight mb-1">Reviews</h1>
    <p className="text-muted-foreground">Browse reviews from the community</p>
   </div>

   {loading ? (
    <div className="space-y-4">
     {[1, 2, 3].map((i) => (
      <Card key={i} className="bg-card/50 border-border/50">
       <CardContent className="p-6"><div className="h-24 bg-muted rounded animate-pulse" /></CardContent>
      </Card>
     ))}
    </div>
   ) : resourcesWithReviews.length === 0 ? (
    <Card className="bg-card/50 border-border/50">
     <CardContent className="p-12 text-center text-muted-foreground">
      <Star className="w-12 h-12 mx-auto mb-4 opacity-40" />
      <p className="text-lg font-medium mb-1">No reviews yet</p>
      <p className="text-sm">Reviews will appear here when community members rate resources.</p>
     </CardContent>
    </Card>
   ) : (
    <div className="space-y-6">
     {resourcesWithReviews.map((resource) => (
      <div key={resource.id}>
       <h3 className="text-lg font-semibold mb-3">{resource.title}</h3>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {reviews[resource.id].map((review: any) => (
         <ReviewCard key={review.id} review={review} />
        ))}
       </div>
      </div>
     ))}
    </div>
   )}
  </div>
 )
}
