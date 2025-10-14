import { useState } from "react";
import { toast } from "react-toastify";
import AuthService from "../../services/authService";

export default function VerifyEmail() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  const send = async () => {
    setBusy(true);
    try {
      await AuthService.sendEmailVerification({ email });
      toast.success("Código enviado para o seu e-mail.");
    } catch (e) {
      const data = e?.response?.data;
      toast.error(typeof data === "object" ? JSON.stringify(data) : "Falha ao enviar verificação");
    } finally { setBusy(false); }
  };

  const verify = async () => {
    setBusy(true);
    try {
      // alguns backends usam { code }, outros { token }
      await AuthService.verifyEmail({ code, email });
      toast.success("E-mail verificado com sucesso.");
    } catch (e) {
      const data = e?.response?.data;
      toast.error(typeof data === "object" ? JSON.stringify(data) : "Falha na verificação");
    } finally { setBusy(false); }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 520, margin: "3rem auto" }}>
        <h2>Verificar e-mail</h2>
        <div className="row">
          <div className="col">
            <label>E-mail<input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
            <div style={{ marginTop: 12 }}><button className="btn" onClick={send} disabled={!email || busy}>Enviar código</button></div>
          </div>
          <div className="col">
            <label>Código/token<input className="input" value={code} onChange={(e) => setCode(e.target.value)} /></label>
            <div style={{ marginTop: 12 }}><button className="btn" onClick={verify} disabled={!code || busy}>Verificar</button></div>
          </div>
        </div>
      </div>
    </div>
  );
}
