import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function POST(req: Request) {
 const { userId } = await auth()

 if (!userId) {
  return Response.json({ error: "Unauthorized" }, { status: 401 })
 }

 const { requestId } = await req.json()

 const borrowRequest = await prisma.borrowRequest.findUnique({
  where: { id: requestId },
  include: { resource: true },
 })

 if (!borrowRequest) {
  return Response.json({ error: "Request not found" }, { status: 404 })
 }

 // Only owner can confirm return
 if (borrowRequest.resource.ownerId !== userId) {
  return Response.json({ error: "Only the resource owner can confirm return" }, { status: 403 })
 }

 // Update borrow request
 const request = await prisma.borrowRequest.update({
  where: { id: requestId },
  data: {
   status: "returned",
   returnedAt: new Date(),
  },
  include: { resource: true },
 })

 // Set resource as available again
 await prisma.resource.update({
  where: { id: request.resourceId },
  data: { available: true },
 })

 // Notify borrower that return is confirmed
 await prisma.notification.create({
  data: {
   message: `Your return of "${request.resource.title}" has been confirmed. Thank you!`,
   userId: request.borrowerId,
  },
 })

 return Response.json(request)
}
