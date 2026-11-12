import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import SignOut from "@/components/SignOut";

export default async function Home() {
  const s = await getServerSession(authOptions);
  if (!s) redirect("/login");
  return (
    <main className="home">
      <header><b>◆ YourApp</b><SignOut /></header>
      <section>
        <h1>Hello, {s.user.name || s.user.email}</h1>
        <p>You're logged in. Build your website from here.</p>
      </section>
    </main>
  );
}
