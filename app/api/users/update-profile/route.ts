import { prisma } from "@/lib/prisma"

export async function POST(req:Request){

 const body = await req.json()

 const user = await prisma.user.update({

  where:{id:body.userId},

  data:{
   name:body.name,
   phone:body.phone,
   address:body.address
  }

 })

 return Response.json(user)

}