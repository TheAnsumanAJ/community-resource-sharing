import { currentUser } from "@clerk/nextjs/server"

export default async function Profile(){

 const user = await currentUser()

 return(

  <div className="p-10">

   <h1 className="text-2xl font-bold">
    Profile
   </h1>

   <p>Email: {user?.emailAddresses[0].emailAddress}</p>
   <p>Name: {user?.firstName}</p>

  </div>

 )

}