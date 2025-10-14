import { useState } from "react";
import { toast } from "react-toastify";
import AuthService from "../../services/authService";

export default function Recovery() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await AuthService.recovery({ email }); // alinhe com UserRecoveryRequest
      toast.success("Se existir conta, receberá instruções por e-mail.");
    } catch (e) {
      const data = e?.response?.data;
      toast.error(typeof data === "object" ? JSON.stringify(data) : "Falha na recuperação");
    } finally { setBusy(false); }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 520, margin: "3rem auto" }}>
        <h2>Recuperar acesso</h2>
        <form onSubmit={submit}>
          <label>E-mail<input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
          <div style={{ marginTop: 16 }}>
            <button className="btn" type="submit" disabled={busy}>{busy ? "A enviar..." : "Enviar"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
