import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validate";

export async function POST(req) {
  const p = registerSchema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: p.error.issues[0].message }, { status: 400 });
  const { name, username, email, password } = p.data;
  const exists = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
  if (exists) return NextResponse.json({ error: "Email or username already in use" }, { status: 409 });
  await prisma.user.create({ data: { name, username, email, passwordHash: await bcrypt.hash(password, 12) } });
  return NextResponse.json({ ok: true }, { status: 201 });
}
