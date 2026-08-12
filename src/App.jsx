import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

/* Módulos de la instancia PL Offshore.
   El código mono reemplaza al icono: es la convención de la marca. */
const MODULOS = [
  { id:"compras", codigo:"COMP", nombre:"Sistema de Compras",
    descripcion:"Requisiciones, tracker de órdenes de compra, proveedores y KPIs.",
    status:"activo", url:"https://integra.compras.ploffshore.com",
    tags:["Requisiciones","Proveedores","KPIs"] },
  { id:"viveres", codigo:"VIV", nombre:"Víveres",
    descripcion:"Pedidos de víveres por embarcación, control de dieta y cálculo USD por cabeza y día.",
    status:"activo", url:"https://integra.viveres.ploffshore.com",
    tags:["Embarcaciones","Catering"] },
  { id:"projects", codigo:"PROJ", nombre:"Projects",
    descripcion:"Gestión de proyectos con diagrama de Gantt, camino crítico y seguimiento de tareas.",
    status:"activo", url:"https://integra.projects.ploffshore.com",
    tags:["Gantt","Camino crítico"] },
  { id:"mantenimiento", codigo:"MANT", nombre:"Mantenimiento",
    descripcion:"Mantenimiento preventivo y correctivo de la flota con historial técnico por embarcación.",
    status:"activo", url:"https://integra.mantenimiento.ploffshore.com",
    tags:["Preventivo","Correctivo","Flota"] },
  { id:"reparaciones", codigo:"SSRR", nombre:"Solicitudes de Reparación",
    descripcion:"Solicitudes de reparación por barco y panel de control del superintendente técnico.",
    status:"activo", url:"https://integra.ssrr.ploffshore.com",
    tags:["Embarcaciones","SSRR"] },
  { id:"certificados", codigo:"CERT", nombre:"Certificados",
    descripcion:"Certificados estatutarios y de equipos de la flota, con aviso de vencimientos.",
    status:"activo", url:"https://integra.certificados.ploffshore.com",
    tags:["Estatutarios","Equipos","Vencimientos"] },
  { id:"cost-tracker", codigo:"COST", nombre:"Cost Project Tracker",
    descripcion:"Control de costos, órdenes de compra, márgenes y cashflow de proyectos.",
    status:"activo", url:"https://integra.costtracker.ploffshore.com",
    tags:["Proyectos","OC","Márgenes"] },
  { id:"hsqe", codigo:"HSQE", nombre:"HSQE",
    descripcion:"Certificaciones, vencimientos, inspecciones, incidentes y cumplimiento normativo.",
    status:"activo", url:"https://hsqe-pl-offshore.vercel.app",
    tags:["Seguridad","Incidentes","OCIMF"] },
  { id:"pipeline", codigo:"PIPE", nombre:"Pipeline de Oportunidades",
    descripcion:"Seguimiento comercial de licitaciones, propuestas y oportunidades de negocio.",
    status:"proximamente", url:null, tags:["Comercial","Licitaciones"] },
  { id:"tripulaciones", codigo:"CREW", nombre:"Optimizador de Tripulaciones",
    descripcion:"Personal embarcado, rotaciones, documentación y liquidaciones.",
    status:"proximamente", url:null, tags:["Personal","Embarcaciones"] },
  { id:"documentos", codigo:"DOC", nombre:"Control Documentario",
    descripcion:"Documentación técnica, legal y operativa centralizada.",
    status:"proximamente", url:null, tags:["Documentos","Cumplimiento"] },
  { id:"dashboards", codigo:"DASH", nombre:"Dashboards",
    descripcion:"Panel ejecutivo con KPIs consolidados de todos los módulos.",
    status:"proximamente", url:null, tags:["Reportes","KPIs"] },
];

/* ─── LOGIN ─────────────────────────────────────────────────────────────────── */
function LoginPage() {
  const [email, setEmail]     = useState("");
  const [pass, setPass]       = useState("");
  const [show, setShow]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleLogin = async () => {
    setLoading(true); setError("");
    try {
      const { error: e } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (e) setError("Revisá el correo y la contraseña. La cuenta no coincide.");
    } catch {
      setError("No se pudo conectar con el servidor. Verificá tu red e intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") handleLogin(); };

  return (
    <div className="login-page">
      <section className="login-brand">
        <div className="login-brand-top">
          <img src="/ploffshore-blanco.png" alt="PL Offshore" className="login-brand-logo" />
          <div className="login-env">
            <span className="login-env-dot" />
            INSTANCIA PL OFFSHORE
          </div>
        </div>

        <div>
          <div className="login-eyebrow">Sistema de gestión</div>
          <h1 className="login-h1">Operación, flota y documentación en un solo sistema.</h1>
          <div className="login-rule" />
          <p className="login-lead">
            Compras, víveres, mantenimiento, certificados, costos y HSQE de la flota,
            sobre la misma base funcional del grupo.
          </p>
          <div className="login-claim">We find the way, or we make one.</div>
        </div>

        <div className="login-brand-foot">
          <div className="login-built-on">
            <div className="login-built-on-label">Desarrollado sobre</div>
            <img src="/integra-logo-white-noclaim.svg" alt="INTEGRA" />
          </div>
          <div className="login-meta">
            <div>PL Offshore S.A.</div>
            <div>integra.ploffshore.com</div>
          </div>
        </div>
      </section>

      <section className="login-form-side">
        <div className="login-form-head">
          <div>
            <div className="i-label">Acceso a la instancia</div>
            <div style={{ font: "600 15px/1.4 var(--font-sans)", color: "var(--navy-integra)", marginTop: 4 }}>
              PL Offshore
            </div>
          </div>
          <div className="login-tls">TLS 1.3 · CIFRADO</div>
        </div>

        <div className="login-form">
          <h2 className="login-form-title">Acceso al portal</h2>
          <p className="login-form-lead">Ingresá con tu cuenta corporativa. Solo personal autorizado.</p>

          {error && (
            <div className="alert" style={{ marginTop: 24 }} role="alert">
              <div className="alert-label">No se pudo ingresar</div>
              <div className="alert-text">{error}</div>
            </div>
          )}

          <div className="login-fields">
            <div className="field">
              <label htmlFor="login-email">Correo corporativo</label>
              <input
                id="login-email" type="email" value={email} autoFocus
                onChange={e => setEmail(e.target.value)} onKeyDown={handleKey}
                placeholder="usuario@paranalogistica.com.ar" disabled={loading}
              />
            </div>
            <div className="field field-pass">
              <label htmlFor="login-pass">Contraseña</label>
              <input
                id="login-pass" type={show ? "text" : "password"} value={pass}
                onChange={e => setPass(e.target.value)} onKeyDown={handleKey}
                placeholder="••••••••" disabled={loading}
              />
              <button type="button" className="field-pass-toggle" onClick={() => setShow(!show)}>
                {show ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          <button
            className="btn btn-primary"
            style={{ marginTop: 24, height: 44, width: "100%", fontSize: 15 }}
            onClick={handleLogin}
            disabled={loading || !email || !pass}
          >
            {loading ? "Verificando credenciales…" : "Ingresar"}
          </button>

          <div className="login-form-foot">
            <div className="login-form-foot-rule" />
            <div className="login-form-foot-row">
              <span>Acceso restringido · Confidencial</span>
              <span className="powered">Powered by INTEGRA</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── CARD DE MÓDULO ────────────────────────────────────────────────────────── */
function ModuloCard({ mod, tieneAcceso }) {
  const activo     = mod.status === "activo";
  const puedeAbrir = activo && !!mod.url && tieneAcceso;
  const estado     = !activo ? "soon" : tieneAcceso ? "open" : "blocked";

  const handleClick = () => { if (puedeAbrir) window.location.href = mod.url; };

  return (
    <div
      className={`mod-card ${puedeAbrir ? "is-open" : estado === "blocked" ? "is-blocked" : "is-soon"}`}
      onClick={handleClick}
      role={puedeAbrir ? "link" : undefined}
      tabIndex={puedeAbrir ? 0 : undefined}
      onKeyDown={e => { if (puedeAbrir && (e.key === "Enter" || e.key === " ")) handleClick(); }}
    >
      <div className="mod-card-bar" />

      <div className="mod-card-body">
        <div className="mod-card-top">
          <span className="mod-code">{mod.codigo}</span>
          {estado === "blocked" && <span className="badge badge-error">Sin acceso</span>}
          {estado === "open"    && <span className="badge badge-ok"><span className="badge-dot" />Activo</span>}
          {estado === "soon"    && <span className="badge badge-draft">Próximamente</span>}
        </div>

        <div className="mod-nombre">{mod.nombre}</div>
        <div className="mod-desc">{mod.descripcion}</div>

        <div className="mod-tags">
          {mod.tags.map(t => <span key={t} className="mod-tag">{t}</span>)}
        </div>
      </div>

      <div className="mod-card-foot">
        {estado === "blocked"
          ? <span className="mod-link-off">Acceso no autorizado</span>
          : puedeAbrir
            ? <span className="mod-link">Abrir módulo</span>
            : <span className="mod-link-off">En desarrollo</span>
        }
      </div>
    </div>
  );
}

/* ─── APP ───────────────────────────────────────────────────────────────────── */
export default function App() {
  const [session, setSession]                     = useState(null);
  const [modulosPermitidos, setModulosPermitidos] = useState(null);
  const [loading, setLoading]                     = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) loadPermisos(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) loadPermisos(session.user.id);
      else { setModulosPermitidos(null); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadPermisos = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("user_roles").select("modulos").eq("user_id", userId).maybeSingle();
      if (error) console.error("Error cargando permisos:", error.message);
      setModulosPermitidos(data?.modulos?.length > 0 ? data.modulos : null);
    } catch {
      setModulosPermitidos(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout  = async () => { await supabase.auth.signOut(); };
  const tieneAcceso   = (id) => !modulosPermitidos || modulosPermitidos.includes(id);

  const activos  = MODULOS.filter(m => m.status === "activo");
  const proximos = MODULOS.filter(m => m.status === "proximamente");
  const abiertos = activos.filter(m => tieneAcceso(m.id));

  if (loading) return (
    <div className="loading-page">
      <div className="loading-inner">
        <img src="/ploffshore-blanco.png" alt="PL Offshore" />
        <div className="loading-text">Cargando</div>
      </div>
    </div>
  );

  if (!session) return <LoginPage />;

  return (
    <>
      <header className="topbar">
        <img src="/ploffshore-blanco.png" alt="PL Offshore" className="topbar-logo" />
        <div className="topbar-right">
          <span className="topbar-user">{session.user.email}</span>
          <span className="topbar-sep" />
          <button className="btn btn-on-navy" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </header>

      <div className="page">
        <div className="page-head">
          <div>
            <div className="page-eyebrow">PL Offshore</div>
            <h1 className="page-title">Módulos de gestión</h1>
            <p className="page-lead">
              Cada módulo opera sobre los mismos datos de flota, proyectos y documentación.
              El acceso depende de los permisos de tu cuenta.
            </p>
            <div className="page-rule" />
          </div>
        </div>

        <div className="section-label">
          Activos
          <span className="section-count">{abiertos.length} de {activos.length} habilitados</span>
        </div>
        <div className="mods-grid">
          {activos.map(m => (
            <ModuloCard key={m.id} mod={m} tieneAcceso={tieneAcceso(m.id)} />
          ))}
        </div>

        <div className="section-label" style={{ marginTop: 32 }}>Próximamente</div>
        <div className="mods-grid">
          {proximos.map(m => (
            <ModuloCard key={m.id} mod={m} tieneAcceso={true} />
          ))}
        </div>
      </div>

      <footer className="site-foot">
        <span>PL Offshore · Sistema de gestión · Confidencial</span>
        <span className="powered">Powered by INTEGRA · {new Date().getFullYear()}</span>
      </footer>
    </>
  );
}
