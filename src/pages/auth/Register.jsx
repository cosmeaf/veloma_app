import { useState } from "react";
import { toast } from "react-toastify";
import AuthService from "../../services/authService";
import { useNavigate } from "react-router-dom";
import "../../styles/styles.css";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password2: "",
  });
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.password2) {
      toast.error("As palavras-passe não coincidem.");
      return;
    }

    setBusy(true);
    try {
      await AuthService.register(form);
      toast.success("Registo concluído. Verifique seu e-mail.", {
        onOpen: () => {
          navigate("/auth/verify-email", { state: { email: form.email } });
        }
      });
    } catch (err) {
      const data = err?.response?.data;
      toast.error(e);
    } finally {
      setBusy(false);
    }
  };

 return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-white">
      <div
        className="card shadow rounded-3 border-0"
        style={{ width: "100%", maxWidth: 980 }}
      >
        <div className="card-body p-5">
          <h2 className="text-center mb-4">Crie sua conta</h2>
          <form onSubmit={onSubmit}>

            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                placeholder="Username (NIF)*"
                value={form.username}
                onChange={onChange}
                required
              />
              <label htmlFor="username">Username (NIF)*</label>
            </div>

            <div className="row g-2 mb-3">
              <div className="col-md">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="first_name"
                    name="first_name"
                    placeholder="Primeiro Nome*"
                    value={form.first_name}
                    onChange={onChange}
                    required
                  />
                  <label htmlFor="first_name">Primeiro Nome*</label>
                </div>
              </div>
              <div className="col-md">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="last_name"
                    name="last_name"
                    placeholder="Útimo Nome*"
                    value={form.last_name}
                    onChange={onChange}
                    required
                  />
                  <label htmlFor="last_name">Útimo Nome*</label>
                </div>
              </div>
            </div>

            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="E-mail*"
                value={form.email}
                onChange={onChange}
                required
              />
              <label htmlFor="email">E-mail*</label>
            </div>

            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Senha*"
                value={form.password}
                onChange={onChange}
                required
              />
              <label htmlFor="password">Senha*</label>
            </div>

            <small className="form-text text-muted d-block" style={{ marginTop: "-0.5rem", marginBottom: "1rem", marginLeft: "0.25rem" }}>
              A senha deve ter 8+ caracteres.
            </small>

            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                id="password2"
                name="password2"
                placeholder="Confirmar Senha*"
                value={form.password2}
                onChange={onChange}
                required
              />
              <label htmlFor="password2">Confirmar Senha*</label>
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
                    <span className="visually-hidden">A criar...</span>
                    {" "}A criar...
                  </>
                ) : (
                  "CRIAR CONTA"
                )}
              </button>
            </div>
          </form>

          <div className="text-center mt-3">
            <small className="text-muted">
              Já possui conta? <a href="/auth/login" style={{textDecoration: "none", color: "#8B5CF6", fontWeight: "bold"}}>ENTRAR</a>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
