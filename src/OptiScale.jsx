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
  get:  (p)       => api.req(p),
  del:  (p)       => api.req(p, { method: "DELETE" }),
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
  box:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  wallet:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M12 11h4v2h-4z"/></svg>,
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
function Sidebar({ user, activeTab, onTabChange, onLogout }) {
  const tabs = [
    { id: "pacientes", label: "Pacientes", icon: Icon.users },
    { id: "inventario", label: "Inventario", icon: Icon.box },
    { id: "caja", label: "Caja", icon: Icon.wallet },
  ];

  return (
      <div style={{ width: 240, background: T.surface, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", height: "100vh", position: "fixed", left: 0, top: 0 }}>
        <div style={{ padding: "24px 20px 20px", borderBottom: `1px solid ${T.border}` }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: T.white, margin: 0, letterSpacing: -0.5 }}>OPTI<span style={{ color: T.accent }}>SCALE</span></h2>
          <p style={{ fontSize: 10, color: T.dim, marginTop: 4, letterSpacing: 1.5, textTransform: "uppercase" }}>Panel de Control</p>
        </div>
        <nav style={{ flex: 1, padding: "16px 10px" }}>
          {tabs.map(tab => (
              <div key={tab.id} onClick={() => onTabChange(tab.id)}
                   style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 10, cursor: "pointer", transition: "0.2s", marginBottom: 4,
                     background: activeTab === tab.id ? T.accentSoft : "transparent",
                     color: activeTab === tab.id ? T.accent : T.muted,
                     fontWeight: activeTab === tab.id ? 700 : 500 }}>
                {tab.icon} {tab.label}
              </div>
          ))}
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
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    await Promise.resolve();
    setLoading(true);
    try {
      const data = await api.get(`/pacientes/?buscar=${search}`);
      setPacientes(data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [load]);

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
                        <span>{p.total_consultas || 0} consulta{p.total_consultas !== 1 ? "s" : ""}</span>
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

// ─── PACIENTE FORM (crear y editar) ───
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
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [evolucion, setEvolucion] = useState(null);
  const [showEvo, setShowEvo] = useState(false);

  const load = useCallback(async () => {
    await Promise.resolve();
    setLoading(true);
    try {
      const data = await api.get(`/consultas/paciente/${pacienteData.id}`);
      setConsultas(data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [pacienteData.id]);

  useEffect(() => { void (async () => { await load(); })(); }, [load]);

  const reloadPaciente = async () => {
    try {
      const updated = await api.get(`/pacientes/${pacienteData.id}`);
      setPacienteData(updated);
    } catch (e) { void e; }
  };

  const verEvolucion = async () => {
    try {
      const data = await api.get(`/consultas/evolucion/${pacienteData.id}`);
      setEvolucion(data);
      setShowEvo(true);
    } catch (err) { setToast({ msg: err.message, type: "error" }); }
  };

  const eliminar = async (id) => {
    if (!confirm("¿Eliminar esta consulta?")) return;
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

        {consultas.length === 1 && (
            <div style={{ ...s.card, marginBottom: 16, padding: "14px 20px", background: T.yellowSoft, borderColor: `${T.yellow}44`, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18 }}>🟡</span>
              <span style={{ fontSize: 13, color: T.yellow }}>
            Registra <strong>1 consulta más</strong> para habilitar el reporte de evolución visual.
          </span>
            </div>
        )}

        <h2 style={{ fontSize: 16, fontWeight: 700, color: T.white, marginBottom: 14 }}>Historial ({consultas.length})</h2>

        {loading ? (
            <div style={{ textAlign: "center", padding: 40, color: T.dim }}>Cargando...</div>
        ) : consultas.length === 0 ? (
            <div style={{ ...s.card, textAlign: "center", padding: 50 }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>📋</div>
              <p style={{ color: T.muted, fontSize: 14, fontWeight: 600 }}>Sin consultas registradas</p>
              <button onClick={() => setShowForm(true)} style={{ ...s.btn, marginTop: 14, fontSize: 13 }}>{Icon.plus} Primera consulta</button>
            </div>
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
                        {c.observaciones && <div style={{ fontSize: 12, color: T.muted, marginTop: 8, fontStyle: "italic" }}>{c.observaciones.substring(0, 120)}</div>}
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
  if (st === "leve")    return { l: "Aumento leve",     e: "🟡", c: T.yellow };
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
        <h3 style={{ fontSize: 14, fontWeight: 700, color: T.white, marginTop: 0, marginBottom: 22 }}>
          📊 Comparativa Visual — Anterior vs Actual
        </h3>
        {datos.map((d, i) => {
          const info  = getStatusInfo(d.status);
          const antW  = (Math.abs(d.ant) / maxVal) * 100;
          const actW  = (Math.abs(d.act) / maxVal) * 100;
          const delta = d.act - d.ant;
          return (
              <div key={i} style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: T.white, fontWeight: 700 }}>{d.label}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, fontFamily: T.mono, color: delta > 0 ? T.red : delta < 0 ? T.green : T.muted, fontWeight: 700 }}>
                  {delta >= 0 ? "+" : ""}{delta.toFixed(2)} D
                </span>
                    <EvoBadge status={d.status} />
                  </div>
                </div>
                {[
                  { lb: "Anterior", v: d.ant, w: antW, color: `${T.accent}44` },
                  { lb: "Actual",   v: d.act, w: actW, color: info.c },
                ].map((bar) => (
                    <div key={bar.lb} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                      <span style={{ fontSize: 10, color: T.dim, width: 52, textAlign: "right" }}>{bar.lb}</span>
                      <div style={{ flex: 1, height: 14, borderRadius: 7, background: "rgba(255,255,255,0.04)", overflow: "hidden" }}>
                        <div style={{ width: `${Math.max(bar.w, 2)}%`, height: "100%", borderRadius: 7, background: bar.color, transition: "width 0.9s ease" }} />
                      </div>
                      <span style={{ fontSize: 12, fontFamily: T.mono, color: bar.lb === "Actual" ? T.white : T.muted, fontWeight: 600, width: 52 }}>
                  {bar.v >= 0 ? "+" : ""}{bar.v.toFixed(2)}
                </span>
                    </div>
                ))}
              </div>
          );
        })}
        <div style={{ display: "flex", gap: 20, paddingTop: 12, borderTop: `1px solid ${T.border}` }}>
          {[{ c: `${T.accent}44`, l: "Consulta anterior" }, { c: T.accent, l: "Consulta actual" }].map((leg) => (
              <div key={leg.l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 16, height: 7, borderRadius: 4, background: leg.c }} />
                <span style={{ fontSize: 11, color: T.dim }}>{leg.l}</span>
              </div>
          ))}
        </div>
      </div>
  );
}

function generarInterpretacion(paciente, od, oi, consulta_anterior, consulta_actual) {
  const overallStatus = getWorstStatus(od.status_esfera, od.status_cilindro, oi.status_esfera, oi.status_cilindro);
  const nombre = paciente.nombre;
  const fmtF = (d) => new Date(d + "T12:00:00").toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" });
  const fechaAnt = fmtF(consulta_anterior.fecha_consulta);
  const fechaAct = fmtF(consulta_actual.fecha_consulta);
  const sg = (v) => (v >= 0 ? "+" : "") + v.toFixed(2);

  if (overallStatus === "estable") {
    return {
      icono: "✅", colorBorde: T.green, colorFondo: T.greenSoft,
      titulo: "Visión estable — Sin cambios significativos",
      analisis: `Durante el período evaluado (${fechaAnt} → ${fechaAct}), la graduación de ${nombre} se ha mantenido dentro de rangos estables. No se detectan variaciones clínicamente significativas: OD Esfera ${sg(od.delta_esfera)} D, Cilindro ${sg(od.delta_cilindro)} D — OI Esfera ${sg(oi.delta_esfera)} D, Cilindro ${sg(oi.delta_cilindro)} D.`,
      recomendacion: "Continuar con la prescripción actual. Programar revisión de rutina en 12 meses, o antes si el paciente reporta cambios en la agudeza visual o molestias oculares.",
    };
  } else if (overallStatus === "leve") {
    return {
      icono: "🟡", colorBorde: T.yellow, colorFondo: T.yellowSoft,
      titulo: "Cambio leve detectado — Seguimiento recomendado",
      analisis: `Entre el ${fechaAnt} y el ${fechaAct}, se detectan cambios leves en la graduación de ${nombre}. Ojo derecho: Esfera ${sg(od.delta_esfera)} D, Cilindro ${sg(od.delta_cilindro)} D. Ojo izquierdo: Esfera ${sg(oi.delta_esfera)} D, Cilindro ${sg(oi.delta_cilindro)} D. Estos valores corresponden al rango de progresión natural esperado.`,
      recomendacion: "Evaluar si se requiere actualización de la prescripción óptica. Se recomienda programar la siguiente revisión en 6 meses para monitorear la progresión.",
    };
  } else {
    return {
      icono: "🔴", colorBorde: T.red, colorFondo: T.redSoft,
      titulo: "Aumento notable — Atención requerida",
      analisis: `Se detecta un aumento significativo en la graduación de ${nombre} entre el ${fechaAnt} y el ${fechaAct}. Ojo derecho: Esfera ${sg(od.delta_esfera)} D, Cilindro ${sg(od.delta_cilindro)} D. Ojo izquierdo: Esfera ${sg(oi.delta_esfera)} D, Cilindro ${sg(oi.delta_cilindro)} D. Este nivel de cambio supera el umbral esperable y requiere evaluación profesional.`,
      recomendacion: "Actualizar la prescripción a la brevedad posible. Considerar estudios complementarios (topografía corneal, fondo de ojo) para descartar condiciones subyacentes. Próxima revisión en 3 meses.",
    };
  }
}

function InterpretacionClinica({ paciente, od, oi, consulta_anterior, consulta_actual }) {
  const interp = generarInterpretacion(paciente, od, oi, consulta_anterior, consulta_actual);
  return (
      <div style={{ ...s.card, borderLeft: `4px solid ${interp.colorBorde}`, background: interp.colorFondo, padding: "22px 24px" }}>
        <div style={{ fontSize: 17, fontWeight: 800, color: T.white, marginBottom: 10 }}>
          {interp.icono} {interp.titulo}
        </div>
        <p style={{ fontSize: 13, color: T.text, lineHeight: 1.78, marginBottom: 14 }}>{interp.analisis}</p>
        <div style={{ background: "rgba(0,0,0,0.25)", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: T.muted, lineHeight: 1.6 }}>
          <span style={{ fontWeight: 700, color: T.white }}>📋 Recomendación: </span>
          {interp.recomendacion}
        </div>
      </div>
  );
}

function exportarPDF(data) {
  const { paciente, consulta_anterior, consulta_actual, od, oi } = data;
  const interp  = generarInterpretacion(paciente, od, oi, consulta_anterior, consulta_actual);
  const fmtDate = (d) => new Date(d + "T12:00:00").toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" });
  const fmtNum  = (v) => (v >= 0 ? "+" : "") + v.toFixed(2);
  const sBadge  = (st) => {
    const cls = st === "notable" ? "red" : st === "leve" ? "yellow" : "green";
    const txt = st === "notable" ? "🔴 Notable" : st === "leve" ? "🟡 Leve" : "✅ Estable";
    return `<span class="badge badge-${cls}">${txt}</span>`;
  };
  const dxActivos = DX_LIST.filter((d) => consulta_actual.diagnostico[d.key]).map((d) => d.label);
  const ic = interp.colorBorde === T.green ? "green" : interp.colorBorde === T.yellow ? "yellow" : "red";

  const eyeSection = (label, d) => {
    const rows = [
      { l: "Esfera",   ant: d.esf_anterior, act: d.esf_actual, delta: d.delta_esfera,   pct: d.pct_esfera,   st: d.status_esfera },
      { l: "Cilindro", ant: d.cil_anterior, act: d.cil_actual, delta: d.delta_cilindro, pct: d.pct_cilindro, st: d.status_cilindro },
    ];
    const mv = Math.max(...rows.flatMap((r) => [Math.abs(r.ant), Math.abs(r.act)]), 0.5);
    return `<div class="eye-card">
      <div class="eye-label">${label}</div>
      ${rows.map((r) => {
      const aW = Math.max((Math.abs(r.ant) / mv) * 100, 2);
      const bW = Math.max((Math.abs(r.act) / mv) * 100, 2);
      return `<div class="metric">
          <div class="metric-hdr"><span class="metric-name">${r.l}</span>${sBadge(r.st)}</div>
          <div class="brow"><span class="blbl">Anterior</span><div class="bouter"><div class="bant" style="width:${aW}%"></div></div><span class="bval muted">${fmtNum(r.ant)}</span></div>
          <div class="brow"><span class="blbl">Actual</span><div class="bouter"><div class="bact" style="width:${bW}%"></div></div><span class="bval">${fmtNum(r.act)}</span></div>
          <div class="delta">Δ <b>${r.delta >= 0 ? "+" : ""}${r.delta.toFixed(2)} D</b>${r.pct != null ? ` · ${r.pct.toFixed(1)}% cambio` : ""}</div>
        </div>`;
    }).join("")}
    </div>`;
  };

  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>Reporte — ${paciente.nombre}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',Arial,sans-serif;color:#1a1a2e;padding:28px 34px;font-size:13px;line-height:1.5}
.hdr{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #2d7aff;padding-bottom:14px;margin-bottom:20px}
.brand{font-size:22px;font-weight:800;letter-spacing:-1px}.brand span{color:#2d7aff}
.brand-sub{font-size:10px;color:#888;margin-top:3px;text-transform:uppercase;letter-spacing:2px}
.meta{text-align:right;font-size:11px;color:#555}
.meta .pname{font-size:16px;font-weight:700;color:#1a1a2e;margin-bottom:4px}
h2{font-size:14px;font-weight:700;margin:18px 0 10px;padding-bottom:5px;border-bottom:1px solid #e0e0e0}
.interp{border-left:4px solid #2d7aff;padding:13px 17px;border-radius:0 10px 10px 0;margin-bottom:18px}
.interp.green{border-color:#00875a;background:#f0fff8}.interp.yellow{border-color:#b87c00;background:#fffdf0}.interp.red{border-color:#cc0000;background:#fff5f5}
.ititle{font-size:15px;font-weight:800;margin-bottom:7px}
.itext{font-size:12px;color:#333;margin-bottom:10px}
.irec{font-size:11px;color:#555;font-style:italic;background:rgba(0,0,0,.05);padding:8px 10px;border-radius:6px}
.eye-grid{display:flex;gap:14px;margin-bottom:14px}
.eye-card{flex:1;border:1px solid #dde4f0;border-radius:10px;padding:14px 16px;background:#f8f9ff}
.eye-label{font-size:13px;font-weight:700;color:#2d7aff;margin-bottom:12px}
.metric{margin-bottom:14px}
.metric-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
.metric-name{font-size:12px;font-weight:700;color:#333}
.badge{font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px}
.badge-green{background:#e0fff5;color:#00875a}.badge-yellow{background:#fffbe0;color:#b87c00}.badge-red{background:#ffe0e0;color:#cc0000}
.brow{display:flex;align-items:center;gap:8px;margin-bottom:3px}
.blbl{font-size:10px;color:#999;width:48px;text-align:right}
.bouter{flex:1;height:10px;background:#e8eeff;border-radius:5px;overflow:hidden}
.bant{height:100%;background:#9bbcff;border-radius:5px}.bact{height:100%;background:#2d7aff;border-radius:5px}
.bval{font-size:11px;font-weight:600;width:46px;color:#1a1a2e;font-family:monospace}.bval.muted{color:#999}
.delta{font-size:11px;color:#555;margin-top:4px;text-align:right}
table{width:100%;border-collapse:collapse;font-size:12px;margin-bottom:14px}
thead th{background:#2d7aff;color:#fff;padding:7px 6px;text-align:center;font-size:10px;text-transform:uppercase;letter-spacing:.5px}
tbody td{padding:7px 6px;text-align:center;border-bottom:1px solid #eee}
tbody tr:nth-child(even){background:#f8f9ff}
.tpos{color:#cc0000;font-weight:700}.tneg{color:#00875a;font-weight:700}
.dx-list{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px}
.dx-tag{background:#e8eeff;color:#2d7aff;border-radius:6px;padding:4px 12px;font-size:11px;font-weight:600}
.obs{background:#f8f9ff;border-left:3px solid #2d7aff;padding:10px 14px;border-radius:0 8px 8px 0;font-size:12px;color:#333;margin-bottom:14px}
.glos{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
.gi{background:#f0f4ff;padding:7px 10px;border-radius:6px}
.gk{font-size:11px;font-weight:700;color:#2d7aff}.gv{font-size:10px;color:#666;margin-top:1px}
.leg{display:flex;gap:16px;margin-top:6px}.ldot{display:inline-block;width:14px;height:6px;border-radius:3px;margin-right:5px;vertical-align:middle}
.footer{margin-top:24px;padding-top:10px;border-top:1px solid #e0e0e0;display:flex;justify-content:space-between;font-size:10px;color:#aaa}
@media print{body{padding:16px}@page{margin:1cm;size:A4}}
</style></head><body>
<div class="hdr">
  <div><div class="brand">OPTI<span>SCALE</span></div><div class="brand-sub">Sistema de Gestión Visual Clínica</div></div>
  <div class="meta">
    <div class="pname">${paciente.nombre}</div>
    ${paciente.expediente ? `<div>Expediente: ${paciente.expediente}</div>` : ""}
    ${paciente.telefono   ? `<div>Tel: ${paciente.telefono}</div>` : ""}
    <div style="margin-top:4px">Período: <b>${fmtDate(consulta_anterior.fecha_consulta)}</b> → <b>${fmtDate(consulta_actual.fecha_consulta)}</b></div>
    <div>Generado: ${new Date().toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}</div>
  </div>
</div>
<div class="interp ${ic}">
  <div class="ititle">${interp.icono} ${interp.titulo}</div>
  <div class="itext">${interp.analisis}</div>
  <div class="irec">📋 Recomendación: ${interp.recomendacion}</div>
</div>
<h2>Graduación — Comparativa Visual</h2>
<div class="eye-grid">${eyeSection("👁 OD — Ojo Derecho", od)}${eyeSection("👁 OI — Ojo Izquierdo", oi)}</div>
<div class="leg">
  <span><span class="ldot" style="background:#9bbcff"></span>Consulta anterior</span>
  <span><span class="ldot" style="background:#2d7aff"></span>Consulta actual</span>
</div>
<h2>Tabla Resumen Numérico</h2>
<table>
  <thead><tr>
    <th>Parámetro</th><th>OD Ant.</th><th>OD Act.</th><th>Δ OD</th><th>% OD</th>
    <th>OI Ant.</th><th>OI Act.</th><th>Δ OI</th><th>% OI</th>
  </tr></thead>
  <tbody>
    <tr>
      <td><b>Esfera</b></td>
      <td>${fmtNum(od.esf_anterior)}</td><td>${fmtNum(od.esf_actual)}</td>
      <td class="${od.delta_esfera > 0 ? "tpos" : od.delta_esfera < 0 ? "tneg" : ""}">${fmtNum(od.delta_esfera)}</td>
      <td>${od.pct_esfera != null ? od.pct_esfera.toFixed(1) + "%" : "—"}</td>
      <td>${fmtNum(oi.esf_anterior)}</td><td>${fmtNum(oi.esf_actual)}</td>
      <td class="${oi.delta_esfera > 0 ? "tpos" : oi.delta_esfera < 0 ? "tneg" : ""}">${fmtNum(oi.delta_esfera)}</td>
      <td>${oi.pct_esfera != null ? oi.pct_esfera.toFixed(1) + "%" : "—"}</td>
    </tr>
    <tr>
      <td><b>Cilindro</b></td>
      <td>${fmtNum(od.cil_anterior)}</td><td>${fmtNum(od.cil_actual)}</td>
      <td class="${od.delta_cilindro > 0 ? "tpos" : od.delta_cilindro < 0 ? "tneg" : ""}">${fmtNum(od.delta_cilindro)}</td>
      <td>${od.pct_cilindro != null ? od.pct_cilindro.toFixed(1) + "%" : "—"}</td>
      <td>${fmtNum(oi.cil_anterior)}</td><td>${fmtNum(oi.cil_actual)}</td>
      <td class="${oi.delta_cilindro > 0 ? "tpos" : oi.delta_cilindro < 0 ? "tneg" : ""}">${fmtNum(oi.delta_cilindro)}</td>
      <td>${oi.pct_cilindro != null ? oi.pct_cilindro.toFixed(1) + "%" : "—"}</td>
    </tr>
  </tbody>
</table>
${dxActivos.length > 0 ? `<h2>Diagnóstico Actual</h2><div class="dx-list">${dxActivos.map((d) => `<span class="dx-tag">✓ ${d}</span>`).join("")}</div>` : ""}
${consulta_actual.observaciones ? `<h2>Observaciones Clínicas</h2><div class="obs">${consulta_actual.observaciones}</div>` : ""}
<h2>Glosario</h2>
<div class="glos">
  <div class="gi"><div class="gk">SPH (Esfera)</div><div class="gv">Potencia principal: (−) miopía · (+) hipermetropía</div></div>
  <div class="gi"><div class="gk">CYL (Cilindro)</div><div class="gv">Corrección del astigmatismo</div></div>
  <div class="gi"><div class="gk">AXIS (Eje)</div><div class="gv">Orientación del astigmatismo (0°–180°)</div></div>
  <div class="gi"><div class="gk">ADD (Adición)</div><div class="gv">Potencia extra para bifocales / progresivos</div></div>
  <div class="gi"><div class="gk">Δ (Delta)</div><div class="gv">Diferencia entre consulta anterior y actual</div></div>
  <div class="gi"><div class="gk">Semáforo</div><div class="gv">✅ Estable · 🟡 Leve (<1D) · 🔴 Notable (≥1D)</div></div>
</div>
<div class="footer">
  <span>OptiScale — Sistema de Gestión Visual Clínica</span>
  <span>Reporte generado: ${new Date().toLocaleString("es-MX")}</span>
</div>
<script>window.onload=function(){window.print();};</script>
</body></html>`;

  const win = window.open("", "_blank");
  if (win) { win.document.write(html); win.document.close(); }
  else alert("Activa ventanas emergentes en tu navegador para exportar el PDF.");
}

// ─── EVOLUCIÓN VIEW ───
function EvolucionView({ data, onBack }) {
  const { paciente, consulta_anterior, consulta_actual, od, oi } = data;

  return (
      <div>
        {/* Toolbar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <button onClick={onBack} style={s.btnGhost}>{Icon.back} Volver</button>
          <button onClick={() => exportarPDF(data)}
                  style={{ ...s.btn, background: "linear-gradient(135deg, #e74c3c, #c0392b)", fontSize: 13, padding: "10px 20px" }}>
            {Icon.pdf} Exportar PDF
          </button>
        </div>

        {/* Header */}
        <div style={{ ...s.card, textAlign: "center", padding: "28px 24px", background: `linear-gradient(135deg, ${T.card} 0%, #161e55 100%)`, borderColor: T.borderLight }}>
          <div style={{ fontSize: 10, color: T.dim, textTransform: "uppercase", letterSpacing: 3, marginBottom: 6 }}>Reporte de Evolución Visual</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: T.white }}>{paciente.nombre}</div>
          <div style={{ fontSize: 13, color: T.muted, marginTop: 6 }}>
            {consulta_anterior.fecha_consulta} → {consulta_actual.fecha_consulta}
            {consulta_actual.sucursal && ` · ${consulta_actual.sucursal}`}
          </div>
        </div>

        {/* Interpretación clínica automática */}
        <InterpretacionClinica
            paciente={paciente} od={od} oi={oi}
            consulta_anterior={consulta_anterior}
            consulta_actual={consulta_actual}
        />

        {/* Eye cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <EyeCard label="OD — Ojo Derecho"   d={od} />
          <EyeCard label="OI — Ojo Izquierdo" d={oi} />
        </div>

        {/* Gráfica comparativa */}
        <GraficaComparativa od={od} oi={oi} />

        {/* Tabla numérica */}
        <div style={s.card}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: T.white, marginTop: 0, marginBottom: 14 }}>Resumen Numérico</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
              <tr>
                {["Parámetro","OD Ant.","OD Act.","Δ OD","% OD","OI Ant.","OI Act.","Δ OI","% OI"].map((h) => (
                    <th key={h} style={{ padding: "10px 6px", textAlign: "center", fontSize: 10, fontWeight: 700, color: T.dim, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: `1px solid ${T.border}` }}>{h}</th>
                ))}
              </tr>
              </thead>
              <tbody>
              {[
                { l: "Esfera",   odA: od.esf_anterior, odN: od.esf_actual, odD: od.delta_esfera,   odP: od.pct_esfera,   oiA: oi.esf_anterior, oiN: oi.esf_actual, oiD: oi.delta_esfera,   oiP: oi.pct_esfera },
                { l: "Cilindro", odA: od.cil_anterior, odN: od.cil_actual, odD: od.delta_cilindro, odP: od.pct_cilindro, oiA: oi.cil_anterior, oiN: oi.cil_actual, oiD: oi.delta_cilindro, oiP: oi.pct_cilindro },
              ].map((r, i) => (
                  <tr key={i}>
                    <td style={{ padding: "10px 6px", fontWeight: 700, color: T.text }}>{r.l}</td>
                    {[
                      { v: r.odA }, { v: r.odN }, { v: r.odD, d: true }, { v: r.odP, d: true, p: true },
                      { v: r.oiA }, { v: r.oiN }, { v: r.oiD, d: true }, { v: r.oiP, d: true, p: true },
                    ].map((c, j) => (
                        <td key={j} style={{ padding: "10px 6px", textAlign: "center", fontFamily: T.mono, fontSize: 12, color: c.d ? (c.v > 0 ? T.red : c.v < 0 ? T.green : T.muted) : T.text, fontWeight: c.d ? 700 : 400 }}>
                          {c.v === null || c.v === undefined ? "—" : `${c.d && c.v > 0 ? "+" : ""}${c.v.toFixed(c.p ? 1 : 2)}${c.p ? "%" : ""}`}
                        </td>
                    ))}
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Diagnóstico */}
        {Object.values(consulta_actual.diagnostico).some(Boolean) && (
            <div style={s.card}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: T.white, marginTop: 0, marginBottom: 12 }}>Diagnóstico Actual</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {DX_LIST.filter((d) => consulta_actual.diagnostico[d.key]).map((d) => (
                    <span key={d.key} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, background: T.accentSoft, color: T.accent, border: `1px solid ${T.accent}33` }}>✓ {d.label}</span>
                ))}
              </div>
            </div>
        )}

        {/* Observaciones */}
        {consulta_actual.observaciones && (
            <div style={s.card}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: T.white, marginTop: 0, marginBottom: 8 }}>Observaciones</h3>
              <p style={{ fontSize: 14, color: T.text, lineHeight: 1.7, margin: 0 }}>{consulta_actual.observaciones}</p>
            </div>
        )}

        {/* Glosario */}
        <div style={{ ...s.card, background: "rgba(255,255,255,0.015)" }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, color: T.dim, marginTop: 0, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Glosario</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[
              ["SPH", "Potencia principal: (−) miopía · (+) hipermetropía"],
              ["CYL", "Corrección del astigmatismo"],
              ["AXIS", "Orientación del astigmatismo (0°–180°)"],
              ["ADD", "Potencia extra para bifocales / progresivos"],
              ["Δ", "Diferencia entre consulta anterior y actual"],
              ["Semáforo", "✅ Estable · 🟡 Leve (<1D) · 🔴 Notable (≥1D)"],
            ].map(([t, desc]) => (
                <div key={t} style={{ padding: "8px 10px", borderRadius: 8, background: T.bg }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: T.accent }}>{t}</div>
                  <div style={{ fontSize: 10, color: T.dim, marginTop: 2 }}>{desc}</div>
                </div>
            ))}
          </div>
        </div>

        {/* Botón PDF inferior */}
        <div style={{ textAlign: "center", paddingBottom: 32 }}>
          <button onClick={() => exportarPDF(data)}
                  style={{ ...s.btn, background: "linear-gradient(135deg, #e74c3c, #c0392b)", padding: "12px 36px", fontSize: 14 }}>
            {Icon.pdf} Exportar Reporte Completo en PDF
          </button>
        </div>
      </div>
  );
}

// ─── MODULO: INVENTARIO (CONECTADO AL API) ───
function InventarioModule() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newNombre, setNewNombre] = useState("");
  const [newCat, setNewCat] = useState("");
  const [newStock, setNewStock] = useState("");
  const [newPrecio, setNewPrecio] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get("/gestion/inventario");
      setItems(data || []);
    } catch (err) { console.error("Error cargando inventario", err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const agregarProducto = async () => {
    if(!newNombre || !newPrecio) return;
    try {
      await api.post("/gestion/inventario", {
        nombre: newNombre,
        categoria: newCat || "General",
        stock: parseInt(newStock) || 0,
        precio: parseFloat(newPrecio) || 0
      });
      load(); // Recarga los datos desde el backend
      setNewNombre(""); setNewCat(""); setNewStock(""); setNewPrecio("");
      setShowForm(false);
    } catch(err) { alert("Error guardando el producto"); }
  };

  return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24, alignItems: "center" }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: T.white, margin: 0 }}>Inventario</h1>
          <button style={s.btn} onClick={() => setShowForm(!showForm)}>
            {Icon.plus} {showForm ? "Cancelar" : "Agregar Producto"}
          </button>
        </div>

        {showForm && (
            <div style={{...s.card, display: "flex", gap: 10, alignItems: "flex-end"}}>
              <Field label="Producto" value={newNombre} onChange={setNewNombre} style={{flex: 2}} placeholder="Ej: Mica Blue Light" />
              <Field label="Categoría" value={newCat} onChange={setNewCat} style={{flex: 1}} placeholder="Ej: Cristales" />
              <Field label="Stock" type="number" value={newStock} onChange={setNewStock} style={{flex: 1}} placeholder="0" />
              <Field label="Precio" type="number" value={newPrecio} onChange={setNewPrecio} style={{flex: 1}} placeholder="0.00" />
              <button style={{...s.btn, height: "42px", padding: "0 20px"}} onClick={agregarProducto}>Guardar</button>
            </div>
        )}

        <div style={s.card}>
          {loading ? (
              <div style={{ textAlign: "center", padding: 40, color: T.dim }}>Cargando inventario...</div>
          ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                <tr style={{ textAlign: "left", color: T.dim, fontSize: 11, textTransform: "uppercase", borderBottom: `1px solid ${T.border}` }}>
                  <th style={{ padding: 12 }}>Producto</th>
                  <th>Categoría</th>
                  <th>Stock</th>
                  <th>Precio</th>
                  <th>Estado</th>
                </tr>
                </thead>
                <tbody>
                {items.map(i => (
                    <tr key={i.id} style={{ borderBottom: `1px solid ${T.border}`, fontSize: 14 }}>
                      <td style={{ padding: "16px 12px", color: T.white, fontWeight: 600 }}>{i.nombre}</td>
                      <td style={{ color: T.muted }}>{i.categoria}</td>
                      <td style={{ color: T.white, fontFamily: T.mono }}>{i.stock}</td>
                      <td style={{ color: T.white, fontFamily: T.mono }}>${i.precio}</td>
                      <td>
                  <span style={{ padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: i.stock < 10 ? T.yellowSoft : T.greenSoft, color: i.stock < 10 ? T.yellow : T.green }}>
                    {i.stock < 10 ? "STOCK BAJO" : "OK"}
                  </span>
                      </td>
                    </tr>
                ))}
                {items.length === 0 && (
                    <tr><td colSpan="5" style={{textAlign:"center", padding: 30, color: T.dim}}>No hay productos registrados</td></tr>
                )}
                </tbody>
              </table>
          )}
        </div>
      </div>
  );
}

// ─── MODULO: CAJA (CONECTADO AL API) ───
function CajaModule() {
  const [movs, setMovs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [concepto, setConcepto] = useState("");
  const [monto, setMonto] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get("/gestion/caja");
      setMovs(data || []);
    } catch (err) { console.error("Error cargando caja", err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const registrarMovimiento = async (tipo) => {
    if (!concepto || !monto) return;
    try {
      await api.post("/gestion/caja", {
        concepto: concepto,
        monto: parseFloat(monto),
        tipo: tipo
      });
      load(); // Recarga los datos desde el backend
      setConcepto("");
      setMonto("");
    } catch(err) { alert("Error guardando el movimiento"); }
  };

  const balance = movs.reduce((acc, m) => m.tipo === "ingreso" ? acc + m.monto : acc - m.monto, 0);

  return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24, alignItems: "center" }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: T.white, margin: 0 }}>Caja</h1>
          <div style={{ textAlign: "right" }}>
            <div style={s.label}>Balance Actual</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: balance >= 0 ? T.green : T.red }}>
              ${balance.toLocaleString()}
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20 }}>

          <div style={s.card}>
            <h3 style={{ fontSize: 14, color: T.muted, marginBottom: 20, marginTop: 0 }}>Movimientos Recientes</h3>
            {loading ? (
                <div style={{ textAlign: "center", padding: 20, color: T.dim }}>Cargando...</div>
            ) : movs.length === 0 ? (
                <div style={{ textAlign: "center", padding: 40, color: T.dim }}>Sin movimientos registrados</div>
            ) : (
                movs.slice().reverse().map(m => ( // Invertir para ver los más nuevos arriba
                    <div key={m.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${T.border}` }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: T.white }}>{m.concepto}</div>
                        <div style={{ fontSize: 11, color: T.dim, marginTop: 4 }}>
                          {new Date(m.fecha).toLocaleDateString("es-MX", { year:"numeric", month:"long", day:"numeric"})}
                        </div>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: m.tipo === "ingreso" ? T.green : T.red }}>
                        {m.tipo === "ingreso" ? "+" : "-"}${m.monto}
                      </div>
                    </div>
                ))
            )}
          </div>

          <div style={{ ...s.card, height: "fit-content" }}>
            <h3 style={{ fontSize: 14, color: T.muted, marginBottom: 20, marginTop: 0 }}>Nuevo Registro</h3>
            <Field label="Concepto" value={concepto} onChange={setConcepto} placeholder="Ej: Venta de armazón" style={{ marginBottom: 16 }} />
            <Field label="Monto" type="number" value={monto} onChange={setMonto} placeholder="0.00" style={{ marginBottom: 16 }} />
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button onClick={() => registrarMovimiento("ingreso")} style={{ ...s.btn, flex: 1, justifyContent: "center", background: T.green, boxShadow: "none" }}>+ Ingreso</button>
              <button onClick={() => registrarMovimiento("egreso")} style={{ ...s.btn, flex: 1, justifyContent: "center", background: T.red, boxShadow: "none" }}>- Egreso</button>
            </div>
          </div>

        </div>
      </div>
  );
}

// ─── APLICACIÓN PRINCIPAL ───
export default function OptiScaleApp() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("pacientes");
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
          .catch(() => { localStorage.removeItem("optiscale_token"); api.token = null; setAuthChecked(true); });
    } else {
      const t = setTimeout(() => setAuthChecked(true), 0);
      return () => clearTimeout(t);
    }
  }, []);

  const handleToastClose = useCallback(() => setToast(null), []);

  const logout = () => {
    localStorage.removeItem("optiscale_token");
    api.token = null;
    setUser(null);
    setSelectedPaciente(null);
  };

  if (!authChecked) return (
      <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.font, color: T.muted }}>
        Cargando...
      </div>
  );

  if (!user) return <AuthScreen onAuth={setUser} />;

  let content;
  if (activeTab === "pacientes") {
    if (showNewPaciente) {
      content = (
          <PacienteForm
              onSave={() => { setShowNewPaciente(false); setToast({ msg: "Paciente creado exitosamente", type: "success" }); }}
              onCancel={() => setShowNewPaciente(false)}
          />
      );
    } else if (selectedPaciente) {
      content = (
          <PacienteDetail
              paciente={selectedPaciente}
              onBack={() => setSelectedPaciente(null)}
              setToast={setToast}
          />
      );
    } else {
      content = <PacientesList onSelect={setSelectedPaciente} onNew={() => setShowNewPaciente(true)} />;
    }
  } else if (activeTab === "inventario") {
    content = <InventarioModule />;
  } else if (activeTab === "caja") {
    content = <CajaModule />;
  }

  return (
      <div style={{ fontFamily: T.font, background: T.bg, minHeight: "100vh", color: T.text }}>
        <Sidebar
            user={user}
            activeTab={activeTab}
            onTabChange={(id) => {
              setActiveTab(id);
              setSelectedPaciente(null);
              setShowNewPaciente(false);
            }}
            onLogout={logout}
        />
        <main style={{ marginLeft: 240, padding: "28px 36px", minHeight: "100vh" }}>
          {content}
        </main>
        {toast && <Toast msg={toast.msg} type={toast.type} onClose={handleToastClose} />}

        {/* Estilos Globales para Inputs */}
        <style>{`
        * { box-sizing: border-box; margin: 0; }
        body { margin: 0; padding: 0; background: ${T.bg}; }
        ::selection { background: ${T.accent}44; }
        @keyframes slideIn { from { transform: translateX(30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button { opacity: 1; }
        input:focus, select:focus, textarea:focus { border-color: ${T.accent} !important; box-shadow: 0 0 0 3px ${T.accentSoft} !important; }
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700;800&display=swap');
        @media (max-width: 900px) {
          main { margin-left: 0 !important; padding: 16px !important; }
          div[style*="width: 240"] { display: none !important; }
        }
      `}</style>
      </div>
  );
}