"use client"

import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

type ReviewType = {
 id: string
 rating: number
 comment: string
 createdAt: string
 reviewer?: { name?: string; email: string }
}

export default function ReviewCard({ review }: { review: ReviewType }) {
 return (
  <Card className="bg-card/60 border-border/50">
   <CardContent className="p-5">
    <div className="flex items-center justify-between mb-2">
     <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
       <Star
        key={i}
        className={`w-4 h-4 ${
         i < review.rating
          ? "fill-yellow-400 text-yellow-400"
          : "text-muted-foreground/30"
        }`}
       />
      ))}
     </div>
     <span className="text-xs text-muted-foreground">
      {new Date(review.createdAt).toLocaleDateString()}
     </span>
    </div>
    <p className="text-sm text-foreground mb-2">{review.comment}</p>
    <p className="text-xs text-muted-foreground">
     — {review.reviewer?.name || review.reviewer?.email || "Anonymous"}
    </p>
   </CardContent>
  </Card>
 )
}
