export default function IssueCard({ issue }) { return <li><strong>{issue.impact || "review"}</strong> · {issue.description}</li>; }
