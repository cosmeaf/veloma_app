import { useState } from "react";
import { toast } from "react-toastify";
import AuthService from "../../services/authService";
import { useNavigate, useLocation } from "react-router-dom";

export default function Otp() {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const verify = async () => {
    setBusy(true);
    try {
      const response = await AuthService.otpVerify({ code });

      let tokenUrl = response?.reset_url;
      tokenUrl = tokenUrl.split("/")[4]

      toast.success("OTP verificado com sucesso.", {
        onOpen: () => {
          navigate("/auth/reset-password/",{ state: { token: tokenUrl } });
        }
      });

    } catch (e) {
      toast.error(e);
    } finally { setBusy(false); }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-white">
      <div
        className="card shadow rounded-3 border-0"
        style={{ width: "100%", maxWidth: 520 }}
      >
        <div className="card-body p-5">
          <h2 className="text-center mb-4">Verificação OTP</h2>
          <p className="text-center text-muted mb-4">
            Insira o código que enviamos para o seu e-mail.
          </p>

          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="code"
              name="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Código OTP"
              required
            />
            <label htmlFor="code">Código OTP</label>
          </div>

          <div className="d-grid">
            <button
              className="btn"
              onClick={verify}
              disabled={!code || busy}
              style={{ backgroundColor: "#8B5CF6", color: "white", padding: "0.75rem", border: 'none' }}
            >
              {busy ? "Aguarde..." : "Validar"}
            </button>
          </div>

          <div className="text-center mt-4">
            <small>
              <button
                type="button"
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  color: "#8B5CF6",
                  fontWeight: "bold",
                  cursor: "pointer",
                  textDecoration: "none",
                }}
                onClick={() => navigate("/auth/recovery")}
              >
                VOLTAR
              </button>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
