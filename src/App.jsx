import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

const ERP_HOME_URL = "https://integra.terra-mare.com.ar";

const MODULOS = [
  {
    id: "compras",
    nombre: "Sistema de Compras",
    descripcion: "Requisiciones, tracker de OC, proveedores y KPIs de compras.",
    icono: "🛒",
    status: "activo",
    url: "https://compras-app-beta.vercel.app",
    color: "#235C96",
    tags: ["Requisiciones", "Proveedores", "KPIs"],
  },
  {
    id: "viveres",
    nombre: "Víveres",
    descripcion: "Pedidos de víveres para embarcaciones con control de dieta nutricional y cálculo USD/cabeza/día.",
    icono: "🍱",
    status: "activo",
    url: "https://viveres-app.vercel.app",
    color: "#1A7A6E",
    tags: ["Embarcaciones", "Catering"],
  },
  {
    id: "projects",
    nombre: "Projects",
    descripcion: "Gestión de proyectos con Diagrama de Gantt, camino crítico y seguimiento de tareas.",
    icono: "📋",
    status: "activo",
    url: "https://projects-app-tm.vercel.app",
    color: "#6B4FA0",
    tags: ["Gantt", "Camino crítico"],
  },
  {
    id: "mantenimiento",
    nombre: "Mantenimiento",
    descripcion: "Mantenimiento preventivo y correctivo de la flota con historial técnico por embarcación.",
    icono: "⚙️",
    status: "activo",
    url: "https://mantenimiento-app-psi.vercel.app",
    color: "#374151",
    tags: ["Preventivo", "Correctivo", "Flota"],
  },
  {
    id: "reparaciones",
    nombre: "Solicitudes de Reparación",
    descripcion: "Gestión de solicitudes de reparación por barco. Panel de control para el superintendente técnico.",
    icono: "🔧",
    status: "activo",
    url: "https://reparaciones-app-mu.vercel.app",
    color: "#B07D0A",
    tags: ["Embarcaciones", "SSRR"],
  },
  {
    id: "certificados",
    nombre: "Certificados",
    descripcion: "Seguimiento de certificados estatutarios y de equipos de la flota. Alertas de vencimientos.",
    icono: "📜",
    status: "activo",
    url: "https://certificados-app-rho.vercel.app",
    color: "#0E7490",
    tags: ["Estatutarios", "Equipos", "Vencimientos"],
  },
  {
    id: "pipeline",
    nombre: "Pipeline de Oportunidades",
    descripcion: "CRM comercial para seguimiento de licitaciones, propuestas y oportunidades de negocio.",
    icono: "📈",
    status: "proximamente",
    url: null,
    color: "#C05621",
    tags: ["Ventas", "Licitaciones"],
  },
  {
    id: "tripulaciones",
    nombre: "Optimizador de Tripulaciones",
    descripcion: "Gestión del personal embarcado, rotaciones, documentación y liquidaciones.",
    icono: "👥",
    status: "proximamente",
    url: null,
    color: "#B07D0A",
    tags: ["RRHH", "Embarcaciones"],
  },
  {
    id: "hsqe",
    nombre: "HSQE",
    descripcion: "Control de certificaciones, vencimientos, inspecciones, incidentes y cumplimiento normativo.",
    icono: "🛡️",
    status: "proximamente",
    url: null,
    color: "#C0392B",
    tags: ["Seguridad", "ISO", "Certificaciones"],
  },
  {
    id: "documentos",
    nombre: "Control Documentario",
    descripcion: "Gestión centralizada de documentación técnica, legal y operativa.",
    icono: "📁",
    status: "proximamente",
    url: null,
    color: "#0E7490",
    tags: ["Documentos", "Compliance"],
  },
  {
    id: "dashboards",
    nombre: "Dashboards",
    descripcion: "Panel ejecutivo con KPIs consolidados de todos los módulos para toma de decisiones.",
    icono: "📊",
    status: "proximamente",
    url: null,
    color: "#213363",
    tags: ["Reportes", "KPIs"],
  },
];

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --navy:    #0B1629;
  --navy2:   #132040;
  --navy3:   #1a2a5e;
  --gold:    #B8942A;
  --gold2:   #D4AA3A;
  --blue:    #235C96;
  --mid:     #6381A7;
  --light:   #A5B5CC;
  --bg:      #F0F4F8;
  --surface: #FFFFFF;
  --border:  #D6E0ED;
  --text:    #0B1629;
  --muted:   #6381A7;
  --sans:    'Montserrat', sans-serif;
  --mono:    'DM Mono', monospace;
}
body { font-family: var(--sans); background: var(--bg); color: var(--text); min-height: 100vh; }

/* ── HEADER ── */
.header {
  background: var(--navy); padding: 0 40px;
  display: flex; align-items: center; justify-content: space-between;
  height: 60px; position: sticky; top: 0; z-index: 10;
  border-bottom: 1px solid rgba(184,148,42,0.2);
}
.header-brand { display: flex; align-items: center; gap: 14px; }
.header-logo-img {
  width: 32px; height: 32px; border-radius: 50%;
  object-fit: cover; border: 1.5px solid rgba(255,255,255,0.2);
}
.header-divider { width: 1px; height: 24px; background: rgba(184,148,42,0.25); margin: 0 2px; }
.header-main {
  font-size: 13px; font-weight: 800; color: #fff;
  letter-spacing: 2px; text-transform: uppercase;
}
.header-sub {
  font-size: 9px; color: var(--gold); letter-spacing: 1px;
  font-family: var(--mono); margin-top: 1px; text-transform: uppercase;
}
.header-right { display: flex; align-items: center; gap: 14px; }
.header-email { font-size: 10px; font-family: var(--mono); color: rgba(255,255,255,0.35); }
.back-btn {
  background: transparent; border: 1px solid rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.5); font-family: var(--sans); font-size: 10px;
  font-weight: 600; padding: 5px 12px; border-radius: 6px;
  cursor: pointer; transition: all .15s; letter-spacing: .3px;
}
.back-btn:hover { border-color: rgba(255,255,255,0.35); color: #fff; }

/* ── HERO ── */
.hero {
  background: linear-gradient(160deg, var(--navy) 0%, var(--navy2) 60%, var(--navy3) 100%);
  padding: 56px 40px 52px; position: relative; overflow: hidden;
}
.hero::before {
  content: ''; position: absolute;
  bottom: -80px; right: -80px;
  width: 400px; height: 400px; border-radius: 50%;
  background: radial-gradient(circle, rgba(184,148,42,0.07) 0%, transparent 70%);
  pointer-events: none;
}
.hero::after {
  content: ''; position: absolute;
  top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
}
.hero-content { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; }
.hero-eyebrow {
  font-family: var(--mono); font-size: 10px; letter-spacing: 3px;
  color: var(--gold); text-transform: uppercase; margin-bottom: 14px;
}
.hero-title {
  font-size: 42px; font-weight: 900; color: #fff;
  line-height: 1.0; margin-bottom: 6px; letter-spacing: -1.5px;
}
.hero-title span { color: var(--gold); }
.hero-line { width: 48px; height: 3px; background: var(--gold); margin: 18px 0; }
.hero-tagline {
  font-size: 13px; color: rgba(255,255,255,0.45);
  font-style: italic; font-weight: 400; letter-spacing: 0.5px;
  margin-bottom: 28px; max-width: 400px;
}
.hero-stats { display: flex; gap: 40px; }
.hero-stat { display: flex; flex-direction: column; gap: 3px; }
.hero-stat-n {
  font-family: var(--mono); font-size: 28px; font-weight: 700;
  color: #fff; line-height: 1;
}
.hero-stat-l {
  font-size: 9px; color: rgba(255,255,255,0.35);
  letter-spacing: 1.5px; text-transform: uppercase;
}

/* ── CONTENT ── */
.content { max-width: 1200px; margin: 0 auto; padding: 40px 40px 64px; }
.section-label {
  font-family: var(--mono); font-size: 9px; letter-spacing: 2.5px;
  color: var(--muted); text-transform: uppercase; margin-bottom: 20px;
  display: flex; align-items: center; gap: 10px;
}
.section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }

/* ── GRID ── */
.modulos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px; margin-bottom: 40px;
}

/* ── CARD ── */
.modulo-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; overflow: hidden; transition: all .2s;
  display: flex; flex-direction: column;
  box-shadow: 0 1px 4px rgba(11,22,41,0.06);
}
.card-accent-bar {
  height: 3px;
  background: var(--card-color, var(--blue));
  flex-shrink: 0; opacity: 0; transition: opacity .2s;
}
.modulo-card.activo { cursor: pointer; }
.modulo-card.activo:hover {
  border-color: var(--card-color, var(--blue));
  box-shadow: 0 6px 24px rgba(11,22,41,0.12);
  transform: translateY(-3px);
}
.modulo-card.activo:hover .card-accent-bar { opacity: 1; }
.modulo-card.proximamente { opacity: .75; }
.modulo-card.sin-acceso { opacity: .4; cursor: not-allowed; }

.card-inner { padding: 20px; flex: 1; display: flex; flex-direction: column; gap: 12px; }
.card-top { display: flex; align-items: flex-start; justify-content: space-between; }
.card-icono {
  width: 42px; height: 42px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; flex-shrink: 0;
}
.card-badges { display: flex; gap: 6px; align-items: center; }
.badge-activo {
  font-family: var(--mono); font-size: 8px; font-weight: 700;
  padding: 3px 8px; border-radius: 4px;
  background: #D1FAE5; color: #065F46; border: 1px solid #A7F3D0;
  letter-spacing: .5px; text-transform: uppercase;
}
.badge-prox {
  font-family: var(--mono); font-size: 8px; font-weight: 700;
  padding: 3px 8px; border-radius: 4px;
  background: #F3F4F6; color: #6B7280; border: 1px solid #E5E7EB;
  letter-spacing: .5px; text-transform: uppercase;
}
.badge-sin {
  font-family: var(--mono); font-size: 8px; font-weight: 700;
  padding: 3px 8px; border-radius: 4px;
  background: #FEE2E2; color: #991B1B; border: 1px solid #FECACA;
  letter-spacing: .5px; text-transform: uppercase;
}
.card-body { flex: 1; }
.card-nombre { font-size: 14px; font-weight: 700; color: var(--navy); margin-bottom: 6px; line-height: 1.3; }
.card-desc { font-size: 12px; color: var(--muted); line-height: 1.6; }
.card-tags { display: flex; gap: 5px; flex-wrap: wrap; margin-top: 10px; }
.card-tag {
  font-family: var(--mono); font-size: 9px; padding: 2px 7px;
  background: #F0F4F8; border: 1px solid var(--border);
  border-radius: 4px; color: var(--muted);
}
.card-footer {
  padding: 12px 20px; border-top: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
  background: #FAFBFC;
}
.card-link {
  font-size: 11px; font-weight: 700; letter-spacing: .3px;
  text-transform: uppercase;
}
.card-link-disabled { font-size: 11px; font-weight: 500; color: var(--muted); letter-spacing: .3px; }

/* ── FOOTER ── */
.portal-footer {
  border-top: 1px solid rgba(184,148,42,0.2);
  padding: 20px 40px; display: flex; align-items: center;
  justify-content: space-between; background: var(--navy);
}
.footer-left { font-family: var(--mono); font-size: 10px; color: rgba(255,255,255,0.25); }
.footer-right { font-family: var(--mono); font-size: 10px; color: var(--gold); opacity: 0.5; }

/* ── LOADING ── */
.loading {
  min-height: 100vh; display: flex; align-items: center;
  justify-content: center; background: var(--navy);
}
.loading-text {
  font-family: var(--mono); font-size: 10px;
  color: rgba(255,255,255,0.3); letter-spacing: 3px; text-transform: uppercase;
}
`;

// ─── MODULO CARD ─────────────────────────────────────────────────────────────
function ModuloCard({ mod, tieneAcceso }) {
  const isActivo   = mod.status === "activo";
  const puedeAbrir = isActivo && mod.url && tieneAcceso;

  const handleClick = () => { if (puedeAbrir) window.open(mod.url, "_self"); };

  let clase = `modulo-card ${mod.status}`;
  if (isActivo && !tieneAcceso) clase = "modulo-card sin-acceso";

  return (
    <div className={clase} style={{ "--card-color": mod.color }} onClick={handleClick}>
      <div className="card-accent-bar" />
      <div className="card-inner">
        <div className="card-top">
          <div className="card-icono" style={{ background: `${mod.color}18`, border: `1px solid ${mod.color}30` }}>
            {mod.icono}
          </div>
          <div className="card-badges">
            {isActivo && !tieneAcceso
              ? <span className="badge-sin">Sin acceso</span>
              : isActivo
                ? <span className="badge-activo">● Activo</span>
                : <span className="badge-prox">Próximamente</span>
            }
          </div>
        </div>
        <div className="card-body">
          <div className="card-nombre">{mod.nombre}</div>
          <div className="card-desc">{mod.descripcion}</div>
          <div className="card-tags">
            {mod.tags.map(t => <span key={t} className="card-tag">{t}</span>)}
          </div>
        </div>
      </div>
      <div className="card-footer">
        {isActivo && !tieneAcceso
          ? <span className="card-link-disabled">Acceso no autorizado</span>
          : puedeAbrir
            ? <span className="card-link" style={{ color: mod.color }}>Abrir módulo →</span>
            : <span className="card-link-disabled">En desarrollo</span>
        }
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [modulosPermitidos, setModulosPermitidos] = useState(null);
  const [userEmail, setUserEmail]                 = useState("");
  const [loading, setLoading]                     = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUserEmail(session.user.email);
        loadPermisos(session.user.id);
      } else {
        window.location.href = ERP_HOME_URL;
      }
    });
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

  const tieneAcceso = (moduloId) => {
    if (!modulosPermitidos) return true;
    return modulosPermitidos.includes(moduloId);
  };

  const activos  = MODULOS.filter(m => m.status === "activo");
  const proximos = MODULOS.filter(m => m.status === "proximamente");

  if (loading) {
    return (
      <div className="loading">
        <style>{CSS}</style>
        <div className="loading-text">Cargando...</div>
      </div>
    );
  }

  return (
    <>
      <style>{CSS}</style>

      <header className="header">
        <div className="header-brand">
          <img src="/Logo-PL.png" alt="Parana Logística" className="header-logo-img" />
          <div className="header-divider" />
          <div>
            <div className="header-main">Parana Logística</div>
            <div className="header-sub">Portal de gestión</div>
          </div>
        </div>
        <div className="header-right">
          {userEmail && <span className="header-email">{userEmail}</span>}
          <button className="back-btn" onClick={() => window.open(ERP_HOME_URL, "_self")}>
            ← Grupo PL
          </button>
        </div>
      </header>

      <div className="hero">
        <div className="hero-content">
          <div className="hero-eyebrow">Portal de gestión · Parana Logística</div>
          <h1 className="hero-title">
            <span>Parana</span> Logística
          </h1>
          <div className="hero-line" />
          <div className="hero-tagline">We Find the Way, or We Make One.</div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-n">{MODULOS.length}</div>
              <div className="hero-stat-l">Módulos</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-n">{activos.length}</div>
              <div className="hero-stat-l">Activos</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-n">40+</div>
              <div className="hero-stat-l">Años de trayectoria</div>
            </div>
          </div>
        </div>
      </div>

      <div className="content">
        <div className="section-label">Módulos activos</div>
        <div className="modulos-grid">
          {activos.map(mod => (
            <ModuloCard key={mod.id} mod={mod} tieneAcceso={tieneAcceso(mod.id)} />
          ))}
        </div>

        <div className="section-label" style={{ marginTop: 8 }}>Próximamente</div>
        <div className="modulos-grid">
          {proximos.map(mod => (
            <ModuloCard key={mod.id} mod={mod} tieneAcceso={true} />
          ))}
        </div>
      </div>

      <footer className="portal-footer">
        <div className="footer-left">Parana Logística · Sistema de Gestión · Confidencial</div>
        <div className="footer-right">v2.0 — {new Date().getFullYear()}</div>
      </footer>
    </>
  );
}
