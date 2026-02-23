import { useState } from "react";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  const [view, setView] = useState("auth"); // "auth" | "dashboard"

  if (view === "auth") {
    return <AuthPage onAuthSuccess={() => setView("dashboard")} />;
  }

  return <DashboardPage onLogout={() => setView("auth")} />;
}