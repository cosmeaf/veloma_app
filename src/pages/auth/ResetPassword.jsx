import { useState } from "react";
import { toast } from "react-toastify";
import AuthService from "../../services/authService";

export default function ResetPassword() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      // alinhe com ResetPasswordRequest (ex.: { token, password })
      await AuthService.resetPassword({ token, password });
      toast.success("Password atualizada.");
    } catch (e) {
      const data = e?.response?.data;
      toast.error(typeof data === "object" ? JSON.stringify(data) : "Falha ao atualizar password");
    } finally { setBusy(false); }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 520, margin: "3rem auto" }}>
        <h2>Definir nova password</h2>
        <form onSubmit={submit}>
          <label>Token<input className="input" value={token} onChange={(e) => setToken(e.target.value)} required /></label>
          <div style={{ height: 12 }} />
          <label>Nova password<input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
          <div style={{ marginTop: 16 }}><button className="btn" type="submit" disabled={busy}>{busy ? "A gravar..." : "Salvar"}</button></div>
        </form>
      </div>
    </div>
  );
}
