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
   <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
    <Sidebar />
    <main className="flex-1 p-4 md:p-8 overflow-auto">
     {children}
    </main>
   </div>
   <Footer />
  </div>
 )
}