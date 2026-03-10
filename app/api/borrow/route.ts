import { prisma } from "@/lib/prisma"

export async function POST(req:Request){

 const body = await req.json()

 const request = await prisma.borrowRequest.create({

  data:{
   resourceId:body.resourceId,
   borrowerId:body.borrowerId
  }

 })

 return Response.json(request)

}