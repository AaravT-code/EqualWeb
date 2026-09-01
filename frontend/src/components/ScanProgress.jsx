const STEPS = [
  { key: "queued", label: "Queued" },
  { key: "rendering", label: "Rendering page" },
  { key: "scanning", label: "Running checks" },
  { key: "analyzing", label: "Analyzing" },
];

export default function ScanProgress({ status }) {
  const current = STEPS.findIndex((step) => step.key === status);

  return (
    <div className="scan-progress" role="status" aria-live="polite">
      <ol className="progress-steps">
        {STEPS.map((step, index) => {
          const state = index < current ? "done" : index === current ? "active" : "todo";
          return (
            <li key={step.key} className={`progress-step progress-step--${state}`}>
              <span className="progress-dot" aria-hidden="true" />
              {step.label}
            </li>
          );
        })}
      </ol>
      <p className="progress-note">This usually takes 10–45 seconds.</p>
    </div>
  );
}
