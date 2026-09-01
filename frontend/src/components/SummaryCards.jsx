import { IMPACT_ORDER, countByImpact } from "../utils/issues";

const LABELS = {
  critical: "Critical",
  serious: "Serious",
  moderate: "Moderate",
  minor: "Minor",
};

export default function SummaryCards({ issues = [], active, onSelect }) {
  const counts = countByImpact(issues);

  return (
    <div className="summary-cards">
      <button
        type="button"
        className={`summary-card summary-card--all${active === "all" ? " is-active" : ""}`}
        aria-pressed={active === "all"}
        onClick={() => onSelect("all")}
      >
        <span className="summary-count">{issues.length}</span>
        <span className="summary-label">All findings</span>
      </button>

      {IMPACT_ORDER.map((impact) => (
        <button
          key={impact}
          type="button"
          className={`summary-card summary-card--${impact}${active === impact ? " is-active" : ""}`}
          aria-pressed={active === impact}
          disabled={counts[impact] === 0}
          onClick={() => onSelect(impact)}
        >
          <span className="summary-count">{counts[impact]}</span>
          <span className="summary-label">{LABELS[impact]}</span>
        </button>
      ))}
    </div>
  );
}
