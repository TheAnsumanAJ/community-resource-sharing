import { prisma } from "@/lib/prisma"
import { auth, currentUser } from "@clerk/nextjs/server"

export async function GET() {
 const { userId } = await auth()

 if (!userId) {
  return Response.json({ error: "Unauthorized" }, { status: 401 })
 }

 // Get requests where user is borrower OR owner of the resource
 const requests = await prisma.borrowRequest.findMany({
  where: {
   OR: [
    { borrowerId: userId },
    { resource: { ownerId: userId } },
   ],
  },
  include: {
   resource: { include: { owner: true } },
   borrower: true,
  },
  orderBy: { createdAt: "desc" },
 })

 return Response.json(requests)
}

export async function POST(req: Request) {
 const { userId } = await auth()

 if (!userId) {
  return Response.json({ error: "Unauthorized" }, { status: 401 })
 }

 // Ensure user exists in DB
 let user = await prisma.user.findUnique({ where: { id: userId } })
 if (!user) {
  const clerkUser = await currentUser()
  user = await prisma.user.create({
   data: {
    id: userId,
    email: clerkUser?.emailAddresses[0]?.emailAddress || "",
    name: `${clerkUser?.firstName || ""} ${clerkUser?.lastName || ""}`.trim() || null,
   },
  })
 }

 const body = await req.json()

 // Check if resource is available
 const resource = await prisma.resource.findUnique({
  where: { id: body.resourceId },
 })

 if (!resource) {
  return Response.json({ error: "Resource not found" }, { status: 404 })
 }

 if (!resource.available) {
  return Response.json({ error: "Resource not available" }, { status: 400 })
 }

 // Prevent borrowing own resource
 if (resource.ownerId === userId) {
  return Response.json({ error: "Cannot borrow your own resource" }, { status: 400 })
 }

 const request = await prisma.borrowRequest.create({
  data: {
   resourceId: body.resourceId,
   borrowerId: userId,
  },
 })

 // Notify resource owner
 await prisma.notification.create({
  data: {
   message: `Someone requested to borrow "${resource.title}"`,
   userId: resource.ownerId,
  },
 })

 return Response.json(request)
}