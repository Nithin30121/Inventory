export default function PrimaryButton({ children, disabled, ...props }) {
  return (
    <button className="primary-btn" disabled={disabled} {...props}>
      {children}
    </button>
  );
}