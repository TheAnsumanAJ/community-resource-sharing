import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function POST(req: Request) {
 const { userId } = await auth()
 if (!userId) {
  return Response.json({ error: "Unauthorized" }, { status: 401 })
 }

 const { requestId } = await req.json()

 const borrowRequest = await prisma.borrowRequest.update({
  where: { id: requestId },
  data: { status: "approved" },
  include: { resource: true },
 })

 // Mark resource as unavailable
 await prisma.resource.update({
  where: { id: borrowRequest.resourceId },
  data: { available: false },
 })

 // Notify borrower
 await prisma.notification.create({
  data: {
   message: `Your request to borrow "${borrowRequest.resource.title}" was approved!`,
   userId: borrowRequest.borrowerId,
  },
 })

 return Response.json(borrowRequest)
}