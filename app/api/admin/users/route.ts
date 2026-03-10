import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function GET() {
 const { userId } = await auth()

 if (!userId) {
  return Response.json({ error: "Unauthorized" }, { status: 401 })
 }

 // Check if user is admin
 const user = await prisma.user.findUnique({ where: { id: userId } })
 if (!user || user.role !== "admin") {
  return Response.json({ error: "Forbidden" }, { status: 403 })
 }

 const users = await prisma.user.findMany({
  orderBy: { createdAt: "desc" },
  include: {
   _count: {
    select: { resources: true, borrowRequests: true },
   },
  },
 })

 return Response.json(users)
}

export async function PUT(req: Request) {
 const { userId } = await auth()

 if (!userId) {
  return Response.json({ error: "Unauthorized" }, { status: 401 })
 }

 const admin = await prisma.user.findUnique({ where: { id: userId } })
 if (!admin || admin.role !== "admin") {
  return Response.json({ error: "Forbidden" }, { status: 403 })
 }

 const body = await req.json()

 const user = await prisma.user.update({
  where: { id: body.userId },
  data: { role: body.role },
 })

 return Response.json(user)
}

export async function DELETE(req: Request) {
 const { userId } = await auth()

 if (!userId) {
  return Response.json({ error: "Unauthorized" }, { status: 401 })
 }

 const admin = await prisma.user.findUnique({ where: { id: userId } })
 if (!admin || admin.role !== "admin") {
  return Response.json({ error: "Forbidden" }, { status: 403 })
 }

 const { searchParams } = new URL(req.url)
 const targetId = searchParams.get("id")

 if (!targetId) {
  return Response.json({ error: "User ID required" }, { status: 400 })
 }

 await prisma.user.delete({ where: { id: targetId } })

 return Response.json({ success: true })
}
