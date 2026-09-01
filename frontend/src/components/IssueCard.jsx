import { useState } from "react";
import IssueDetail from "./IssueDetail";
import { wcagCriteria } from "../utils/issues";

export default function IssueCard({ group }) {
  const [open, setOpen] = useState(false);
  const [expandedAll, setExpandedAll] = useState(false);
  const criteria = wcagCriteria(group.wcag);
  const panelId = `issue-panel-${group.ruleId}`;
  const count = group.occurrences.length;

  return (
    <li className={`issue-card issue-card--${group.impact || "review"}`}>
      <button
        type="button"
        className="issue-summary"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className={`impact-badge impact-badge--${group.impact || "review"}`}>
          {group.impact || "review"}
        </span>

        <span className="issue-text">
          <span className="issue-help">{group.help || group.description}</span>
          <span className="issue-meta">
            <code className="issue-rule">{group.ruleId}</code>
            {criteria.map((criterion) => (
              <span key={criterion} className="wcag-chip">WCAG {criterion}</span>
            ))}
          </span>
        </span>

        <span className="issue-count" title={`${count} affected elements`}>
          {count}
        </span>
        <span className={`chevron${open ? " chevron--open" : ""}`} aria-hidden="true" />
      </button>

      {open && (
        <div id={panelId} className="issue-panel">
          <p className="issue-description">{group.description}</p>
          <IssueDetail
            group={group}
            expandedAll={expandedAll}
            onExpandAll={() => setExpandedAll(true)}
          />
        </div>
      )}
    </li>
  );
}
