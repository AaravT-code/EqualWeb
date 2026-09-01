import CodeFix from "./CodeFix";

const PREVIEW_LIMIT = 10;

export default function IssueDetail({ group, expandedAll, onExpandAll }) {
  const { occurrences } = group;
  const shown = expandedAll ? occurrences : occurrences.slice(0, PREVIEW_LIMIT);
  const hidden = occurrences.length - shown.length;

  return (
    <div className="issue-detail">
      <h4 className="issue-detail-heading">
        Affected {occurrences.length === 1 ? "element" : "elements"} ({occurrences.length})
      </h4>

      <ol className="occurrence-list">
        {shown.map((occurrence, index) => (
          <li key={index} className="occurrence">
            <code className="occurrence-target">
              {occurrence.target.join(" ") || "(no selector reported)"}
            </code>
            <CodeFix html={occurrence.html} />
          </li>
        ))}
      </ol>

      {hidden > 0 && (
        <button type="button" className="link-button" onClick={onExpandAll}>
          Show {hidden} more {hidden === 1 ? "element" : "elements"}
        </button>
      )}
    </div>
  );
}
