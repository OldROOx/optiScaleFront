import React, { useState, useEffect, useCallback } from "react";

// ─── CONFIG ───
const API = "http://127.0.0.1:8000/api";

// ─── THEME ───
const T = {
  bg: "#060b1e", surface: "#0c1231", card: "#101842", cardHover: "#141e52",
  border: "#1a2460", borderLight: "#243080",
  accent: "#2d7aff", accentSoft: "rgba(45,122,255,0.12)", accentGlow: "rgba(45,122,255,0.25)",
  green: "#00d68f", greenSoft: "rgba(0,214,143,0.12)",
  yellow: "#f5a623", yellowSoft: "rgba(245,166,35,0.12)",
  red: "#ff4757", redSoft: "rgba(255,71,87,0.12)",
  white: "#f0f4ff", text: "#c5cee0", muted: "#7b88a8", dim: "#4a5578",
  font: "'DM Sans','Avenir',-apple-system,sans-serif",
  mono: "'JetBrains Mono','Fira Code',monospace",
};

// ─── API HELPERS ───
const api = {
  token: null,
  async req(path, opts = {}) {
    const headers = { "Content-Type": "application/json", ...opts.headers };
    if (this.token) headers["Authorization"] = `Bearer ${this.token}`;
    const res = await fetch(`${API}${path}`, { ...opts, headers });
    if (res.status === 204) return null;
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Error en la solicitud");
    return data;
  },
  post: (p, body) => api.req(p, { method: "POST", body: JSON.stringify(body) }),
  put:  (p, body) => api.req(p, { method: "PUT",  body: JSON.stringify(body) }),
  get:  (p)        => api.req(p),
  del:  (p)        => api.req(p, { method: "DELETE" }),
};

// ─── ICONS ───
const Icon = {
  eye:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  users:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  plus:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  search:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  back:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  logout:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  chart:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  trash:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  chevron: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
  edit:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  pdf:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
};

// ─── SHARED STYLES ───
const s = {
  btn:       { padding: "12px 24px", fontSize: 14, fontWeight: 700, borderRadius: 10, border: "none", cursor: "pointer", transition: "all 0.2s", fontFamily: T.font, background: `linear-gradient(135deg, ${T.accent}, #5b6ef5)`, color: "#fff", boxShadow: `0 2px 12px ${T.accentGlow}`, display: "inline-flex", alignItems: "center", gap: 8 },
  btnGhost:  { padding: "10px 20px", fontSize: 13, fontWeight: 600, borderRadius: 10, border: `1.5px solid ${T.border}`, cursor: "pointer", fontFamily: T.font, background: "transparent", color: T.muted, transition: "all 0.2s", display: "inline-flex", alignItems: "center", gap: 6 },
  btnDanger: { padding: "8px 14px", fontSize: 12, fontWeight: 600, borderRadius: 8, border: `1px solid ${T.red}33`, cursor: "pointer", fontFamily: T.font, background: T.redSoft, color: T.red, transition: "all 0.2s", display: "inline-flex", alignItems: "center", gap: 4 },
  input:     { width: "100%", padding: "11px 14px", fontSize: 14, borderRadius: 10, border: `1.5px solid ${T.border}`, background: T.bg, color: T.white, outline: "none", boxSizing: "border-box", fontFamily: T.font, transition: "border-color 0.2s, box-shadow 0.2s" },
  label:     { display: "block", fontSize: 11, color: T.muted, marginBottom: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 },
  card:      { background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "24px 22px", marginBottom: 16 },
};

// ─── FIELD ───
function Field({ label, value, onChange, type = "text", placeholder = "", style: sx }) {
  const [focused, setFocused] = useState(false);
  return (
      <div style={sx}>
        {label && <label style={s.label}>{label}</label>}
        <input
            style={{ ...s.input, ...(focused ? { borderColor: T.accent, boxShadow: `0 0 0 3px ${T.accentSoft}` } : {}) }}
            type={type} value={value} placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
        />
      </div>
  );
}

// ─── TOAST ───
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  const color = type === "error" ? T.red : T.green;
  return (
      <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, padding: "14px 22px", borderRadius: 12, background: type === "error" ? T.redSoft : T.greenSoft, border: `1px solid ${color}44`, color, fontSize: 14, fontWeight: 600, fontFamily: T.font, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", animation: "slideIn 0.3s ease", maxWidth: 360 }}>
        {msg}
      </div>
  );
}

// ─── AUTH ───
function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [sucursal, setSucursal] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(""); setLoading(true);
    try {
      const data = mode === "login"
          ? await api.post("/auth/login", { email, password })
          : await api.post("/auth/registro", { nombre, email, password, sucursal: sucursal || null });
      const { access_token } = data;
      api.token = access_token;
      localStorage.setItem("optiscale_token", access_token);
      const me = await api.get("/auth/me");
      onAuth(me);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: `radial-gradient(ellipse at 30% 20%, rgba(45,122,255,0.08) 0%, transparent 60%), ${T.bg}`, fontFamily: T.font, padding: 20 }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, margin: "0 auto 16px", background: `linear-gradient(135deg, ${T.accent}, #5b6ef5)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 8px 32px ${T.accentGlow}`, color: "#fff" }}>{Icon.eye}</div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: T.white, margin: 0, letterSpacing: -1 }}>OPTI<span style={{ color: T.accent }}>SCALE</span></h1>
            <p style={{ color: T.muted, fontSize: 13, marginTop: 6, letterSpacing: 1 }}>EVOLUCIÓN VISUAL INTELIGENTE</p>
          </div>
          <div style={{ ...s.card, padding: "32px 28px", boxShadow: "0 8px 40px rgba(0,0,0,0.4)" }}>
            <div style={{ display: "flex", marginBottom: 28, borderRadius: 10, background: T.bg, padding: 3 }}>
              {["login", "registro"].map((m) => (
                  <button key={m} onClick={() => { setMode(m); setError(""); }}
                          style={{ flex: 1, padding: "10px 0", fontSize: 13, fontWeight: 700, border: "none", borderRadius: 8, cursor: "pointer", fontFamily: T.font, transition: "all 0.2s", background: mode === m ? T.card : "transparent", color: mode === m ? T.white : T.dim, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    {m === "login" ? "Iniciar Sesión" : "Registrarse"}
                  </button>
              ))}
            </div>
            {mode === "registro" && (
                <>
                  <Field label="Nombre completo" value={nombre} onChange={setNombre} placeholder="Dr. Juan Pérez" style={{ marginBottom: 14 }} />
                  <Field label="Sucursal" value={sucursal} onChange={setSucursal} placeholder="Tuxtla Gutiérrez" style={{ marginBottom: 14 }} />
                </>
            )}
            <Field label="Email" value={email} onChange={setEmail} type="email" placeholder="correo@optica.com" style={{ marginBottom: 14 }} />
            <Field label="Contraseña" value={password} onChange={setPassword} type="password" placeholder="••••••••" style={{ marginBottom: 6 }} />
            {error && <div style={{ padding: "10px 14px", borderRadius: 8, background: T.redSoft, color: T.red, fontSize: 13, marginTop: 12, fontWeight: 500 }}>{error}</div>}
            <button onClick={submit} disabled={loading}
                    style={{ ...s.btn, width: "100%", justifyContent: "center", marginTop: 20, padding: "14px 0", fontSize: 15, opacity: loading ? 0.6 : 1 }}>
              {loading ? "Cargando..." : mode === "login" ? "Entrar" : "Crear Cuenta"}
            </button>
          </div>
        </div>
      </div>
  );
}

// ─── SIDEBAR ───
function Sidebar({ user, onLogout }) {
  return (
      <div style={{ width: 240, background: T.surface, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", height: "100vh", position: "fixed", left: 0, top: 0 }}>
        <div style={{ padding: "24px 20px 20px", borderBottom: `1px solid ${T.border}` }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: T.white, margin: 0, letterSpacing: -0.5 }}>OPTI<span style={{ color: T.accent }}>SCALE</span></h2>
          <p style={{ fontSize: 10, color: T.dim, marginTop: 4, letterSpacing: 1.5, textTransform: "uppercase" }}>Panel de Control</p>
        </div>
        <nav style={{ flex: 1, padding: "16px 10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 10, background: T.accentSoft, color: T.accent, fontSize: 14, fontWeight: 700 }}>
            {Icon.users} Pacientes
          </div>
        </nav>
        <div style={{ padding: "16px 14px", borderTop: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.white, marginBottom: 2 }}>{user.nombre}</div>
          <div style={{ fontSize: 11, color: T.dim, marginBottom: 12 }}>{user.sucursal || user.email}</div>
          <button onClick={onLogout} style={{ ...s.btnGhost, width: "100%", justifyContent: "center", padding: "8px 0", fontSize: 12 }}>
            {Icon.logout} Cerrar sesión
          </button>
        </div>
      </div>
  );
}

// ─── PACIENTES LIST ───
function PacientesList({ onSelect, onNew }) {
  const [pacientes, setPacientes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get(`/pacientes/?buscar=${search}`);
      setPacientes(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: T.white, margin: 0 }}>Pacientes</h1>
            <p style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>{pacientes.length} registrados</p>
          </div>
          <button onClick={onNew} style={s.btn}>{Icon.plus} Nuevo Paciente</button>
        </div>
        <div style={{ position: "relative", marginBottom: 20 }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: T.dim }}>{Icon.search}</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre o expediente..."
                 style={{ ...s.input, paddingLeft: 42 }} />
        </div>
        {loading ? (
            <div style={{ textAlign: "center", padding: 60, color: T.dim }}>Cargando...</div>
        ) : pacientes.length === 0 ? (
            <div style={{ ...s.card, textAlign: "center", padding: 60 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>👤</div>
              <p style={{ color: T.muted, fontSize: 15, fontWeight: 600 }}>No hay pacientes aún</p>
              <p style={{ color: T.dim, fontSize: 13 }}>Crea uno para comenzar a registrar consultas</p>
            </div>
        ) : (
            <div style={{ display: "grid", gap: 8 }}>
              {pacientes.map((p) => (
                  <div key={p.id} onClick={() => onSelect(p)}
                       style={{ ...s.card, marginBottom: 0, padding: "16px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.15s" }}
                       onMouseEnter={(e) => { e.currentTarget.style.background = T.cardHover; e.currentTarget.style.borderColor = T.borderLight; }}
                       onMouseLeave={(e) => { e.currentTarget.style.background = T.card; e.currentTarget.style.borderColor = T.border; }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: T.white }}>{p.nombre}</div>
                      <div style={{ fontSize: 12, color: T.muted, marginTop: 3, display: "flex", gap: 12 }}>
                        {p.expediente && <span>Exp: {p.expediente}</span>}
                        <span>{p?.total_consultas ?? 0} consulta{p?.total_consultas !== 1 ? "s" : ""}</span>
                      </div>
                    </div>
                    <span style={{ color: T.dim }}>{Icon.chevron}</span>
                  </div>
              ))}
            </div>
        )}
      </div>
  );
}

// ─── PACIENTE FORM ───
function PacienteForm({ paciente, onSave, onCancel }) {
  const [nombre, setNombre] = useState(paciente?.nombre || "");
  const [telefono, setTelefono] = useState(paciente?.telefono || "");
  const [email, setEmail] = useState(paciente?.email || "");
  const [fechaNac, setFechaNac] = useState(paciente?.fecha_nacimiento || "");
  const [expediente, setExpediente] = useState(paciente?.expediente || "");
  const [notas, setNotas] = useState(paciente?.notas || "");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!nombre) return;
    setLoading(true);
    try {
      const body = { nombre, telefono: telefono || null, email: email || null, fecha_nacimiento: fechaNac || null, expediente: expediente || null, notas: notas || null };
      if (paciente) await api.put(`/pacientes/${paciente.id}`, body);
      else await api.post("/pacientes/", body);
      onSave();
    } catch (err) { alert(err.message); }
    finally { setLoading(false); }
  };

  return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button onClick={onCancel} style={s.btnGhost}>{Icon.back}</button>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: T.white, margin: 0 }}>{paciente ? "Editar Paciente" : "Nuevo Paciente"}</h1>
        </div>
        <div style={s.card}>
          <Field label="Nombre completo *" value={nombre} onChange={setNombre} placeholder="Apellidos y nombre" style={{ marginBottom: 16 }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
            <Field label="Teléfono" value={telefono} onChange={setTelefono} placeholder="961 123 4567" />
            <Field label="Email" value={email} onChange={setEmail} type="email" placeholder="paciente@mail.com" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
            <Field label="Fecha nacimiento" value={fechaNac} onChange={setFechaNac} type="date" />
            <Field label="No. Expediente" value={expediente} onChange={setExpediente} placeholder="EXP-001" />
          </div>
          <div>
            <label style={s.label}>Notas</label>
            <textarea value={notas} onChange={(e) => setNotas(e.target.value)} placeholder="Notas..."
                      style={{ ...s.input, minHeight: 70, resize: "vertical", fontFamily: T.font }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onCancel} style={s.btnGhost}>Cancelar</button>
          <button onClick={submit} disabled={loading} style={{ ...s.btn, opacity: loading ? 0.6 : 1 }}>
            {loading ? "Guardando..." : paciente ? "Actualizar Paciente" : "Crear Paciente"}
          </button>
        </div>
      </div>
  );
}

// ─── DX LIST ───
const DX_LIST = [
  { key: "miopia", label: "Miopía" },
  { key: "hipermetropia", label: "Hipermetropía" },
  { key: "astigmatismo", label: "Astigmatismo" },
  { key: "anisometropia", label: "Anisometropía" },
  { key: "presbicia", label: "Presbicia" },
  { key: "ambliopia", label: "Ambliopía" },
];

// ─── RX ROW ───
function RxRow({ label, data, onChange }) {
  const fields = [
    { key: "esfera", lbl: "Esfera", ph: "0.00", type: "number" },
    { key: "cilindro", lbl: "Cilindro", ph: "0.00", type: "number" },
    { key: "eje", lbl: "Eje (°)", ph: "0", type: "number" },
    { key: "adicion", lbl: "Adición", ph: "0.00", type: "number" },
  ];
  return (
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.accent, marginBottom: 10, paddingBottom: 6, borderBottom: `1px solid ${T.border}` }}>{label}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
          {fields.map(({ key, lbl, ph, type }) => (
              <Field key={key} label={lbl} type={type} value={data[key]} onChange={(val) => onChange(key, val)} placeholder={ph} />
          ))}
        </div>
      </div>
  );
}

// ─── CONSULTA FORM ───
function ConsultaForm({ pacienteId, onSave, onCancel }) {
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [sucursal, setSucursal] = useState("");
  const [od, setOd] = useState({ esfera: "", cilindro: "", eje: "", adicion: "" });
  const [oi, setOi] = useState({ esfera: "", cilindro: "", eje: "", adicion: "" });
  const [dx, setDx] = useState({});
  const [obs, setObs] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOd = (field, val) => setOd((prev) => ({ ...prev, [field]: val }));
  const handleOi = (field, val) => setOi((prev) => ({ ...prev, [field]: val }));

  const submit = async () => {
    setLoading(true);
    try {
      const n = (v) => parseFloat(v) || 0;
      await api.post("/consultas/", {
        paciente_id: pacienteId, fecha_consulta: fecha, sucursal: sucursal || null,
        od: { esfera: n(od.esfera), cilindro: n(od.cilindro), eje: parseInt(od.eje) || 0, adicion: n(od.adicion) },
        oi: { esfera: n(oi.esfera), cilindro: n(oi.cilindro), eje: parseInt(oi.eje) || 0, adicion: n(oi.adicion) },
        diagnostico: { miopia: !!dx.miopia, hipermetropia: !!dx.hipermetropia, astigmatismo: !!dx.astigmatismo, anisometropia: !!dx.anisometropia, presbicia: !!dx.presbicia, ambliopia: !!dx.ambliopia },
        observaciones: obs || null,
      });
      onSave();
    } catch (err) { alert(err.message); }
    finally { setLoading(false); }
  };

  return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button onClick={onCancel} style={s.btnGhost}>{Icon.back}</button>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: T.white, margin: 0 }}>Nueva Consulta</h1>
        </div>
        <div style={s.card}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
            <Field label="Fecha de consulta" type="date" value={fecha} onChange={setFecha} />
            <Field label="Sucursal" value={sucursal} onChange={setSucursal} placeholder="Tuxtla Gutiérrez" />
          </div>
          <RxRow label="OD — Ojo Derecho" data={od} onChange={handleOd} />
          <RxRow label="OI — Ojo Izquierdo" data={oi} onChange={handleOi} />
        </div>
        <div style={s.card}>
          <label style={{ ...s.label, marginBottom: 12 }}>Diagnóstico</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {DX_LIST.map((d) => (
                <div key={d.key} onClick={() => setDx((prev) => ({ ...prev, [d.key]: !prev[d.key] }))}
                     style={{ padding: "10px 14px", borderRadius: 10, cursor: "pointer", transition: "all 0.15s", background: dx[d.key] ? T.accentSoft : "transparent", border: `1.5px solid ${dx[d.key] ? T.accent : T.border}`, display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 16, height: 16, borderRadius: 5, flexShrink: 0, border: `2px solid ${dx[d.key] ? T.accent : T.dim}`, background: dx[d.key] ? T.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {dx[d.key] && <span style={{ color: "#fff", fontSize: 10, fontWeight: 800 }}>✓</span>}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: dx[d.key] ? T.white : T.muted }}>{d.label}</span>
                </div>
            ))}
          </div>
        </div>
        <div style={s.card}>
          <label style={s.label}>Observaciones</label>
          <textarea value={obs} onChange={(e) => setObs(e.target.value)} placeholder="Recomendaciones..."
                    style={{ ...s.input, minHeight: 80, resize: "vertical", fontFamily: T.font }} />
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onCancel} style={s.btnGhost}>Cancelar</button>
          <button onClick={submit} disabled={loading} style={{ ...s.btn, opacity: loading ? 0.6 : 1 }}>
            {loading ? "Guardando..." : "Registrar Consulta"}
          </button>
        </div>
      </div>
  );
}

// ─── PACIENTE DETAIL ───
function PacienteDetail({ paciente, onBack, setToast }) {
  const [pacienteData, setPacienteData] = useState(paciente);
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [evolucion, setEvolucion] = useState(null);
  const [showEvo, setShowEvo] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get(`/consultas/paciente/${pacienteData.id}`);
      setConsultas(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pacienteData.id]);

  useEffect(() => {
    load();
  }, [load]);

  const reloadPaciente = async () => {
    try {
      const updated = await api.get(`/pacientes/${pacienteData.id}`);
      setPacienteData(updated);
    } catch (err) {
      console.warn("No se pudo actualizar");
    }
  };

  const verEvolucion = async () => {
    try {
      const data = await api.get(`/consultas/evolucion/${pacienteData.id}`);
      setEvolucion(data);
      setShowEvo(true);
    } catch (err) { setToast({ msg: err.message, type: "error" }); }
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta consulta?")) return;
    try {
      await api.del(`/consultas/${id}`);
      load();
      setToast({ msg: "Consulta eliminada", type: "success" });
    } catch (err) { setToast({ msg: err.message, type: "error" }); }
  };

  if (showEvo && evolucion) return <EvolucionView data={evolucion} onBack={() => setShowEvo(false)} />;

  if (showEdit) return (
      <PacienteForm
          paciente={pacienteData}
          onSave={async () => {
            await reloadPaciente();
            setShowEdit(false);
            setToast({ msg: "Paciente actualizado correctamente", type: "success" });
          }}
          onCancel={() => setShowEdit(false)}
      />
  );

  if (showForm) return (
      <ConsultaForm
          pacienteId={pacienteData.id}
          onSave={() => { setShowForm(false); load(); setToast({ msg: "Consulta registrada", type: "success" }); }}
          onCancel={() => setShowForm(false)}
      />
  );

  return (
      <div>
        <button onClick={onBack} style={{ ...s.btnGhost, marginBottom: 16 }}>{Icon.back} Pacientes</button>
        <div style={{ ...s.card, padding: "28px 24px", background: `linear-gradient(135deg, ${T.card} 0%, #141a4a 100%)`, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: T.white, margin: 0 }}>{pacienteData.nombre}</h1>
              <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
                {pacienteData.expediente && <span style={{ fontSize: 12, color: T.muted, background: T.bg, padding: "4px 10px", borderRadius: 6 }}>Exp: {pacienteData.expediente}</span>}
                {pacienteData.telefono && <span style={{ fontSize: 12, color: T.muted }}>{pacienteData.telefono}</span>}
                {pacienteData.email && <span style={{ fontSize: 12, color: T.dim }}>{pacienteData.email}</span>}
              </div>
              {pacienteData.notas && <p style={{ fontSize: 12, color: T.dim, marginTop: 8, fontStyle: "italic" }}>{pacienteData.notas}</p>}
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button onClick={() => setShowEdit(true)} style={{ ...s.btnGhost, padding: "10px 16px", fontSize: 13 }}>
                {Icon.edit} Editar datos
              </button>
              {consultas.length >= 2 && (
                  <button onClick={verEvolucion} style={{ ...s.btn, padding: "10px 18px", fontSize: 13, background: `linear-gradient(135deg, ${T.green}, #00b87a)` }}>
                    {Icon.chart} Ver Evolución
                  </button>
              )}
              <button onClick={() => setShowForm(true)} style={{ ...s.btn, padding: "10px 18px", fontSize: 13 }}>
                {Icon.plus} Nueva Consulta
              </button>
            </div>
          </div>
        </div>

        <h2 style={{ fontSize: 16, fontWeight: 700, color: T.white, marginBottom: 14 }}>Historial ({consultas.length})</h2>
        {loading ? (
            <div style={{ textAlign: "center", padding: 40, color: T.dim }}>Cargando...</div>
        ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {consultas.map((c) => (
                  <div key={c.id} style={{ ...s.card, marginBottom: 0, padding: "18px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: T.white, marginBottom: 8 }}>
                          {new Date(c.fecha_consulta + "T12:00:00").toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}
                          {c.sucursal && <span style={{ color: T.dim, fontWeight: 400 }}> · {c.sucursal}</span>}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                          {[{ l: "OD", d: c.od }, { l: "OI", d: c.oi }].map(({ l, d }) => (
                              <div key={l}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: T.accent, marginBottom: 4 }}>{l}</div>
                                <div style={{ fontSize: 12, color: T.text, fontFamily: T.mono }}>
                                  Esf: {d.esfera} · Cil: {d.cilindro} · Eje: {d.eje}° · Add: {d.adicion}
                                </div>
                              </div>
                          ))}
                        </div>
                      </div>
                      <button onClick={() => eliminar(c.id)} style={s.btnDanger}>{Icon.trash}</button>
                    </div>
                  </div>
              ))}
            </div>
        )}
      </div>
  );
}

// ─── EVO HELPERS ───
function getStatusInfo(st) {
  if (st === "estable") return { l: "Mejoró / Estable", e: "✅", c: T.green };
  if (st === "leve")    return { l: "Aumento leve",      e: "🟡", c: T.yellow };
  if (st === "notable") return { l: "Aumento notable",  e: "🔴", c: T.red };
  return { l: "Sin cambio", e: "✅", c: T.green };
}

function getWorstStatus(...statuses) {
  if (statuses.includes("notable")) return "notable";
  if (statuses.includes("leve"))    return "leve";
  return "estable";
}

function EvoBadge({ status }) {
  const info = getStatusInfo(status);
  return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: `${info.c}18`, color: info.c, border: `1px solid ${info.c}33` }}>
      {info.e} {info.l}
    </span>
  );
}

function ValBlock({ label, ant, act, delta, pct, status }) {
  const info = getStatusInfo(status);
  return (
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</span>
          <EvoBadge status={status} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 12, background: T.bg }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: T.muted, fontFamily: T.mono }}>{ant.toFixed(2)}</div>
            <div style={{ fontSize: 10, color: T.dim, marginTop: 2, textTransform: "uppercase", letterSpacing: 1 }}>Anterior</div>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, padding: "6px 14px", borderRadius: 10, color: info.c, background: `${info.c}15`, fontFamily: T.mono }}>
            {delta >= 0 ? "+" : ""}{delta.toFixed(2)}
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: T.white, fontFamily: T.mono }}>{act.toFixed(2)}</div>
            <div style={{ fontSize: 10, color: T.dim, marginTop: 2, textTransform: "uppercase", letterSpacing: 1 }}>Actual</div>
          </div>
        </div>
        {pct !== null && pct !== undefined && (
            <div style={{ textAlign: "center", marginTop: 8, fontSize: 14, fontWeight: 700, color: info.c }}>{pct.toFixed(1)}% cambio</div>
        )}
      </div>
  );
}

function EvoBars({ d }) {
  return (
      <>
        {[
          { l: "Esfera (D)", ant: Math.abs(d.esf_anterior), act: Math.abs(d.esf_actual) },
          { l: "Cilindro (D)", ant: Math.abs(d.cil_anterior), act: Math.abs(d.cil_actual) },
        ].map(({ l, ant, act }) => {
          const mx = Math.max(ant, act, 0.5);
          return (
              <div key={l} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: T.dim, marginBottom: 5, fontWeight: 600 }}>{l}</div>
                {[{ lb: "Anterior", v: ant, cl: `${T.accent}66` }, { lb: "Actual", v: act, cl: T.accent }].map((b) => (
                    <div key={b.lb} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 10, color: T.dim, width: 46, textAlign: "right" }}>{b.lb}</span>
                      <div style={{ flex: 1, height: 7, borderRadius: 4, background: "rgba(255,255,255,0.04)" }}>
                        <div style={{ height: "100%", borderRadius: 4, width: `${(b.v / mx) * 100}%`, background: b.cl, transition: "width 0.8s" }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, width: 44, color: b.lb === "Actual" ? T.white : T.muted, fontFamily: T.mono }}>{b.v.toFixed(2)}</span>
                    </div>
                ))}
              </div>
          );
        })}
      </>
  );
}

function EyeCard({ label, d }) {
  return (
      <div style={{ ...s.card, padding: "22px 20px" }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: T.white, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 22 }}>👁</span> {label}
        </div>
        <ValBlock label="Esfera" ant={d.esf_anterior} act={d.esf_actual} delta={d.delta_esfera} pct={d.pct_esfera} status={d.status_esfera} />
        <ValBlock label="Cilindro" ant={d.cil_anterior} act={d.cil_actual} delta={d.delta_cilindro} pct={d.pct_cilindro} status={d.status_cilindro} />
        <div style={{ marginTop: 10 }}><EvoBars d={d} /></div>
      </div>
  );
}

function GraficaComparativa({ od, oi }) {
  const datos = [
    { label: "Esfera OD",   ant: od.esf_anterior, act: od.esf_actual, status: od.status_esfera },
    { label: "Cilindro OD", ant: od.cil_anterior, act: od.cil_actual, status: od.status_cilindro },
    { label: "Esfera OI",   ant: oi.esf_anterior, act: oi.esf_actual, status: oi.status_esfera },
    { label: "Cilindro OI", ant: oi.cil_anterior, act: oi.cil_actual, status: oi.status_cilindro },
  ];
  const maxVal = Math.max(...datos.flatMap((d) => [Math.abs(d.ant), Math.abs(d.act)]), 0.5);

  return (
      <div style={s.card}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: T.white, marginTop: 0, marginBottom: 22 }}>📊 Comparativa Visual</h3>
        {datos.map((d, i) => {
          const info = getStatusInfo(d.status);
          const delta = d.act - d.ant;
          return (
              <div key={i} style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: T.white, fontWeight: 700 }}>{d.label}</span>
                  <span style={{ fontSize: 12, fontFamily: T.mono, color: delta > 0 ? T.red : delta < 0 ? T.green : T.muted }}>
                {delta >= 0 ? "+" : ""}{delta.toFixed(2)} D
              </span>
                </div>
                {[
                  { lb: "Ant.", v: d.ant, cl: `${T.accent}44` },
                  { lb: "Act.", v: d.act, cl: info.c },
                ].map((bar) => (
                    <div key={bar.lb} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                      <span style={{ fontSize: 10, color: T.dim, width: 30 }}>{bar.lb}</span>
                      <div style={{ flex: 1, height: 14, borderRadius: 7, background: "rgba(255,255,255,0.04)" }}>
                        <div style={{ width: `${(Math.abs(bar.v) / maxVal) * 100}%`, height: "100%", borderRadius: 7, background: bar.cl }} />
                      </div>
                    </div>
                ))}
              </div>
          );
        })}
      </div>
  );
}

function InterpretacionClinica({ paciente, od, oi, consulta_anterior, consulta_actual }) {
  const overallStatus = getWorstStatus(od.status_esfera, od.status_cilindro, oi.status_esfera, oi.status_cilindro);
  const info = getStatusInfo(overallStatus);
  return (
      <div style={{ ...s.card, borderLeft: `4px solid ${info.c}`, background: `${info.c}11` }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: T.white, marginBottom: 8 }}>{info.e} Estado: {info.l}</div>
        <p style={{ fontSize: 13, color: T.text, lineHeight: 1.6 }}>Análisis para {paciente.nombre} basado en consultas del {consulta_anterior.fecha_consulta} al {consulta_actual.fecha_consulta}.</p>
      </div>
  );
}

function exportarPDF(data) {
  // Simulación de exportación simplificada para el archivo completo
  window.print();
}

function EvolucionView({ data, onBack }) {
  const { paciente, consulta_anterior, consulta_actual, od, oi } = data;
  return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <button onClick={onBack} style={s.btnGhost}>{Icon.back} Volver</button>
          <button onClick={() => exportarPDF(data)} style={{ ...s.btn, background: T.red }}>{Icon.pdf} Exportar PDF</button>
        </div>
        <div style={{ ...s.card, textAlign: "center" }}>
          <h2 style={{ color: T.white }}>Evolución de {paciente.nombre}</h2>
        </div>
        <InterpretacionClinica paciente={paciente} od={od} oi={oi} consulta_anterior={consulta_anterior} consulta_actual={consulta_actual} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <EyeCard label="Ojo Derecho" d={od} />
          <EyeCard label="Ojo Izquierdo" d={oi} />
        </div>
        <GraficaComparativa od={od} oi={oi} />
      </div>
  );
}

// ─── MAIN APP ───
export default function OptiScaleApp() {
  const [user, setUser] = useState(null);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [showNewPaciente, setShowNewPaciente] = useState(false);
  const [toast, setToast] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("optiscale_token");
    if (token) {
      api.token = token;
      api.get("/auth/me")
          .then((u) => { setUser(u); setAuthChecked(true); })
          .catch(() => { localStorage.removeItem("optiscale_token"); setAuthChecked(true); });
    } else {
      setAuthChecked(true);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("optiscale_token");
    api.token = null;
    setUser(null);
  };

  if (!authChecked) return <div style={{ color: T.muted, padding: 40 }}>Cargando aplicación...</div>;
  if (!user) return <AuthScreen onAuth={setUser} />;

  let content;
  if (showNewPaciente) {
    content = <PacienteForm onSave={() => { setShowNewPaciente(false); setToast({ msg: "Paciente creado", type: "success" }); }} onCancel={() => setShowNewPaciente(false)} />;
  } else if (selectedPaciente) {
    content = <PacienteDetail paciente={selectedPaciente} onBack={() => setSelectedPaciente(null)} setToast={setToast} />;
  } else {
    content = <PacientesList onSelect={setSelectedPaciente} onNew={() => setShowNewPaciente(true)} />;
  }

  return (
      <div style={{ fontFamily: T.font, background: T.bg, minHeight: "100vh", color: T.text }}>
        <Sidebar user={user} onLogout={logout} />
        <main style={{ marginLeft: 240, padding: "28px 36px" }}>{content}</main>
        {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: ${T.bg}; }
        @keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
      </div>
  );
}