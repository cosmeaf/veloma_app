import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AuthService from "../../services/authService";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/styles.css";


export default function VerifyEmail() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [timer, setTimer] = useState(60);
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    if (isDisabled && timer > 0) {
      const intervalId = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
    if (timer === 0) {
      setIsDisabled(false);
    }
  }, [isDisabled, timer]);

  useEffect(() => {
    const emailFromState = location.state?.email;
    if (emailFromState) {
      setEmail(emailFromState);
    } else {
      toast.error("E-mail não fornecido. Tente o registo novamente.");
      navigate("/auth/register");
    }
  }, [location.state, navigate]);

  const send = async () => {
    if (!email) {
      toast.warn("E-mail não localizado para enviar o código.");
      return;
    }
    setIsDisabled(true);
    setTimer(60);
    setBusy(true);
    try {
      await AuthService.sendEmailVerification({ email });
      toast.success("Um novo código foi enviado para o seu e-mail.");
    } catch (e) {
      const data = e?.response?.data;
      toast.error(
        typeof data === "object" ? JSON.stringify(data) : "Falha ao enviar verificação"
      );
      setIsDisabled(false);
      setTimer(0);
    } finally {
      setBusy(false);
    }
  };

  const verify = async () => {
    setBusy(true);
    try {
      await AuthService.verifyEmail({ code, email });
      toast.success("E-mail verificado com sucesso.", {
        onClose: () => {
          navigate("/auth/login");
        },
      });
    } catch (e) {
      const data = e?.response?.data;
      toast.error(
        typeof data === "object" ? JSON.stringify(data) : "Falha na verificação"
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div
        className="card shadow-sm border-0"
        style={{ width: "100%", maxWidth: 980 }}
      >
        <div className="card-body p-4 p-md-5">
          <h2 className="text-center mb-0">Verificar e-mail</h2>
          <p  className="text-center mb-4">Foi enviado um <span style={{textDecoration: "none", color: "#8B5CF6", fontWeight: "bold"}}>token</span> ao seu e-mail</p>

          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="E-mail"
              value={email}
              readOnly
              disabled
            />
            <label htmlFor="email">E-mail</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="code"
              placeholder="Código/token"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <label htmlFor="code">Código/token</label>
          </div>

          <div className="text-center mb-3" style={{ fontSize: '14px' }}>
            <button
              type="button"
              onClick={send}
              disabled={isDisabled || busy || !email}
              className="btn btn-link p-0"
               style={{
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  color: "#8B5CF6",
                  cursor: "pointer",
                  textDecoration: "none",
                  fontSize: "0.7rem",
                  fontWeight: "bold"
                }}
            >
              Enviar novo código
              {isDisabled && ` (aguarde ${timer}s)`}
            </button>
          </div>

          <div className="d-grid mt-4">
            <button
              className="btn btn-primary btn-lg"
              type="button"
              onClick={verify}
              disabled={!code || busy}
              style={{ backgroundColor: "#8B5CF6", color: "white", padding: "0.75rem", border: 'none' }}
            >
              {busy ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  {" "}A verificar...
                </>
              ) : (
                "Verificar"
              )}
            </button>
          </div>

          <div className="text-center mt-3">
            <small className="text-muted">
              Voltar para o <a href="/auth/login" style={{textDecoration: "none", color: "#8B5CF6", fontWeight: "bold"}}>Login</a>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
