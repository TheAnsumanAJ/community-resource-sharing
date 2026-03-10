import { prisma } from "@/lib/prisma"

export async function POST(req:Request){

 const body = await req.json()

 const review = await prisma.review.create({

  data:{
   rating: body.rating,
   comment: body.comment,
   reviewerId: body.reviewerId,
   userId: body.userId
  }

 })

 return Response.json(review)

}