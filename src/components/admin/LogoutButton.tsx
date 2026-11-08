import { useState } from "react";

export function LogoutButton() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return <><button type="button" className="cms-text-button" disabled={busy} onClick={async () => {
    if (document.querySelector('[data-unsaved="true"]')) { setError("変更を保存してからログアウトしてください。"); return; }
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/admin/logout", { method: "POST" });
      if (!response.ok) throw new Error();
      window.location.assign("/admin/login");
    } catch { setError("ログアウトできませんでした。"); setBusy(false); }
  }}>{busy ? "処理中…" : "ログアウト"}</button>{error && <span role="alert">{error}</span>}</>;
}
