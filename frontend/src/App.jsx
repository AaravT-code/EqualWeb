import { useEffect, useState } from "react";
import { createScan, getHealth, getScan } from "./services/api";
import "./styles.css";

export default function App() {
  const [url, setUrl] = useState("");
  const [health, setHealth] = useState("Checking backend…");
  const [scan, setScan] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => { getHealth().then(() => setHealth("Backend connected")).catch(() => setHealth("Backend unavailable")); }, []);
  useEffect(() => {
    if (!scan || ["completed", "failed"].includes(scan.status)) return;
    const timer = setTimeout(() => getScan(scan.scan_id).then(setScan).catch((err) => setError(err.message)), 1500);
    return () => clearTimeout(timer);
  }, [scan]);

  async function submit(event) {
    event.preventDefault(); setError(""); setScan(null);
    try { setScan(await createScan(url)); } catch (err) { setError(err.message); }
  }

  return <main>
    <header><p className="eyebrow">WCAG 2.2 · automated checks</p><h1>Website Accessibility Auditor</h1><p>{health}</p></header>
    <form onSubmit={submit}><label htmlFor="url">Public website URL</label><div><input id="url" type="url" required placeholder="https://example.com" value={url} onChange={(e) => setUrl(e.target.value)} /><button>Analyze</button></div></form>
    {error && <p className="error">{error}</p>}
    {scan && <section><h2>{scan.status === "completed" ? `Score: ${scan.score}/100` : `Scan ${scan.status}…`}</h2>
      {scan.status === "completed" && <ul>{scan.issues.map((issue, index) => <li key={`${issue.rule_id}-${index}`}><strong>{issue.impact || "review"}</strong> · {issue.description}</li>)}</ul>}
      {scan.status === "failed" && <p className="error">{scan.error}</p>}
    </section>}
  </main>;
}
