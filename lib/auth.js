import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

const MAX_FAILS = 5, LOCK_MIN = 15;
const DUMMY = bcrypt.hashSync("dummy-password", 12); // equalises timing so attackers can't detect valid emails

export const authOptions = {
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  pages: { signIn: "/login", error: "/login" },
  providers: [
    GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET }),
    CredentialsProvider({
      credentials: {},
      async authorize(c) {
        const id = String(c?.identifier || "").trim().toLowerCase();
        const pw = String(c?.password || "");
        if (!id || !pw) return null;
        const u = await prisma.user.findFirst({ where: { OR: [{ email: id }, { username: id }] } });
        if (!u || !u.passwordHash) { await bcrypt.compare(pw, DUMMY); return null; }
        if (u.lockedUntil && u.lockedUntil > new Date()) throw new Error("LOCKED");
        if (!(await bcrypt.compare(pw, u.passwordHash))) {
          const f = u.failedAttempts + 1;
          await prisma.user.update({
            where: { id: u.id },
            data: f >= MAX_FAILS
              ? { failedAttempts: 0, lockedUntil: new Date(Date.now() + LOCK_MIN * 60000) }
              : { failedAttempts: f },
          });
          return null;
        }
        if (u.failedAttempts || u.lockedUntil)
          await prisma.user.update({ where: { id: u.id }, data: { failedAttempts: 0, lockedUntil: null } });
        return { id: u.id, name: u.name, email: u.email, image: u.image };
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        if (!profile?.email_verified) return false;
        const email = profile.email.toLowerCase();
        await prisma.user.upsert({
          where: { email },
          update: { image: profile.picture },
          create: { email, name: profile.name, image: profile.picture },
        });
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const u = await prisma.user.findUnique({ where: { email: user.email.toLowerCase() } });
        token.id = u?.id; token.username = u?.username;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id; session.user.username = token.username;
      return session;
    },
  },
};
