// src/layout/Layout.jsx
import Header from "./Header";
import Sidebar from "./Sidebar";
import Content from "./Content";

export default function Layout({ title, children }) {
  return (
    <div style={{ display: "grid", gridTemplateRows: "56px 1fr", height: "100vh" }}>
      <Header title={title} />
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", minHeight: 0 }}>
        <Sidebar />
        <Content>{children}</Content>
      </div>
    </div>
  );
}
