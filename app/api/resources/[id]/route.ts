import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { NextRequest } from "next/server"

export async function GET(
 req: NextRequest,
 { params }: { params: Promise<{ id: string }> }
) {
 const { id } = await params

 const resource = await prisma.resource.findUnique({
  where: { id },
  include: {
   owner: true,
   reviews: { include: { reviewer: true }, orderBy: { createdAt: "desc" } },
  },
 })

 if (!resource) {
  return Response.json({ error: "Not found" }, { status: 404 })
 }

 return Response.json(resource)
}

export async function PUT(
 req: NextRequest,
 { params }: { params: Promise<{ id: string }> }
) {
 const { userId } = await auth()
 const { id } = await params

 if (!userId) {
  return Response.json({ error: "Unauthorized" }, { status: 401 })
 }

 const existing = await prisma.resource.findUnique({ where: { id } })
 if (!existing || existing.ownerId !== userId) {
  return Response.json({ error: "Forbidden" }, { status: 403 })
 }

 const body = await req.json()

 const resource = await prisma.resource.update({
  where: { id },
  data: {
   title: body.title,
   description: body.description,
   category: body.category,
  },
 })

 return Response.json(resource)
}

export async function DELETE(
 req: NextRequest,
 { params }: { params: Promise<{ id: string }> }
) {
 const { userId } = await auth()
 const { id } = await params

 if (!userId) {
  return Response.json({ error: "Unauthorized" }, { status: 401 })
 }

 const existing = await prisma.resource.findUnique({ where: { id } })
 if (!existing || existing.ownerId !== userId) {
  return Response.json({ error: "Forbidden" }, { status: 403 })
 }

 await prisma.resource.delete({ where: { id } })

 return Response.json({ success: true })
}