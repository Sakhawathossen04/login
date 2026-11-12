"use client";
import { useState } from "react";
import Link from "next/link";
import AuthShell from "@/components/AuthShell";
import Field from "@/components/Field";

export default function Reset() {
  const [pw, setPw] = useState(""), [err, setErr] = useState(""), [done, setDone] = useState(false), [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault(); setErr(""); setBusy(true);
    const token = new URLSearchParams(location.search).get("token") || "";
    const r = await fetch("/api/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, password: pw }) });
    setBusy(false);
    if (!r.ok) return setErr((await r.json()).error || "Something went wrong.");
    setDone(true);
  }
  return (
    <AuthShell title="New password" subtitle="Choose a strong password.">
      {done ? <p className="ok">Password updated. You can log in now.</p> : (
        <form onSubmit={submit}>
          <Field label="New password" type="password" value={pw} onChange={setPw} autoComplete="new-password" />
          {err && <p className="err">{err}</p>}
          <button className="btn" disabled={busy}>{busy ? "Saving…" : "Save password"}</button>
        </form>
      )}
      <p className="foot"><Link href="/login">Go to log in</Link></p>
    </AuthShell>
  );
}
