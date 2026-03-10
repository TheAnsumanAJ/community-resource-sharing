import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function GET() {
 const { userId } = await auth()

 if (!userId) {
  return Response.json({ error: "Unauthorized" }, { status: 401 })
 }

 const notifications = await prisma.notification.findMany({
  where: { userId },
  orderBy: { createdAt: "desc" },
  take: 50,
 })

 return Response.json(notifications)
}

export async function PUT(req: Request) {
 const { userId } = await auth()

 if (!userId) {
  return Response.json({ error: "Unauthorized" }, { status: 401 })
 }

 const body = await req.json()

 if (body.markAllRead) {
  await prisma.notification.updateMany({
   where: { userId, read: false },
   data: { read: true },
  })
  return Response.json({ success: true })
 }

 const notification = await prisma.notification.update({
  where: { id: body.id },
  data: { read: body.read ?? true },
 })

 return Response.json(notification)
}