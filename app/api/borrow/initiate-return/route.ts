import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function POST(req: Request) {
 const { userId } = await auth()

 if (!userId) {
  return Response.json({ error: "Unauthorized" }, { status: 401 })
 }

 const { requestId } = await req.json()

 // Verify the borrower is the one initiating
 const borrowRequest = await prisma.borrowRequest.findUnique({
  where: { id: requestId },
  include: { resource: true },
 })

 if (!borrowRequest) {
  return Response.json({ error: "Request not found" }, { status: 404 })
 }

 if (borrowRequest.borrowerId !== userId) {
  return Response.json({ error: "Only the borrower can initiate a return" }, { status: 403 })
 }

 // Update status to return_initiated
 const updated = await prisma.borrowRequest.update({
  where: { id: requestId },
  data: { status: "return_initiated" },
  include: { resource: true },
 })

 // Notify the resource owner
 await prisma.notification.create({
  data: {
   message: `The borrower wants to return "${updated.resource.title}". Please confirm the return.`,
   userId: updated.resource.ownerId,
  },
 })

 return Response.json(updated)
}
