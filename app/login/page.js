"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import AuthShell from "@/components/AuthShell";
import Field from "@/components/Field";
import GoogleButton from "@/components/GoogleButton";

export default function Login() {
  const router = useRouter();
  const [id, setId] = useState(""), [pw, setPw] = useState("");
  const [err, setErr] = useState(""), [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr("");
    const res = await signIn("credentials", { identifier: id, password: pw, redirect: false });
    setBusy(false);
    if (res?.error) return setErr(res.error === "LOCKED" ? "Too many attempts. Try again in 15 minutes." : "Wrong email/username or password.");
    router.push("/home"); router.refresh();
  }

  return (
    <AuthShell title="Log in" subtitle="Use your email or username.">
      <form onSubmit={submit}>
        <Field label="Email or username" value={id} onChange={setId} autoComplete="username" />
        <Field label="Password" type="password" value={pw} onChange={setPw} autoComplete="current-password" />
        <Link className="link right" href="/forgot-password">Forgot your password?</Link>
        {err && <p className="err">{err}</p>}
        <button className="btn" disabled={busy}>{busy ? "Logging in…" : "Log in"}</button>
      </form>
      <div className="or"><span>or</span></div>
      <GoogleButton />
      <p className="foot">Don't have an account? <Link href="/register">Create new account</Link></p>
    </AuthShell>
  );
}
