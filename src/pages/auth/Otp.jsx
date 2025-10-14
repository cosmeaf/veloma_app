import { useState } from "react";
import { toast } from "react-toastify";
import AuthService from "../../services/authService";

export default function Otp() {
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  const generate = async () => {
    setBusy(true);
    try {
      await AuthService.otpGenerate({ username }); // ajuste payload se precisar
      toast.success("OTP enviado.");
    } catch (e) {
      const data = e?.response?.data;
      toast.error(typeof data === "object" ? JSON.stringify(data) : "Falha ao gerar OTP");
    } finally { setBusy(false); }
  };

  const verify = async () => {
    setBusy(true);
    try {
      await AuthService.otpVerify({ username, code });
      toast.success("OTP verificado com sucesso.");
    } catch (e) {
      const data = e?.response?.data;
      toast.error(typeof data === "object" ? JSON.stringify(data) : "OTP inválido");
    } finally { setBusy(false); }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 520, margin: "3rem auto" }}>
        <h2>OTP</h2>
        <label>Username (NIF)<input className="input" value={username} onChange={(e) => setUsername(e.target.value)} /></label>
        <div className="row" style={{ marginTop: 12 }}>
          <button className="btn" onClick={generate} disabled={!username || busy}>Gerar / enviar OTP</button>
        </div>
        <div className="hr" />
        <label>Código<input className="input" value={code} onChange={(e) => setCode(e.target.value)} /></label>
        <div style={{ marginTop: 12 }}>
          <button className="btn" onClick={verify} disabled={!username || !code || busy}>Validar</button>
        </div>
      </div>
    </div>
  );
}
