import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkStyle = ({ isActive }) => ({
    display: "block", padding: "10px 12px", textDecoration: "none",
    color: isActive ? "#000" : "#444", background: isActive ? "#eaeaea" : "transparent",
    borderRadius: 6, margin: "4px 8px",
  });

  return (
    <aside style={{ width: 240, background: "#f7f7f7", borderRight: "1px solid #eee", padding: "12px 6px", height: "100%", position: "sticky", top: 0, alignSelf: "start" }}>
      <div style={{ padding: "8px 12px", fontWeight: 600, opacity: .8 }}>Menu</div>
      <nav>
        <NavLink to="/" end style={linkStyle}>Home</NavLink>
        <NavLink to="/dashboard" style={linkStyle}>Dashboard</NavLink>

        <div style={{ padding: "12px 12px 4px", fontWeight: 600, opacity: .8 }}>Área restrita</div>
        <NavLink to="/audit" style={linkStyle}>Audit Events</NavLink>
      </nav>
    </aside>
  );
}
