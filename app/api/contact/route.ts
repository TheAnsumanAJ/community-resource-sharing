import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
 try {
  const { name, email, message } = await req.json()

  if (!name || !email || !message) {
   return Response.json({ error: "All fields are required" }, { status: 400 })
  }

  const { data, error } = await resend.emails.send({
   from: "CommunityShare <onboarding@resend.dev>",
   to: process.env.DEVELOPER_EMAIL || "ajthecreator07@gmail.com",
   subject: `New Contact from ${name} — CommunityShare`,
   html: `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
     <h2 style="color: #7c3aed;">New Contact Message</h2>
     <p><strong>Name:</strong> ${name}</p>
     <p><strong>Email:</strong> ${email}</p>
     <hr style="border-color: #eee;" />
     <p><strong>Message:</strong></p>
     <p style="background: #f8f7ff; padding: 16px; border-radius: 8px;">${message}</p>
     <hr style="border-color: #eee;" />
     <p style="color: #999; font-size: 12px;">Sent from CommunityShare Contact Form</p>
    </div>
   `,
  })

  if (error) {
   return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ success: true, id: data?.id })
 } catch {
  return Response.json({ error: "Failed to send email" }, { status: 500 })
 }
}
