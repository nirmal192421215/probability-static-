export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-navy-950 font-display sm:text-3xl">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500 max-w-2xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
    </div>
  );
}

export function KpiCard({ icon: Icon, label, value, hint, delay = 0 }) {
  return (
    <div 
      className="card-interactive animate-fade-up relative overflow-hidden p-5 group" 
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Subtle top gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-500/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans">{label}</p>
          <p className="mt-2 text-2xl font-bold text-navy-950 font-display tracking-tight sm:text-3xl">{value}</p>
          {hint && <p className="mt-1 text-xs text-slate-400 truncate">{hint}</p>}
        </div>
        <div className="shrink-0 rounded-2xl bg-gradient-to-br from-navy-900 via-navy-800 to-accent-600 p-3 text-white shadow-soft shadow-navy-900/10 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-glow">
          <Icon size={20} strokeWidth={2.2} />
        </div>
      </div>
    </div>
  );
}

export function StatCard({ label, value }) {
  return (
    <div className="card p-4 hover:border-slate-300/80 transition-colors">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1.5 text-xl font-bold text-navy-950 font-display">{value}</p>
    </div>
  );
}

export function ChartCard({ title, children, actions }) {
  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-accent-500 animate-pulse" />
          <h3 className="text-sm font-semibold text-navy-900 font-display">{title}</h3>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="h-64">{children}</div>
    </div>
  );
}

export function EmptyState({ title, text }) {
  return (
    <div className="card p-12 text-center text-slate-500">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        ✨
      </div>
      <p className="font-semibold text-navy-900 font-display">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{text}</p>
    </div>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="relative flex h-10 w-10 items-center justify-center">
        <div className="absolute h-10 w-10 animate-ping rounded-full bg-accent-400 opacity-20" />
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-accent-600" />
      </div>
    </div>
  );
}

export function RiskBadge({ level }) {
  const map = {
    LOW: { bg: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20", dot: "bg-emerald-500" },
    MEDIUM: { bg: "bg-amber-500/10 text-amber-700 border-amber-500/20", dot: "bg-amber-500" },
    HIGH: { bg: "bg-rose-500/10 text-rose-700 border-rose-500/20", dot: "bg-rose-500" },
    Critical: { bg: "bg-rose-500/10 text-rose-700 border-rose-500/20", dot: "bg-rose-500" },
    High: { bg: "bg-rose-500/10 text-rose-700 border-rose-500/20", dot: "bg-rose-500" },
    Medium: { bg: "bg-amber-500/10 text-amber-700 border-amber-500/20", dot: "bg-amber-500" },
    Low: { bg: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20", dot: "bg-emerald-500" },
    Excellent: { bg: "bg-indigo-500/10 text-indigo-700 border-indigo-500/20", dot: "bg-indigo-500" },
    Good: { bg: "bg-sky-500/10 text-sky-700 border-sky-500/20", dot: "bg-sky-500" },
    Average: { bg: "bg-slate-500/10 text-slate-700 border-slate-500/20", dot: "bg-slate-400" },
    "At Risk": { bg: "bg-rose-500/10 text-rose-700 border-rose-500/20", dot: "bg-rose-500" },
  };
  
  const style = map[level] || { bg: "bg-slate-100 text-slate-700 border-slate-200", dot: "bg-slate-400" };
  
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${style.bg}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {level}
    </span>
  );
}

export function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-navy-950/60 p-4 backdrop-blur-sm animate-fade-up">
      <div className="card-glass max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-white/95 p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-navy-950 font-display">{title}</h2>
          <button 
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-navy-900" 
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Confirm({ open, text, onConfirm, onClose }) {
  if (!open) return null;
  return (
    <Modal open title="Confirm Action" onClose={onClose}>
      <p className="text-sm text-slate-600 leading-relaxed">{text}</p>
      <div className="mt-6 flex justify-end gap-2.5">
        <button className="btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button className="btn-primary bg-rose-600 hover:bg-rose-700" onClick={onConfirm}>
          Confirm
        </button>
      </div>
    </Modal>
  );
}

export function DataTable({ columns, rows, emptyTitle = "No records", emptyText = "Nothing to display yet." }) {
  if (!rows?.length) return <EmptyState title={emptyTitle} text={emptyText} />;
  return (
    <div className="card overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-3.5">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, i) => (
            <tr 
              key={row.id || row.studentId || i} 
              className="transition-colors hover:bg-slate-50/70"
            >
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-3.5">
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
