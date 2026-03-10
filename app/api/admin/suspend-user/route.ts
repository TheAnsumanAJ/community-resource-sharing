import { prisma } from "@/lib/prisma"

export async function POST(req:Request){

 const {userId} = await req.json()

 const user = await prisma.user.update({

  where:{id:userId},

  data:{suspended:true}

 })

 return Response.json(user)

}