import Sidebar from "@/components/Sidebar"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function DashboardLayout({
 children,
}: {
 children: React.ReactNode
}) {
 return (
  <div className="min-h-screen flex flex-col">
   <Navbar />
   <div className="flex flex-1">
    <Sidebar />
    <main className="flex-1 p-8 overflow-auto">
     {children}
    </main>
   </div>
   <Footer />
  </div>
 )
}