import { prisma } from "@/lib/prisma"

export async function DELETE(req:Request){

 const {resourceId} = await req.json()

 await prisma.resource.delete({

  where:{id:resourceId}

 })

 return Response.json({
  message:"Resource removed"
 })

}