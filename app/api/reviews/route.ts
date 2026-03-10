import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function GET(req: Request) {
 const { searchParams } = new URL(req.url)
 const resourceId = searchParams.get("resourceId")

 if (!resourceId) {
  return Response.json({ error: "resourceId required" }, { status: 400 })
 }

 const reviews = await prisma.review.findMany({
  where: { resourceId },
  include: { reviewer: true },
  orderBy: { createdAt: "desc" },
 })

 return Response.json(reviews)
}

export async function POST(req: Request) {
 const { userId } = await auth()

 if (!userId) {
  return Response.json({ error: "Unauthorized" }, { status: 401 })
 }

 const body = await req.json()

 if (!body.resourceId || !body.rating || !body.comment) {
  return Response.json({ error: "Missing fields" }, { status: 400 })
 }

 const review = await prisma.review.create({
  data: {
   rating: body.rating,
   comment: body.comment,
   resourceId: body.resourceId,
   reviewerId: userId,
  },
 })

 return Response.json(review)
}
