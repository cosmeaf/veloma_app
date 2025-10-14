// src/pages/AuditList.jsx
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import AuditService from "../services/auditService";

function fmtDate(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

export default function AuditList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [busy, setBusy] = useState(false);
  const [data, setData] = useState({ count: 0, next: null, previous: null, results: [] });

  const page = Number(searchParams.get("page") || 1);

  const load = async (pageNum) => {
    setBusy(true);
    try {
      const res = await AuditService.list({ page: pageNum });
      setData(res);
    } catch (e) {
      console.error("[AuditList] load error:", e?.response?.status, e?.response?.data);
      toast.error("Falha ao carregar eventos de auditoria");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    load(page);

  }, [page]);

  const go = (p) => {
    if (!p || p < 1) return;
    setSearchParams(p === 1 ? {} : { page: String(p) });
  };

  const nextPage = AuditService.getPageFromUrl(data.next);
  const prevPage = AuditService.getPageFromUrl(data.previous);

  if (busy && !data?.results?.length) return <Spinner />;

  return (
    <div>
      <h2>Audit Events</h2>

      <div style={{ margin: "12px 0", display: "flex", gap: 8, alignItems: "center" }}>
        <button onClick={() => go(prevPage)} disabled={!prevPage}>◀ Prev</button>
        <div>Page: {page}</div>
        <button onClick={() => go(nextPage)} disabled={!nextPage}>Next ▶</button>
        <div style={{ marginLeft: "auto", opacity: 0.7 }}>
          Total: {data?.count ?? 0}
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #eee" }}>
              <th style={{ padding: "8px" }}>Occurred</th>
              <th style={{ padding: "8px" }}>User</th>
              <th style={{ padding: "8px" }}>Action</th>
              <th style={{ padding: "8px" }}>Path</th>
              <th style={{ padding: "8px" }}>Status</th>
              <th style={{ padding: "8px" }}>IP</th>
              <th style={{ padding: "8px" }} />
            </tr>
          </thead>
          <tbody>
            {data?.results?.map((row) => (
              <tr key={row.id} style={{ borderBottom: "1px solid #f1f1f1" }}>
                <td style={{ padding: "8px", whiteSpace: "nowrap" }}>{fmtDate(row.occurred_at)}</td>
                <td style={{ padding: "8px" }}>{row.user_repr || "-"}</td>
                <td style={{ padding: "8px" }}>{row.action || "-"}</td>
                <td style={{ padding: "8px" }}>{row.path || "-"}</td>
                <td style={{ padding: "8px" }}>{row.status_code ?? "-"}</td>
                <td style={{ padding: "8px" }}>{row.ip || "-"}</td>
                <td style={{ padding: "8px", textAlign: "right" }}>
                  <Link to={`/audit/${row.id}`} state={{ record: row }}>
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
            {!data?.results?.length && (
              <tr>
                <td colSpan={7} style={{ padding: 16, textAlign: "center", opacity: 0.7 }}>
                  Nenhum evento encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {busy && <div style={{ marginTop: 12 }}><Spinner size={30} /></div>}
    </div>
  );
}
