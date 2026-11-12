"use client";
import { useState } from "react";
export default function Field({ label, type = "text", value, onChange, ...rest }) {
  const [show, setShow] = useState(false);
  const isPw = type === "password";
  return (
    <label className="field">
      <span>{label}</span>
      <input type={isPw && show ? "text" : type} value={value} onChange={(e) => onChange(e.target.value)} required {...rest} />
      {isPw && <button type="button" className="eye" onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</button>}
    </label>
  );
}
