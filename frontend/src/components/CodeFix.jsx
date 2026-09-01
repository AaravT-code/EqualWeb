export default function CodeFix({ html, label = "Element" }) {
  if (!html) return null;
  return (
    <div className="code-fix">
      <span className="code-fix-label">{label}</span>
      <pre className="code-fix-body"><code>{html}</code></pre>
    </div>
  );
}
