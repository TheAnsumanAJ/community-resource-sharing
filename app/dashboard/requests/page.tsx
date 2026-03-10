"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

type BorrowRequest = {
 id: string
 resourceId: string
}

export default function Requests(){

 const [requests,setRequests] = useState<BorrowRequest[]>([])

 useEffect(()=>{

  async function load(){

   const res = await fetch("/api/borrow")

   const data = await res.json()

   setRequests(data)

  }

  load()

 },[])

 async function accept(id: string){

  await fetch("/api/borrow/accept",{
   method:"POST",
   headers:{ "Content-Type":"application/json"},
   body:JSON.stringify({requestId:id})
  })

 }

 async function reject(id: string){

  await fetch("/api/borrow/reject",{
   method:"POST",
   headers:{ "Content-Type":"application/json"},
   body:JSON.stringify({requestId:id})
  })

 }

 return(

  <div className="p-10">

   <h1 className="text-2xl font-bold mb-6">
    Borrow Requests
   </h1>

   <div className="space-y-4">

    {requests.map((req)=>(
     
     <div
      key={req.id}
      className="bg-zinc-900 p-4 rounded flex justify-between"
     >

      <span>
       Resource: {req.resourceId}
      </span>

      <div className="flex gap-2">

       <Button onClick={()=>accept(req.id)}>
        Accept
       </Button>

       <Button variant="destructive" onClick={()=>reject(req.id)}>
        Reject
       </Button>

      </div>

     </div>

    ))}

   </div>

  </div>

 )

}