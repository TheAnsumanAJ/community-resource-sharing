import { prisma } from "@/lib/prisma"

export async function GET(){

 const users = await prisma.user.count()
 const resources = await prisma.resource.count()
 const borrows = await prisma.borrowRequest.count()

 return Response.json({
  users,
  resources,
  borrows
 })

}