"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Loader2, CheckCircle, Send } from "lucide-react"
import Footer from "@/components/Footer"

export default function ContactPage() {
 const [name, setName] = useState("")
 const [email, setEmail] = useState("")
 const [message, setMessage] = useState("")
 const [sending, setSending] = useState(false)
 const [sent, setSent] = useState(false)
 const [error, setError] = useState("")

 async function handleSubmit(e: React.FormEvent) {
  e.preventDefault()
  setSending(true)
  setError("")

  try {
   const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, message }),
   })

   if (res.ok) {
    setSent(true)
    setName("")
    setEmail("")
    setMessage("")
   } else {
    const data = await res.json()
    setError(data.error || "Failed to send message")
   }
  } catch {
   setError("Something went wrong. Please try again.")
  } finally {
   setSending(false)
  }
 }

 return (
  <div className="min-h-screen flex flex-col">
   <main className="flex-1 flex items-center justify-center p-8">
    <Card className="w-full max-w-lg bg-card/60 border-border/50">
     <CardHeader className="text-center">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
       <Mail className="w-7 h-7 text-primary" />
      </div>
      <CardTitle className="text-2xl">Contact Developer</CardTitle>
      <p className="text-sm text-muted-foreground mt-1">
       Have a question or feedback? Send a message directly to the developer.
      </p>
     </CardHeader>
     <CardContent>
      {sent ? (
       <div className="text-center py-8">
        <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-1">Message Sent!</h3>
        <p className="text-sm text-muted-foreground mb-4">
         Thanks for reaching out. The developer will get back to you soon.
        </p>
        <Button variant="outline" onClick={() => setSent(false)}>
         Send Another Message
        </Button>
       </div>
      ) : (
       <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
         <Label htmlFor="name">Name</Label>
         <Input
          id="name"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
         />
        </div>
        <div className="space-y-2">
         <Label htmlFor="email">Email</Label>
         <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
         />
        </div>
        <div className="space-y-2">
         <Label htmlFor="message">Message</Label>
         <Textarea
          id="message"
          placeholder="Write your message..."
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
         />
        </div>
        {error && (
         <p className="text-sm text-red-400">{error}</p>
        )}
        <Button type="submit" disabled={sending} className="w-full gap-2">
         {sending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
         ) : (
          <Send className="w-4 h-4" />
         )}
         {sending ? "Sending..." : "Send Message"}
        </Button>
       </form>
      )}
     </CardContent>
    </Card>
   </main>
   <Footer />
  </div>
 )
}