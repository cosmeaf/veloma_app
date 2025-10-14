import { useState } from "react";
import { toast } from "react-toastify";
import AuthService from "../../services/authService";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      // alinhe os campos com UserRegisterRequest (ex.: first_name, last_name, etc.)
      await AuthService.register(form);
      toast.success("Registo concluído. Verifique seu e-mail.");
    } catch (err) {
      const data = err?.response?.data;
      toast.error(typeof data === "object" ? JSON.stringify(data) : "Falha no registo");
    } finally { setBusy(false); }
  };
  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 520, margin: "3rem auto" }}>
        <h2>Registar</h2>
        <form onSubmit={onSubmit}>
          <label>Username (NIF)<input className="input" name="username" value={form.username} onChange={onChange} required /></label>
          <div style={{ height: 12 }} />
          <label>E-mail<input className="input" type="email" name="email" value={form.email} onChange={onChange} required /></label>
          <div style={{ height: 12 }} />
          <label>Palavra-passe<input className="input" type="password" name="password" value={form.password} onChange={onChange} required /></label>
          <div style={{ marginTop: 16 }}>
            <button className="btn" type="submit" disabled={busy}>{busy ? "A criar..." : "Criar conta"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
