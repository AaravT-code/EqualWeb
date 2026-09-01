import IssueCard from "./IssueCard";
import { groupByRule } from "../utils/issues";

export default function IssueList({ issues = [], filter = "all" }) {
  const visible = filter === "all" ? issues : issues.filter((issue) => issue.impact === filter);
  const groups = groupByRule(visible);

  if (groups.length === 0) {
    return (
      <p className="empty-state">
        {issues.length === 0
          ? "No automated issues detected. Automated checks cover roughly a third of WCAG criteria — a manual review is still worthwhile."
          : "No findings at this severity."}
      </p>
    );
  }

  return (
    <>
      <p className="issue-list-caption">
        {groups.length} {groups.length === 1 ? "rule" : "rules"} broken ·{" "}
        {visible.length} affected {visible.length === 1 ? "element" : "elements"}
      </p>
      <ul className="issue-list">
        {groups.map((group) => (
          <IssueCard key={group.ruleId} group={group} />
        ))}
      </ul>
    </>
  );
}
