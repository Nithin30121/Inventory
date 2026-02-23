export default function ToggleTabs({ leftLabel, rightLabel, value, onChange }) {
  const leftValue = "login";
  const rightValue = "signup";

  return (
    <div className="toggle-tabs">
      <button
        type="button"
        className={`toggle-tab ${value === leftValue ? "is-active" : ""}`}
        onClick={() => onChange?.(leftValue)}
      >
        {leftLabel}
      </button>

      <button
        type="button"
        className={`toggle-tab ${value === rightValue ? "is-active" : ""}`}
        onClick={() => onChange?.(rightValue)}
      >
        {rightLabel}
      </button>
    </div>
  );
}