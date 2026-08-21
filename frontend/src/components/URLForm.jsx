export default function URLForm({ url, onUrlChange, onSubmit }) {
  return <form onSubmit={onSubmit}><label htmlFor="url">Public website URL</label><div><input id="url" type="url" required placeholder="https://example.com" value={url} onChange={(event) => onUrlChange(event.target.value)} /><button>Analyze</button></div></form>;
}
