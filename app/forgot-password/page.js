"use client";
import { useState } from "react";
import Link from "next/link";
import AuthShell from "@/components/AuthShell";
import Field from "@/components/Field";

export default function Forgot() {
  const [email, setEmail] = useState(""), [done, setDone] = useState(false), [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault(); setBusy(true);
    await fetch("/api/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    setBusy(false); setDone(true);
  }
  return (
    <AuthShell title="Reset password" subtitle="We'll email you a reset link.">
      {done ? <p className="ok">If an account exists for {email}, a reset link is on its way. It expires in 30 minutes.</p> : (
        <form onSubmit={submit}>
          <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
          <button className="btn" disabled={busy}>{busy ? "Sending…" : "Send reset link"}</button>
        </form>
      )}
      <p className="foot"><Link href="/login">Back to log in</Link></p>
    </AuthShell>
  );
}
