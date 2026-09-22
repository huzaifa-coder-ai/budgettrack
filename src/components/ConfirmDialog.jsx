import { useEffect } from "react";

export default function ConfirmDialog({ open, message, onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="confirmation-overlay"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
    >
      <div className="confirmation" onClick={(e) => e.stopPropagation()}>
        <p>{message}</p>
        <div className="yes-no">
          <button onClick={onConfirm}>Yes</button>
          <button onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
}