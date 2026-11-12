import bcrypt from "bcryptjs";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resetSchema } from "@/lib/validate";

export async function POST(req) {
  const p = resetSchema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: p.error.issues[0].message }, { status: 400 });
  const tokenHash = crypto.createHash("sha256").update(p.data.token).digest("hex");
  const t = await prisma.resetToken.findUnique({ where: { tokenHash } });
  if (!t || t.expiresAt < new Date()) return NextResponse.json({ error: "Link is invalid or expired" }, { status: 400 });
  await prisma.$transaction([
    prisma.user.update({ where: { id: t.userId }, data: { passwordHash: await bcrypt.hash(p.data.password, 12), failedAttempts: 0, lockedUntil: null } }),
    prisma.resetToken.deleteMany({ where: { userId: t.userId } }),
  ]);
  return NextResponse.json({ ok: true });
}
