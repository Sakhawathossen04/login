import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mail";

export async function POST(req) {
  const { email } = await req.json().catch(() => ({}));
  const e = String(email || "").trim().toLowerCase();
  const u = e ? await prisma.user.findUnique({ where: { email: e } }) : null;
  if (u && u.passwordHash) {
    const raw = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(raw).digest("hex");
    await prisma.resetToken.deleteMany({ where: { userId: u.id } });
    await prisma.resetToken.create({ data: { tokenHash, userId: u.id, expiresAt: new Date(Date.now() + 30 * 60000) } });
    const link = `${process.env.NEXTAUTH_URL}/reset-password?token=${raw}`;
    await sendMail(e, "Reset your password", `<p>Reset your password (valid for 30 minutes):</p><p><a href="${link}">${link}</a></p>`);
  }
  return NextResponse.json({ ok: true }); // same reply whether the email exists or not
}
