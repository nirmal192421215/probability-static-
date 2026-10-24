import {
  BarChart3,
  BookOpen,
  ClipboardList,
  FileText,
  Gauge,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  Menu,
  Settings,
  ShieldAlert,
  Sparkles,
  User,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ── Each role sees a tailored set of pages ─────────────────────────────
const adminLinks = [
  { to: "/app/dashboard",       label: "Dashboard",      icon: LayoutDashboard },
  { to: "/app/students",        label: "Students",        icon: Users },
  { to: "/app/statistics",      label: "Statistics",      icon: BarChart3 },
  { to: "/app/probability",     label: "Probability",     icon: Gauge },
  { to: "/app/prediction",      label: "Prediction",      icon: ClipboardList },
  { to: "/app/risk",            label: "Risk Analysis",   icon: ShieldAlert },
  { to: "/app/recommendations", label: "Recommendations", icon: Lightbulb },
  { to: "/app/reports",         label: "Reports",         icon: FileText },
  { to: "/app/about",           label: "About",           icon: BookOpen },
];

const facultyLinks = [
  { to: "/app/dashboard",       label: "Dashboard",      icon: LayoutDashboard },
  { to: "/app/students",        label: "Students",        icon: Users },
  { to: "/app/statistics",      label: "Statistics",      icon: BarChart3 },
  { to: "/app/probability",     label: "Probability",     icon: Gauge },
  { to: "/app/prediction",      label: "Prediction",      icon: ClipboardList },
  { to: "/app/risk",            label: "Risk Analysis",   icon: ShieldAlert },
  { to: "/app/recommendations", label: "Recommendations", icon: Lightbulb },
  { to: "/app/reports",         label: "Reports",         icon: FileText },
];

const studentLinks = [
  { to: "/app/dashboard",  label: "My Dashboard", icon: LayoutDashboard },
  { to: "/app/prediction", label: "Prediction",   icon: ClipboardList },
  { to: "/app/about",      label: "About",        icon: BookOpen },
];

function getLinks(role) {
  if (role === "Administrator") return adminLinks;
  if (role === "Faculty")       return facultyLinks;
  return studentLinks;
}

const ROLE_BADGES = {
  Administrator: {
    bg: "bg-blue-500/15 text-blue-300 border-blue-400/30",
    dot: "bg-blue-400",
  },
  Faculty: {
    bg: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
    dot: "bg-emerald-400",
  },
  Student: {
    bg: "bg-amber-500/15 text-amber-300 border-amber-400/30",
    dot: "bg-amber-400",
  },
};

function crumb(pathname) {
  const map = {
    dashboard: "Dashboard",
    students: "Students",
    statistics: "Statistics",
    probability: "Probability",
    prediction: "Prediction",
    risk: "Risk Analysis",
    recommendations: "Recommendations",
    reports: "Reports",
    about: "About",
    settings: "Settings",
    profile: "Profile",
  };
  const parts = pathname.split("/").filter(Boolean).slice(1);
  return ["Home", ...parts.map((p) => map[p] || p)];
}

export default function AppShell() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const nav = useNavigate();
  const crumbs = crumb(loc.pathname);

  const links = getLinks(user?.role);
  const roleBadge = ROLE_BADGES[user?.role] || {
    bg: "bg-slate-500/15 text-slate-300 border-slate-400/30",
    dot: "bg-slate-400",
  };
  const mobileLinks = links.slice(0, 4);

  return (
    <div className="min-h-screen bg-surface">
      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white border-r border-white/5 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          open ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-accent-600 to-cyan-400 shadow-glow">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <p className="font-bold tracking-tight text-white font-display text-lg">EduWise</p>
              <p className="text-[11px] font-medium text-cyan-400/90 tracking-wide uppercase">AI Intelligence</p>
            </div>
          </div>
          <button 
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 lg:hidden" 
            onClick={() => setOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* User Role Card */}
        <div className="mx-4 my-4 flex items-center gap-3 rounded-2xl bg-white/[0.04] p-3 border border-white/[0.06] backdrop-blur-md">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-navy-800 to-accent-600/40 border border-white/10 text-white">
            <User size={16} />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-navy-950" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">{user?.name}</p>
            <div className={`mt-0.5 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${roleBadge.bg}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${roleBadge.dot}`} />
              {user?.role}
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="space-y-1.5 px-3 py-2">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-accent-600/20 text-white border border-accent-500/30 shadow-glow"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <l.icon 
                    size={18} 
                    className={`transition-colors ${isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-200"}`} 
                  />
                  <span>{l.label}</span>
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-glowCyan" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sign-out button pinned at bottom */}
        <div className="absolute bottom-5 left-0 right-0 px-4 border-t border-white/5 pt-4">
          <button
            onClick={() => { logout(); nav("/"); }}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      {open && (
        <div 
          className="fixed inset-0 z-30 bg-navy-950/60 backdrop-blur-sm transition-opacity lg:hidden" 
          onClick={() => setOpen(false)} 
        />
      )}

      {/* ── Main viewport wrapper ── */}
      <div className="lg:pl-64">
        {/* Top Sticky Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/80 px-6 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button 
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-soft hover:bg-slate-50 lg:hidden" 
              onClick={() => setOpen(true)}
            >
              <Menu size={18} />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              {crumbs.map((c, i) => (
                <span key={i} className="flex items-center gap-2">
                  {i > 0 && <span>/</span>}
                  <span className={i === crumbs.length - 1 ? "font-semibold text-navy-950" : ""}>{c}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-soft transition-colors hover:bg-slate-50 hover:text-navy-950"
              onClick={() => nav("/app/settings")}
              title="Settings"
            >
              <Settings size={18} />
            </button>

            <div className="hidden text-right md:block">
              <p className="text-sm font-semibold text-navy-950">{user?.name}</p>
              <p className="text-xs text-slate-400">{user?.role}</p>
            </div>

            <button
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-soft transition-colors hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600"
              onClick={() => { logout(); nav("/"); }}
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 pb-28 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>

      {/* ── Mobile bottom nav ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 grid border-t border-slate-200 bg-white/95 backdrop-blur-lg lg:hidden shadow-lg"
        style={{ gridTemplateColumns: `repeat(${mobileLinks.length}, 1fr)` }}
      >
        {mobileLinks.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                isActive ? "text-accent-600 font-semibold" : "text-slate-500 hover:text-slate-900"
              }`
            }
          >
            <l.icon size={18} />
            {l.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
