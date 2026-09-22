export default function Toasts({ error, lastDeleted, onUndo }) {
  return (
    <>
      {error && <div className="toast toast-error">{error}</div>}
      {lastDeleted && (
        <div className="toast toast-undo">
          Deleted "{lastDeleted.exp.name}"
          <button onClick={onUndo}>Undo</button>
        </div>
      )}
    </>
  );
}