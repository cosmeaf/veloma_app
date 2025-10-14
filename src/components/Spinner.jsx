// src/components/Spinner.jsx
export default function Spinner({ size = 40 }) {
  const s = { width: size, height: size, borderWidth: size / 8 };
  return (
    <div style={{ display: "grid", placeItems: "center", padding: "2rem" }}>
      <div
        style={{
          ...s,
          borderRadius: "50%",
          borderStyle: "solid",
          borderColor: "#ddd",
          borderTopColor: "#888",
          animation: "spin 0.7s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
