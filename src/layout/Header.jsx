// src/layout/Header.jsx
import { useAuth } from "../context/useAuth";

export default function Header({ title = "Dashboard" }) {
  const { user, logout } = useAuth();
  return (
    <header style={{
      height: 56, display: "flex", alignItems: "center",
      justifyContent: "space-between", padding: "0 16px",
      borderBottom: "1px solid #eee", background: "#fff", position: "sticky", top: 0, zIndex: 10
    }}>
      <strong>{title}</strong>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <span style={{ opacity: 0.75 }}>
          {user?.name || user?.nif || "utilizador"}
        </span>
        <button onClick={logout}>Sair</button>
      </div>
    </header>
  );
}
