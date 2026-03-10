import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"
import { Geist } from "next/font/google"
import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

export const metadata = {
 title: "CommunityShare — Share Resources With Your Community",
 description:
  "A platform where neighbors share tools, books, and equipment. Borrow what you need, lend what you have.",
}

export default function RootLayout({
 children,
}: {
 children: React.ReactNode
}) {
 return (
  <ClerkProvider
   appearance={{
    variables: {
     colorPrimary: "#7c3aed",
     colorBackground: "#ffffff",
     colorText: "#1a1a2e",
     colorTextSecondary: "#64648b",
     colorInputBackground: "#f8f7ff",
     colorInputText: "#1a1a2e",
     colorNeutral: "#1a1a2e",
     borderRadius: "0.75rem",
    },
    elements: {
     card: "shadow-xl border border-gray-100",
     formButtonPrimary: "bg-violet-600 hover:bg-violet-700 text-white",
     footerActionLink: "text-violet-600 hover:text-violet-700",
    },
   }}
  >
   <html lang="en" className={cn("dark font-sans antialiased", geist.variable)}>
    <body className="bg-background text-foreground min-h-screen">
     <TooltipProvider delayDuration={200}>
      {children}
     </TooltipProvider>
    </body>
   </html>
  </ClerkProvider>
 )
}