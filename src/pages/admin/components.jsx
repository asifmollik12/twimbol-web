import { AlertTriangle, Inbox } from "lucide-react";

export const fmt = (n) => {
  if (n === null || n === undefined) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
};

export const inputCls =
  "w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm text-[var(--color-txt)] outline-none transition-colors focus:border-[var(--color-brand)]";

export function StatCard({ label, value, icon, loading, tone = "brand" }) {
  const tones = {
    brand: "bg-[var(--color-brand-light)] text-[var(--color-brand)]",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-black/[0.07] bg-white p-5">
      <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
        {icon}
      </div>
      <div className="min-w-0">
        {loading ? (
          <>
            <div className="mb-1 h-6 w-16 animate-pulse rounded bg-[var(--color-surface)]" />
            <div className="h-3 w-20 animate-pulse rounded bg-[var(--color-surface)]" />
          </>
        ) : (
          <>
            <div className="mb-1 text-2xl font-bold leading-none text-[var(--color-txt)]">
              {fmt(value)}
            </div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-txt-secondary)]">
              {label}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const badgeTones = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
  actioned: "bg-rose-50 text-rose-700 border-rose-200",
  dismissed: "bg-slate-100 text-slate-600 border-slate-200",
  admin: "bg-[var(--color-brand-light)] text-[var(--color-brand)] border-[var(--color-border)]",
  creator: "bg-sky-50 text-sky-700 border-sky-200",
  visitor: "bg-slate-100 text-slate-600 border-slate-200",
  banned: "bg-rose-50 text-rose-700 border-rose-200",
};

export function Badge({ children, tone = "visitor" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
        badgeTones[tone] || badgeTones.visitor
      }`}
    >
      {children}
    </span>
  );
}

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-2xl border border-black/[0.07] bg-white p-1.5">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`flex flex-shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
            active === t.id
              ? "bg-[var(--color-brand)] text-white"
              : "text-[var(--color-txt-secondary)] hover:bg-[var(--color-surface)]"
          }`}
        >
          {t.icon}
          {t.label}
          {t.count > 0 && (
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                active === t.id ? "bg-white/25 text-white" : "bg-amber-100 text-amber-700"
              }`}
            >
              {t.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-black/[0.07] bg-white py-16 text-[var(--color-txt-secondary)]">
      <Inbox size={32} className="text-[var(--color-muted)]" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 py-12 text-rose-700">
      <AlertTriangle size={28} />
      <p className="px-6 text-center text-sm">{error}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function SkeletonRows({ count = 5 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-20 animate-pulse rounded-2xl border border-black/[0.07] bg-white" />
      ))}
    </div>
  );
}

export function Pager({ data, page, onPage }) {
  if (!data || data.total_pages <= 1) return null;
  return (
    <div className="flex items-center justify-between pt-2">
      <button
        disabled={!data.previous}
        onClick={() => onPage(page - 1)}
        className="rounded-xl border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-txt)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>
      <span className="text-xs text-[var(--color-txt-secondary)]">
        Page {data.page} of {data.total_pages} · {data.count} total
      </span>
      <button
        disabled={!data.next}
        onClick={() => onPage(page + 1)}
        className="rounded-xl border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-txt)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}

export function Avatar({ src, name, size = 40 }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{ width: size, height: size }}
        className="flex-shrink-0 rounded-full border-2 border-[var(--color-border)] object-cover"
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size }}
      className="flex flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-accent)] text-sm font-bold text-white"
    >
      {(name?.[0] || "?").toUpperCase()}
    </div>
  );
}

export function ConfirmModal({ open, title, body, confirmLabel, tone = "brand", onConfirm, onCancel, children, busy }) {
  if (!open) return null;
  const confirmCls =
    tone === "danger"
      ? "bg-rose-600 hover:bg-rose-700"
      : "bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)]";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onCancel}>
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-2 text-lg font-bold text-[var(--color-txt)]">{title}</h3>
        {body && <p className="mb-4 text-sm text-[var(--color-txt-secondary)]">{body}</p>}
        {children}
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-txt)]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className={`rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 ${confirmCls}`}
          >
            {busy ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
