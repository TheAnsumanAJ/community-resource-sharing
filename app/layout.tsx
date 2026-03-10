import { ClerkProvider } from "@clerk/nextjs"
import Navbar from "@/components/Navbar"
import "./globals.css"
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
 children,
}: {
 children: React.ReactNode
}) {
 return (
  <ClerkProvider>
   <html lang="en" className={cn("font-sans", geist.variable)}>
    <body className="bg-black text-white">
     <Navbar />
     {children}
    </body>
   </html>
  </ClerkProvider>
 )
}