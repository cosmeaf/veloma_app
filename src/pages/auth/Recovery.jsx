import { useState } from "react";
import { toast } from "react-toastify";
import AuthService from "../../services/authService";
import { useNavigate } from "react-router-dom";
import "../../styles/styles.css";

export default function Recovery() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await AuthService.recovery({ email });
      toast.success("Receberá um código por e-mail.", {
        onOpen: () => {
          navigate("/auth/otp", { state: { username: email } });
        },
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
          <h2 className="text-center mb-4">Recuperar acesso</h2>

          <form onSubmit={submit}>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail"
                required
              />
              <label htmlFor="email">E-mail</label>
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
                    {" "}A ENVIAR...
                  </>
                ) : (
                  "ENVIAR"
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
                onClick={() => navigate("/auth/login")}
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
