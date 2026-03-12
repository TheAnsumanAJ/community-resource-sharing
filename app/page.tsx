import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Footer from "@/components/Footer"
import {
 Package, Search, ArrowRightLeft, Star, Bell, Shield, ArrowRight
} from "lucide-react"

const features = [
 {
  icon: Package,
  title: "Resource Sharing",
  desc: "List tools, books, equipment and more for your community to borrow."
 },
 {
  icon: Search,
  title: "Smart Search",
  desc: "Find exactly what you need with powerful search and category filters."
 },
 {
  icon: ArrowRightLeft,
  title: "Borrow System",
  desc: "Request to borrow, accept or reject requests, and confirm returns seamlessly."
 },
 {
  icon: Star,
  title: "Reviews & Ratings",
  desc: "Rate resources and leave reviews to help the community make better choices."
 },
 {
  icon: Bell,
  title: "Notifications",
  desc: "Stay updated with real-time notifications on borrow requests and returns."
 },
 {
  icon: Shield,
  title: "Admin Panel",
  desc: "Powerful admin controls for user management, stats, and platform oversight."
 },
]

export default function Home() {
 return (
  <div className="min-h-screen bg-background relative overflow-hidden">
   {/* Glow effects */}
   <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-primary/10 blur-[120px] animate-pulse-glow pointer-events-none" />
   <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-chart-2/10 blur-[100px] animate-pulse-glow pointer-events-none" />

   {/* Nav */}
   <nav className="relative z-10 flex items-center justify-between px-4 sm:px-8 py-5 max-w-7xl mx-auto gap-2">
    <div className="flex items-center gap-2 min-w-0">
     <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
      <Package className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
     </div>
     <span className="text-base sm:text-lg font-bold tracking-tight truncate">CommunityShare</span>
    </div>
    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
     <Link href="/sign-in" className="hidden sm:block">
      <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
       Sign In
      </Button>
     </Link>
     <Link href="/sign-up">
      <Button className="gap-2">
       Get Started <ArrowRight className="w-4 h-4" />
      </Button>
     </Link>
    </div>
   </nav>

   {/* Hero */}
   <section className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-16 max-w-4xl mx-auto">
    <div className="animate-fade-in-up">
     <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
      ✨ Share resources, build community
     </span>
     <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
      Share resources{" "}
      <span className="bg-gradient-to-r from-primary via-chart-2 to-chart-1 bg-clip-text text-transparent">
       with your community
      </span>
     </h1>
     <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
      A platform where neighbors share tools, books, and equipment.
      Borrow what you need, lend what you have, and strengthen your community together.
     </p>
     <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-sm sm:max-w-none mx-auto">
      <Link href="/sign-up" className="w-full sm:w-auto">
       <Button size="lg" className="text-base px-8 gap-2 shadow-lg shadow-primary/25 w-full">
        Start Sharing <ArrowRight className="w-4 h-4" />
       </Button>
      </Link>
      <Link href="/sign-in" className="w-full sm:w-auto">
       <Button size="lg" variant="outline" className="text-base px-8 w-full">
        Sign In to Dashboard
       </Button>
      </Link>
     </div>
    </div>
   </section>

   {/* Features */}
   <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
    <div className="text-center mb-14 animate-fade-in" style={{ animationDelay: "0.2s", opacity: 0 }}>
     <h2 className="text-3xl md:text-4xl font-bold mb-4">
      Everything you need to share resources
     </h2>
     <p className="text-muted-foreground text-lg max-w-xl mx-auto">
      A complete platform for community resource sharing with powerful tools for both users and admins.
     </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
     {features.map((feat, i) => (
      <Card
       key={feat.title}
       className="group bg-card/50 border-border/50 backdrop-blur-sm hover:bg-card/80 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
       style={{ animationDelay: `${0.1 * (i + 1)}s`, opacity: 0 }}
      >
       <CardContent className="p-6">
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
         <feat.icon className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{feat.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
       </CardContent>
      </Card>
     ))}
    </div>
   </section>

    {/* Footer */}
    <div className="relative z-10">
     <Footer />
    </div>
  </div>
 )
}