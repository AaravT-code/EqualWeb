export default function SummaryCards({ issues = [] }) { return <p>{issues.length} automated issue{issues.length === 1 ? "" : "s"} found.</p>; }
