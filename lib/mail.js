export async function sendMail(to, subject, html) {
  if (!process.env.RESEND_API_KEY) { console.log("[DEV MAIL]", to, subject, html); return; }
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.MAIL_FROM, to, subject, html }),
  });
  if (!r.ok) console.error("mail failed:", await r.text());
}
