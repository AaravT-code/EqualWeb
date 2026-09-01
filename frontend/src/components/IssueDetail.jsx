export default function IssueDetail({ issue }) { return issue ? <article><h3>{issue.rule_id}</h3><p>{issue.help || issue.description}</p></article> : null; }
