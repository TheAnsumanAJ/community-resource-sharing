import { prisma } from "@/lib/prisma"

export async function POST(req:Request){

 const body = await req.json()

 const notification = await prisma.notification.create({

  data:{
   userId:body.userId,
   message:body.message
  }

 })

 return Response.json(notification)

}

