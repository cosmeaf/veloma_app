// src/pages/AuditDetail.jsx
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
// import AuditService from "../services/auditService"; // ative se houver endpoint de detalhe
// import { useEffect, useState } from "react";

function fmtDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function tryParseJSON(maybeJson) {
  if (maybeJson == null) return null;
  if (typeof maybeJson === "object") return maybeJson; // já é objeto
  if (typeof maybeJson !== "string") return null;

  const s = maybeJson.trim();
  if (!s) return null;

  // heurística simples: começa com { ou [
  if (s.startsWith("{") || s.startsWith("[")) {
    try {
      return JSON.parse(s);
    } catch {
      return null;
    }
  }
  return null;
}

function pretty(any) {
  try {
    return JSON.stringify(any, null, 2);
  } catch {
    return String(any);
  }
}

export default function AuditDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { state } = useLocation(); // pode conter { record }
  const record = state?.record || null;

  // Caso você tenha endpoint de detalhe, descomente e use o bloco abaixo.
  // Isso evita warnings enquanto você usa apenas o state.
  //
  // const [busy, setBusy] = useState(false);
  // const [data, setData] = useState(record);
  //
  // useEffect(() => {
  //   if (data) return; // já temos via state
  //   setBusy(true);
  //   AuditService.get(id)
  //     .then(setData)
  //     .catch((e) => {
  //       console.error("[AuditDetail] get error:", e?.response?.status, e?.response?.data);
  //       // opcional: toast.error("Falha ao carregar o detalhe do evento");
  //     })
  //     .finally(() => setBusy(false));
  // }, [id, data]);
  //
  // const rec = data;

  // Sem fetch de detalhe: usamos somente o state
  const rec = record;

  // Logs de debug
  console.groupCollapsed(`[AuditDetail] Render evento #${id}`);
  console.log("state.record exists?", Boolean(record));
  if (record) console.log("record:", record);
  console.groupEnd();

  // Prepara campos “prettificados”
  const beforeJSON = tryParseJSON(rec?.before);
  const afterJSON = tryParseJSON(rec?.after);
  const extraJSON = tryParseJSON(rec?.extra);

  // Se não temos record (e sem fetch), mostra fallback
  if (!rec) {
    return (
      <div>
        <h2>Evento #{id}</h2>
        <p style={{ color: "#b00" }}>
          Detalhes indisponíveis. Volte à lista e abra novamente o item (o link deve enviar o
          objeto via <code>state</code>), ou ative o fetch de detalhe nesta página.
        </p>
        <button onClick={() => nav(-1)}>Voltar</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Evento #{rec.id}</h2>

      <div style={{ margin: "12px 0", display: "flex", gap: 8 }}>
        <button onClick={() => nav(-1)}>◀ Voltar</button>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        <div><b>Occurred:</b> {fmtDate(rec.occurred_at)}</div>
        <div>
          <b>User:</b> {rec.user_repr || "-"}{" "}
          (staff: {String(rec.user_is_staff)}, superuser: {String(rec.user_is_superuser)})
        </div>
        <div><b>Groups:</b> {rec.user_groups || "-"}</div>
        <div><b>Path:</b> {rec.method || "-"} {rec.path || "-"} ({rec.status_code ?? "-"})</div>
        <div><b>IP:</b> {rec.ip || "-"} • <b>UA:</b> {rec.user_agent || "-"}</div>
        <div>
          <b>App/Model:</b> {rec.app_label || "-"} / {rec.model || "-"} •{" "}
          <b>Obj:</b> {rec.object_id || "-"} — {rec.object_repr || "-"}
        </div>
        <div><b>Action:</b> {rec.action || "-"} • <b>Reason:</b> {rec.reason || "-"}</div>
        <div><b>Company NIF:</b> {rec.company_nif || "-"}</div>
        <div><b>Whitelist:</b> {rec.fields_whitelist || "-"}</div>
        <div><b>Object version:</b> {rec.object_version ?? "-"}</div>
        <div><b>Request ID:</b> {rec.request_id || "-"}</div>
        <div>
          <b>Payload hash:</b> {rec.payload_hash || "-"}, <b>File hash:</b> {rec.file_hash || "-"}
        </div>
      </div>

      {/* Blocos colapsáveis para textos grandes / JSON */}
      <details style={{ marginTop: 16 }} open>
        <summary style={{ cursor: "pointer", fontWeight: 600 }}>Before</summary>
        <pre style={{ background: "#f6f6f6", padding: 12, borderRadius: 4, overflow: "auto" }}>
          {beforeJSON ? pretty(beforeJSON) : (rec.before || "(vazio)")}
        </pre>
      </details>

      <details style={{ marginTop: 8 }} open>
        <summary style={{ cursor: "pointer", fontWeight: 600 }}>After</summary>
        <pre style={{ background: "#f6f6f6", padding: 12, borderRadius: 4, overflow: "auto" }}>
          {afterJSON ? pretty(afterJSON) : (rec.after || "(vazio)")}
        </pre>
      </details>

      <details style={{ marginTop: 8 }} open>
        <summary style={{ cursor: "pointer", fontWeight: 600 }}>Extra</summary>
        <pre style={{ background: "#f6f6f6", padding: 12, borderRadius: 4, overflow: "auto" }}>
          {extraJSON ? pretty(extraJSON) : (rec.extra || "(vazio)")}
        </pre>
      </details>
    </div>
  );
}
