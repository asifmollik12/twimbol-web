import { useEffect, useState } from "react";
import { Users, FileText, Eye, Clock, Flag, UserPlus, Ban, Film } from "lucide-react";

import { fetchOverview } from "../../api/admin";
import { ErrorState, StatCard, fmt } from "./components";

function QueueLink({ label, count, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-2xl border border-black/[0.07] bg-white p-4 text-left transition-colors hover:bg-[var(--color-surface)]"
    >
      <span className="flex items-center gap-3 text-sm font-semibold text-[var(--color-txt)]">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
          {icon}
        </span>
        {label}
      </span>
      <span
        className={`rounded-full px-2.5 py-1 text-xs font-bold ${
          count > 0 ? "bg-amber-100 text-amber-700" : "bg-[var(--color-surface)] text-[var(--color-muted)]"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

export default function Overview({ onGoTo }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setData(await fetchOverview());
    } catch (err) {
      setError(err.response?.data?.detail || "Could not load the overview.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (error) return <ErrorState error={error} onRetry={load} />;

  const roles = data?.users?.by_role || {};

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total users" value={data?.users?.total} icon={<Users size={20} />} loading={loading} />
        <StatCard label="New this week" value={data?.users?.new_7d} icon={<UserPlus size={20} />} loading={loading} tone="emerald" />
        <StatCard label="Live posts" value={data?.posts?.approved} icon={<FileText size={20} />} loading={loading} />
        <StatCard label="Total views" value={data?.content?.total_views} icon={<Eye size={20} />} loading={loading} />
      </div>

      <div>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-[var(--color-txt-secondary)]">
          Needs your attention
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <QueueLink
            label="Posts awaiting review"
            count={data?.queues?.pending_posts ?? 0}
            icon={<Clock size={16} />}
            onClick={() => onGoTo("moderation")}
          />
          <QueueLink
            label="Open reports"
            count={data?.queues?.pending_reports ?? 0}
            icon={<Flag size={16} />}
            onClick={() => onGoTo("reports")}
          />
          <QueueLink
            label="Creator applications"
            count={data?.queues?.pending_applications ?? 0}
            icon={<UserPlus size={16} />}
            onClick={() => onGoTo("applications")}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-black/[0.07] bg-white p-5">
          <h3 className="mb-4 text-sm font-bold text-[var(--color-txt)]">People</h3>
          <dl className="space-y-3 text-sm">
            {[
              ["Admins", roles.admin],
              ["Creators", roles.creator],
              ["Visitors", roles.visitor],
              ["New in 30 days", data?.users?.new_30d],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between">
                <dt className="text-[var(--color-txt-secondary)]">{label}</dt>
                <dd className="font-semibold text-[var(--color-txt)]">{loading ? "—" : fmt(value)}</dd>
              </div>
            ))}
            <div className="flex justify-between border-t border-[var(--color-border)] pt-3">
              <dt className="flex items-center gap-1.5 text-rose-600">
                <Ban size={14} /> Banned
              </dt>
              <dd className="font-semibold text-rose-600">{loading ? "—" : fmt(data?.users?.banned)}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-black/[0.07] bg-white p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-[var(--color-txt)]">
            <Film size={15} /> Content
          </h3>
          <dl className="space-y-3 text-sm">
            {[
              ["Reels", data?.content?.reels],
              ["Videos", data?.content?.videos],
              ["Approved", data?.posts?.approved],
              ["Pending", data?.posts?.pending],
              ["Rejected", data?.posts?.rejected],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between">
                <dt className="text-[var(--color-txt-secondary)]">{label}</dt>
                <dd className="font-semibold text-[var(--color-txt)]">{loading ? "—" : fmt(value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
