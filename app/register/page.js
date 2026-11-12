"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import AuthShell from "@/components/AuthShell";
import Field from "@/components/Field";
import GoogleButton from "@/components/GoogleButton";

export default function Register() {
  const router = useRouter();
  const [f, setF] = useState({ name: "", username: "", email: "", password: "", confirm: "" });
  const [err, setErr] = useState(""), [busy, setBusy] = useState(false);
  const set = (k) => (v) => setF({ ...f, [k]: v });

  async function submit(e) {
    e.preventDefault(); setErr("");
    if (f.password !== f.confirm) return setErr("Passwords don't match.");
    setBusy(true);
    const r = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    if (!r.ok) { setBusy(false); return setErr((await r.json()).error || "Something went wrong."); }
    await signIn("credentials", { identifier: f.email, password: f.password, redirect: false });
    router.push("/home"); router.refresh();
  }

  return (
    <AuthShell title="Create account" subtitle="It takes less than a minute.">
      <form onSubmit={submit}>
        <Field label="Full name" value={f.name} onChange={set("name")} autoComplete="name" />
        <Field label="Username" value={f.username} onChange={set("username")} autoComplete="username" />
        <Field label="Email" type="email" value={f.email} onChange={set("email")} autoComplete="email" />
        <Field label="Password" type="password" value={f.password} onChange={set("password")} autoComplete="new-password" />
        <Field label="Confirm password" type="password" value={f.confirm} onChange={set("confirm")} autoComplete="new-password" />
        {err && <p className="err">{err}</p>}
        <button className="btn" disabled={busy}>{busy ? "Creating…" : "Create account"}</button>
      </form>
      <div className="or"><span>or</span></div>
      <GoogleButton label="Sign up with Google" />
      <p className="foot">Already have an account? <Link href="/login">Log in</Link></p>
    </AuthShell>
  );
}
