// src/layout/Content.jsx
export default function Content({ children }) {
  return <main style={{ padding: 16, minHeight: "calc(100vh - 56px)" }}>{children}</main>;
}
