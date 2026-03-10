import { prisma } from "@/lib/prisma"

export async function POST(req:Request){

 const {requestId} = await req.json()

 const request = await prisma.borrowRequest.update({

  where:{id:requestId},

  data:{status:"approved"}

 })

 return Response.json(request)

}