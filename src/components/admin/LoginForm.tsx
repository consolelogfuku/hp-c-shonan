import { useState, type FormEvent } from "react";

export function LoginForm() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const password = new FormData(event.currentTarget).get("password");
    try {
      const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "ログインできませんでした。");
      window.location.replace("/admin/news");
    } catch (error) { setError(error instanceof Error ? error.message : "ログインできませんでした。"); }
    finally { setBusy(false); }
  }
  return <form onSubmit={submit} className="cms-form"><label className="cms-field">管理パスワード<input name="password" type="password" autoComplete="current-password" required maxLength={512} autoFocus /></label>{error && <p role="alert" className="cms-error">{error}</p>}<button className="cms-button cms-primary" disabled={busy}>{busy ? "ログイン中…" : "ログイン"}</button></form>;
}
