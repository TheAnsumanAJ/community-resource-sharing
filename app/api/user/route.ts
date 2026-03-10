import { prisma } from "@/lib/prisma"
import { auth, currentUser } from "@clerk/nextjs/server"

export async function GET() {
 const { userId } = await auth()

 if (!userId) {
  return Response.json({ error: "Unauthorized" }, { status: 401 })
 }

 const clerkUser = await currentUser()

 // Upsert user in database
 let user = await prisma.user.findUnique({ where: { id: userId } })

 if (!user) {
  user = await prisma.user.create({
   data: {
    id: userId,
    email: clerkUser?.emailAddresses[0]?.emailAddress || "",
    name: `${clerkUser?.firstName || ""} ${clerkUser?.lastName || ""}`.trim() || null,
    avatar: clerkUser?.imageUrl || null,
   },
  })
 }

 return Response.json(user)
}

export async function PUT(req: Request) {
 const { userId } = await auth()

 if (!userId) {
  return Response.json({ error: "Unauthorized" }, { status: 401 })
 }

 const body = await req.json()

 const user = await prisma.user.update({
  where: { id: userId },
  data: {
   name: body.name,
   phone: body.phone,
   bio: body.bio,
  },
 })

 return Response.json(user)
}
