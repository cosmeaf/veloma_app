// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
// import { api } from "../api/api"; // descomente e use seu endpoint real

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const load = async () => {
      setBusy(true);
      try {
        // const { data } = await api.get("/seu/endpoint/protegido/");
        setData({ status: "ok", message: "Exemplo de conteúdo do Dashboard" });
      } catch (e) {
        console.error(e);
        toast.error("Falha ao carregar dados do dashboard");
      } finally {
        setBusy(false);
      }
    };
    load();
  }, []);

  if (busy) return <Spinner />;

  return (
    <div>
      <h2>Dashboard</h2>
      <pre style={{ background: "#f6f6f6", padding: 12, borderRadius: 4 }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
