export default function URLForm({ url, onUrlChange, onSubmit, busy = false }) {
  return (
    <form className="url-form" onSubmit={onSubmit}>
      <label htmlFor="url">Public website URL</label>
      <div className="url-form-row">
        <input
          id="url"
          type="url"
          required
          placeholder="https://example.com"
          value={url}
          disabled={busy}
          onChange={(event) => onUrlChange(event.target.value)}
        />
        <button type="submit" disabled={busy || !url}>
          {busy ? "Scanning…" : "Analyze"}
        </button>
      </div>
    </form>
  );
}
