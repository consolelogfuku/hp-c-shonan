import { useEffect, useId, useRef, type ReactNode } from "react";

export function ConfirmDialog({ open, title, children, confirmLabel, busyLabel, busy = false, tone = "primary", onConfirm, onClose }: {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  busyLabel?: string;
  busy?: boolean;
  tone?: "primary" | "danger";
  onConfirm: () => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  const descriptionId = useId();
  useEffect(() => {
    if (open && !dialog.current?.open) dialog.current?.showModal();
    if (!open && dialog.current?.open) dialog.current.close();
  }, [open]);
  return <dialog ref={dialog} className="cms-dialog cms-confirm-dialog" aria-labelledby={headingId} aria-describedby={descriptionId} onCancel={(event) => { if (busy) event.preventDefault(); else onClose(); }} onClose={onClose}>
    <div className="cms-confirm-content">
      <p className="cms-eyebrow">Confirmation</p>
      <h2 id={headingId}>{title}</h2>
      <div id={descriptionId} className="cms-confirm-description">{children}</div>
    </div>
    <div className="cms-dialog-footer">
      <button className="cms-button" type="button" disabled={busy} onClick={onClose}>キャンセル</button>
      <button className={`cms-button ${tone === "danger" ? "cms-danger-button" : "cms-primary"}`} type="button" disabled={busy} onClick={onConfirm}>{busy ? busyLabel || `${confirmLabel}中…` : confirmLabel}</button>
    </div>
  </dialog>;
}
