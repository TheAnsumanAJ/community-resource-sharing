import Link from "next/link"

export default function Home(){

 return(

  <div className="flex flex-col items-center justify-center h-screen gap-6">

   <h1 className="text-4xl font-bold">
    Community Resource Sharing
   </h1>

   <div className="flex gap-4">

    <Link href="/sign-in" className="bg-blue-600 px-6 py-2 rounded">
     Login
    </Link>

    <Link href="/sign-up" className="bg-green-600 px-6 py-2 rounded">
     Sign Up
    </Link>

   </div>

  </div>

 )

}