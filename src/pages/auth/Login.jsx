import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/useAuth";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from?.pathname || "/";

  const [form, setForm] = useState({ username: "", password: "" });
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await login({ username: form.username.trim(), password: form.password });
      toast.success("Bem-vindo");
      nav(from, { replace: true });
    } catch (err) {
      const data = err?.response?.data;
      const msg = typeof data === "object" ? JSON.stringify(data) : (data || "Falha no login");
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 420, margin: "5rem auto" }}>
        <h2 style={{ margin: 0 }}>Entrar</h2>
        <p style={{ opacity: .7, marginTop: 6 }}>Aceda com o seu NIF (username) e palavra-passe.</p>

        <form onSubmit={onSubmit} style={{ marginTop: 16 }}>
          <label>Username (NIF)
            <input className="input" name="username" value={form.username} onChange={onChange} placeholder="ex.: 328254240" required />
          </label>
          <div style={{ height: 12 }} />
          <label>Palavra-passe
            <input className="input" type="password" name="password" value={form.password} onChange={onChange} required />
          </label>

          <div className="row" style={{ marginTop: 16 }}>
            <button className="btn" type="submit" disabled={busy}>{busy ? "Entrando..." : "Entrar"}</button>
            <button className="btn secondary" type="button" onClick={() => nav("/auth/recovery")}>Recuperar acesso</button>
          </div>

          <div className="hr" />
          <div className="row">
            <button className="btn secondary" type="button" onClick={() => nav("/auth/register")}>Criar conta</button>
            <button className="btn secondary" type="button" onClick={() => nav("/auth/verify-email")}>Verificar e-mail</button>
          </div>
        </form>
      </div>
    </div>
  );
}
