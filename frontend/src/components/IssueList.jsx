import IssueCard from "./IssueCard";
export default function IssueList({ issues = [] }) { return <ul>{issues.map((issue, index) => <IssueCard key={`${issue.rule_id}-${index}`} issue={issue} />)}</ul>; }
