import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/useAuth";
import "../../styles/styles.css";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from?.pathname || "/";

  const [form, setForm] = useState({ username: "", password: "" });
  const [busy, setBusy] = useState(false);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await login({ username: form.username.trim(), password: form.password });
      toast.success("Bem-vindo", { autoClose: 1500 });
      nav(from, { replace: true });
    } catch (err) {
      const data = err?.response?.data;
      const msg =
        typeof data === "object"
          ? JSON.stringify(data)
          : data || "Falha no login";
      toast.error(msg, { autoClose: 3000 });
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
          <h2 className="text-center mb-3">Entrar</h2>
          <p className="text-muted text-center mb-4" style={{ fontSize: '0.9rem' }}>
            Aceda com o seu NIF (username) e palavra-passe.
          </p>

          <form onSubmit={onSubmit}>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={form.username}
                onChange={onChange}
                placeholder="ex.: 328254240"
                required
              />
              <label htmlFor="username">Username (NIF)</label>
            </div>

            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={form.password}
                onChange={onChange}
                placeholder="Palavra-passe"
                required
              />
              <label htmlFor="password">Palavra-passe</label>
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
                    {" "}A ENTRAR...
                  </>
                ) : (
                  "ENTRAR"
                )}
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <small>
              Não tem uma conta?{" "}
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
                onClick={() => nav("/auth/register")}
              >
                CRIAR CONTA
              </button>
            </small>
            <br />
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
                  fontSize: "0.8rem",
                }}
                onClick={() => nav("/auth/recovery")}
              >
                RECUPERAR ACESSO 
              </button>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
