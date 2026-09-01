import { useEffect, useMemo, useState } from "react";
import { createScan, getHealth, getScan } from "./services/api";
import "./styles.css";

const ACTIVE_STATES = new Set(["queued", "rendering", "scanning", "analyzing"]);
const SEVERITIES = ["all", "critical", "serious", "moderate", "minor"];

function Header({ backend }) {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="EqualWeb home">
        <span className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1.3" y="1.3" width="37.4" height="29.4" rx="5" stroke="currentColor" strokeWidth="2.1" />
            <path d="M1.3 9.6h37.4" stroke="currentColor" strokeWidth="2.1" />
            <circle cx="24.2" cy="5.45" r="1.15" fill="currentColor" />
            <circle cx="28.7" cy="5.45" r="1.15" fill="currentColor" />
            <circle cx="33.2" cy="5.45" r="1.15" fill="currentColor" />
            <path
              d="M17 15.6 12.4 20.6 17 25.6M23 15.6l4.6 5-4.6 5M22.6 14.6l-5.2 12"
              stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </span>
        EqualWeb
      </a>
      <span className={`connection connection--${backend.state}`} role="status">
        <span aria-hidden="true" />{backend.state === "ready" ? "Scanner online" : "Scanner offline"}
      </span>
    </header>
  );
}

function ScanForm({ onSubmit, disabled }) {
  const [url, setUrl] = useState("");
  const submit = (event) => { event.preventDefault(); onSubmit(url.trim()); };
  return (
    <form className="scan-form" onSubmit={submit}>
      <label htmlFor="website-url">Website URL</label>
      <div className="input-row">
        <span className="globe" aria-hidden="true">◎</span>
        <input id="website-url" type="url" required value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://example.com" autoComplete="url" />
        <button type="submit" disabled={disabled || !url.trim()}>{disabled ? "Scanning…" : "Run audit"}</button>
      </div>
      <p>Only public HTTP and HTTPS websites can be scanned.</p>
    </form>
  );
}

function Progress({ status }) {
  const stages = ["queued", "rendering", "scanning", "analyzing"];
  const current = Math.max(0, stages.indexOf(status));
  return (
    <section className="progress-card" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <div><p className="kicker">Audit in progress</p><h2>{status === "queued" ? "Waiting for the scanner" : `${status[0].toUpperCase()}${status.slice(1)} your website`}</h2><p>This can take up to a minute for complex pages.</p><div className="progress-track"><span style={{ width: `${(current + 1) * 25}%` }} /></div></div>
    </section>
  );
}

function Score({ result }) {
  const tone = result.score >= 90 ? "good" : result.score >= 70 ? "fair" : "poor";
  return (
    <section className="results-heading">
      <div><p className="kicker">Automated accessibility report</p><h2>{new URL(result.url).hostname}</h2><p className="result-url">{result.url}</p></div>
      <div className={`score score--${tone}`} aria-label={`Accessibility score ${result.score} out of 100`}><strong>{result.score}</strong><span>/100</span><small>Automated score</small></div>
    </section>
  );
}

function Summary({ summary }) {
  return <div className="summary-grid">{SEVERITIES.slice(1).map((severity) => <div className={`summary summary--${severity}`} key={severity}><span>{severity}</span><strong>{summary[severity]}</strong></div>)}</div>;
}

function Issues({ issues }) {
  const [filter, setFilter] = useState("all");
  const visible = useMemo(() => filter === "all" ? issues : issues.filter((issue) => issue.impact === filter), [issues, filter]);
  return (
    <section className="issues" aria-labelledby="issues-title">
      <div className="issues-toolbar">
        <div><p className="kicker">Detected barriers</p><h2 id="issues-title">Issues ({issues.length})</h2></div>
        <div className="filters" aria-label="Filter issues by severity">{SEVERITIES.map((severity) => <button type="button" key={severity} className={filter === severity ? "active" : ""} onClick={() => setFilter(severity)}>{severity}</button>)}</div>
      </div>
      {visible.length === 0 && <div className="empty">No {filter === "all" ? "automated" : filter} issues found.</div>}
      <div className="issue-list">{visible.map((issue, index) => (
        <details className="issue-card" key={`${issue.rule_id}-${index}`}>
          <summary><span className={`severity severity--${issue.impact}`}>{issue.impact}</span><span><strong>{issue.help}</strong><small>{issue.rule_id} · {issue.target.join(", ")}</small></span><span aria-hidden="true">＋</span></summary>
          <div className="issue-body"><p>{issue.explanation || issue.description}</p>{issue.wcag.length > 0 && <p><b>WCAG:</b> {issue.wcag.join(", ")}</p>}<h3>Element</h3><pre><code>{issue.html}</code></pre><h3>Recommendation</h3><p>{issue.recommendation}</p>{issue.help_url && <a href={issue.help_url} target="_blank" rel="noreferrer">Read remediation guidance</a>}</div>
        </details>
      ))}</div>
    </section>
  );
}

export default function App() {
  const [backend, setBackend] = useState({ state: "loading" });
  const [scan, setScan] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => { getHealth().then((data) => setBackend({ state: "ready", data })).catch(() => setBackend({ state: "error" })); }, []);
  useEffect(() => {
    if (!scan?.scan_id || !ACTIVE_STATES.has(scan.status)) return undefined;
    const timer = window.setTimeout(async () => { try { setScan(await getScan(scan.scan_id)); } catch (requestError) { setError(requestError.message); } }, 1000);
    return () => window.clearTimeout(timer);
  }, [scan]);

  const startScan = async (url) => { setError(""); setScan(null); try { setScan(await createScan(url)); } catch (requestError) { setError(requestError.message); } };
  const active = scan && ACTIVE_STATES.has(scan.status);
  return (
    <div className="app-shell">
      <Header backend={backend} />
      <main>
        <section className="hero" aria-labelledby="page-title">
          <p className="eyebrow">WCAG 2.2 WEBSITE AUDITOR</p><h1 id="page-title">Accessibility,<br /><em>made clear.</em></h1>
          <p className="lede">Find barriers across your website with browser-based testing and practical remediation guidance.</p>
          <ScanForm onSubmit={startScan} disabled={active || backend.state !== "ready"} />
          {error && <div className="alert" role="alert">{error}</div>}
        </section>
        {active && <Progress status={scan.status} />}
        {scan?.status === "failed" && <div className="alert" role="alert">Scan failed: {scan.error}</div>}
        {scan?.status === "completed" && <div className="results"><Score result={scan} /><Summary summary={scan.summary} />{scan.ai_message && <p className="ai-note">{scan.ai_message}</p>}<Issues issues={scan.issues} /></div>}
      </main>
      <footer>EqualWeb audits support—not replace—expert accessibility testing.</footer>
    </div>
  );
}

