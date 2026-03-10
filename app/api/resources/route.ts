import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function GET(req: Request) {
 const { searchParams } = new URL(req.url)
 const search = searchParams.get("search") || ""
 const category = searchParams.get("category") || ""

 const where: any = {}

 if (search) {
  where.title = { contains: search, mode: "insensitive" }
 }

 if (category) {
  where.category = category
 }

 const resources = await prisma.resource.findMany({
  where,
  include: { owner: true },
  orderBy: { createdAt: "desc" },
 })

 return Response.json(resources)
}

export async function POST(req: Request) {
 const { userId } = await auth()

 if (!userId) {
  return Response.json({ error: "Unauthorized" }, { status: 401 })
 }

 const body = await req.json()

 const resource = await prisma.resource.create({
  data: {
   title: body.title,
   description: body.description,
   category: body.category,
   ownerId: userId,
  },
 })

 return Response.json(resource)
}