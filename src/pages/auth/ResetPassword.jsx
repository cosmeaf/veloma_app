import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AuthService from "../../services/authService";
import { useNavigate, useLocation } from "react-router-dom";

export default function ResetPassword() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const tokenFromState = location.state?.token;

    if (tokenFromState) {
      setToken(tokenFromState);
    } else {
      toast.error("Token não fornecido. Tente a recuperação novamente.");
      nav("/auth/recovery");
    }
  }, [location.state, nav]);

  const submit = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      toast.error("As passwords não coincidem.");
      return;
    }

    setBusy(true);
    try {
      await AuthService.resetPassword({ token, password, password2 });

      toast.success("Password atualizada com sucesso.", {
        onClose: () => nav("/auth/login")
      });

    } catch (e) {
      const data = e?.response?.data;
      if (typeof data === "object" && data !== null) {
        let errorMsg = "Falha ao atualizar:";
        for (const key in data) {
          errorMsg += ` ${key}: ${data[key].join(", ")}`;
        }
        toast.error(errorMsg);
      } else {
        toast.error(data || "Falha ao atualizar password");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-white">
      <div
        className="card shadow rounded-3 border-0"
        style={{ width: "100%", maxWidth: 520 }}
      >
        <div className="card-body p-5">
          <h2 className="text-center mb-4">Definir Nova Password</h2>

          <form onSubmit={submit}>
            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nova Password"
                required
              />
              <label htmlFor="password">Nova Password</label>
            </div>

            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                id="password2"
                name="password2"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                placeholder="Confirme a Nova Password"
                required
              />
              <label htmlFor="password2">Confirme a Nova Password</label>
            </div>

            <div className="d-grid mt-4">
              <button
                className="btn"
                type="submit"
                disabled={busy}
                style={{ backgroundColor: "#8B5CF6", color: "white", padding: "0.75rem", border: 'none' }}
              >
                {busy ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    {" "}A SALVAR...
                  </>
                ) : (
                  "SALVAR"
                )}
              </button>
            </div>
          </form>

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
                onClick={() => nav("/auth/login")}
              >
                VOLTAR AO LOGIN
              </button>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
