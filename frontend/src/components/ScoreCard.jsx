const CIRCUMFERENCE = 2 * Math.PI * 52;

function band(score) {
  if (score >= 90) return "good";
  if (score >= 70) return "fair";
  if (score >= 40) return "poor";
  return "bad";
}

export default function ScoreCard({ score, ruleCount, elementCount }) {
  const value = typeof score === "number" ? score : 0;
  const offset = CIRCUMFERENCE - (value / 100) * CIRCUMFERENCE;

  return (
    <div className="score-card">
      <svg className="score-dial" viewBox="0 0 120 120" role="img"
           aria-label={`Automated accessibility score ${value} out of 100`}>
        <circle className="score-dial-track" cx="60" cy="60" r="52" />
        <circle
          className={`score-dial-value score-dial-value--${band(value)}`}
          cx="60" cy="60" r="52"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
        />
        <text className="score-dial-number" x="60" y="60" textAnchor="middle" dominantBaseline="central">
          {value}
        </text>
      </svg>

      <div className="score-copy">
        <h2>Automated accessibility score</h2>
        <p className="score-detail">
          <strong>{ruleCount}</strong> {ruleCount === 1 ? "rule" : "rules"} broken across{" "}
          <strong>{elementCount}</strong> {elementCount === 1 ? "element" : "elements"}.
        </p>
        <p className="score-caveat">
          Automated checks only. This is not an official WCAG compliance score, and
          it cannot detect every barrier — some issues need manual review.
        </p>
      </div>
    </div>
  );
}
