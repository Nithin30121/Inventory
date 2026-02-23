import { useMemo, useState } from "react";
import VideoBackground from "../components/VideoBackground";
import GlassPanel from "../components/GlassPanel";
import ToggleTabs from "../components/ToggleTabs";
import TextInput from "../components/TextInput";
import PrimaryButton from "../components/PrimaryButton";

export default function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function setField(name, value) {
    setForm((p) => ({ ...p, [name]: value }));
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
  }

  function resetTouched() {
    setTouched({});
    setSubmitError("");
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    resetTouched();
    setForm((p) => ({
      ...p,
      password: "",
      confirmPassword: "",
      // keep name/email if you want; change if you prefer clearing:
      // name: "",
      // email: "",
    }));
  }

  const errors = useMemo(() => {
    const e = {};

    if (mode === "signup") {
      if (!form.name.trim()) e.name = "Name is required.";
    }

    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email.";

    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 6) e.password = "Min 6 characters.";

    if (mode === "signup") {
      if (!form.confirmPassword) e.confirmPassword = "Confirm your password.";
      else if (form.confirmPassword !== form.password) e.confirmPassword = "Passwords do not match.";
    }

    return e;
  }, [form, mode]);

  const isValid = Object.keys(errors).length === 0;

  function markAllTouched() {
    const all = { email: true, password: true };
    if (mode === "signup") {
      all.name = true;
      all.confirmPassword = true;
    }
    setTouched(all);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    markAllTouched();

    // Allow quick routing to dashboard when clicking Login
    if (mode === "login") {
      onAuthSuccess?.({
        mode,
        email: form.email,
        name: form.name,
      });
      return;
    }

    if (!isValid) return;

    // ✅ “Functionality” placeholder (replace with API later)
    // For now we treat it as success and "route" to dashboard via callback.
    try {
      // Example: fake auth delay/logic not needed. Just success:
      onAuthSuccess?.({
        mode,
        email: form.email,
        name: form.name,
      });
    } catch (err) {
      setSubmitError("Something went wrong. Try again.");
    }
  }

  const showError = (field) => !!touched[field] && !!errors[field];

  return (
    <div className="auth-page">
      <VideoBackground src="/bg.mp4" />

      <div className="auth-right">
        <GlassPanel>
         <div className="welcome-bar">
  <h1 className="auth-title">Welcome</h1>
</div>

          <ToggleTabs
            leftLabel="Login"
            rightLabel="Signup"
            value={mode}
            onChange={(v) => switchMode(v)}
          />

          <div className="auth-card">
            <div className="auth-card-header">
              <h2 className="auth-card-title">{mode === "login" ? "Login" : "Signup"}</h2>
            </div>

            <form className="auth-form auth-card-body" onSubmit={handleSubmit} noValidate>
              {mode === "signup" && (
                <TextInput
                  label="Name"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  onBlur={handleBlur}
                  error={showError("name") ? errors.name : ""}
                />
              )}

              <TextInput
                label="Email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                onBlur={handleBlur}
                error={showError("email") ? errors.email : ""}
              />

              <TextInput
                label="Password"
                name="password"
                type={showPass ? "text" : "password"}
                placeholder="min 6 chars"
                value={form.password}
                onChange={(e) => setField("password", e.target.value)}
                onBlur={handleBlur}
                rightAction={{
                  text: showPass ? "Hide" : "Show",
                  onClick: () => setShowPass((p) => !p),
                }}
                error={showError("password") ? errors.password : ""}
              />

              {mode === "signup" && (
                <TextInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="repeat password"
                  value={form.confirmPassword}
                  onChange={(e) => setField("confirmPassword", e.target.value)}
                  onBlur={handleBlur}
                  rightAction={{
                    text: showConfirm ? "Hide" : "Show",
                    onClick: () => setShowConfirm((p) => !p),
                  }}
                  error={showError("confirmPassword") ? errors.confirmPassword : ""}
                />
              )}

              <PrimaryButton type="submit" disabled={!isValid}>
                {mode === "login" ? "Login" : "Create Account"}
              </PrimaryButton>

              {submitError && <div className="form-error">{submitError}</div>}

              <div className="auth-hint">
                {mode === "login" ? (
                  <span>
                    Don’t have an account?{" "}
                    <button
                      type="button"
                      className="auth-link"
                      onClick={() => switchMode("signup")}
                    >
                      Signup
                    </button>
                  </span>
                ) : (
                  <span>
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="auth-link"
                      onClick={() => switchMode("login")}
                    >
                      Login
                    </button>
                  </span>
                )}
              </div>
            </form>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}