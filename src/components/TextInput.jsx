export default function TextInput({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  rightAction, // { text, onClick }
}) {
  return (
    <div className="field">
      <label className="field__label" htmlFor={name}>
        {label}
      </label>

      <div className={`field__control ${error ? "has-error" : ""}`}>
        <input
          id={name}
          name={name}
          className="field__input"
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete="off"
        />

        {rightAction?.text && (
          <button
            type="button"
            className="field__action"
            onClick={rightAction.onClick}
            tabIndex={-1}
          >
            {rightAction.text}
          </button>
        )}
      </div>

      {error && <div className="field__error">{error}</div>}
    </div>
  );
}