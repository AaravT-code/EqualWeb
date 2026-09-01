export const IMPACT_ORDER = ["critical", "serious", "moderate", "minor"];

function rank(impact) {
  const index = IMPACT_ORDER.indexOf(impact);
  return index === -1 ? IMPACT_ORDER.length : index;
}

/**
 * axe reports one finding per affected element, so a single broken rule can
 * arrive 150 times. Collapse them into one entry per rule that carries every
 * affected element as an occurrence.
 */
export function groupByRule(issues = []) {
  const groups = new Map();

  for (const issue of issues) {
    if (!groups.has(issue.rule_id)) {
      groups.set(issue.rule_id, {
        ruleId: issue.rule_id,
        impact: issue.impact,
        description: issue.description,
        help: issue.help,
        wcag: issue.wcag ?? [],
        occurrences: [],
      });
    }
    const group = groups.get(issue.rule_id);
    if (rank(issue.impact) < rank(group.impact)) group.impact = issue.impact;
    group.occurrences.push({ target: issue.target ?? [], html: issue.html });
  }

  return [...groups.values()].sort(
    (a, b) => rank(a.impact) - rank(b.impact) || b.occurrences.length - a.occurrences.length,
  );
}

export function countByImpact(issues = []) {
  const counts = { critical: 0, serious: 0, moderate: 0, minor: 0 };
  for (const issue of issues) {
    if (issue.impact in counts) counts[issue.impact] += 1;
  }
  return counts;
}

/** axe tags look like "wcag2aa" and "wcag143"; keep the success criteria. */
export function wcagCriteria(tags = []) {
  return tags
    .map((tag) => tag.match(/^wcag(\d)(\d)(\d+)$/))
    .filter(Boolean)
    .map((match) => `${match[1]}.${match[2]}.${match[3]}`);
}
