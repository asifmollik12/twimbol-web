import { useCallback, useEffect, useState } from "react";
import { Search, CheckCircle, XCircle, ExternalLink } from "lucide-react";

import { fetchApplications, reviewApplication } from "../../api/admin";
import {
  Avatar,
  Badge,
  ConfirmModal,
  EmptyState,
  ErrorState,
  Pager,
  SkeletonRows,
  inputCls,
} from "./components";

const STATUSES = [
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
  { id: "", label: "All" },
];

function ApplicationRow({ app, onApprove, onReject }) {
  const name =
    [app.user?.first_name, app.user?.last_name].filter(Boolean).join(" ") ||
    app.user?.username ||
    "Unknown";

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-black/[0.07] bg-white p-5 sm:flex-row">
      <Avatar src={app.user?.profile_pic} name={name} size={48} />

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-bold text-[var(--color-txt)]">{name}</p>
          <Badge tone={app.status}>{app.status}</Badge>
          {app.reviewer && (
            <span className="text-[11px] text-[var(--color-muted)]">
              Reviewed by @{app.reviewer}
            </span>
          )}
        </div>

        <p className="text-xs text-[var(--color-txt-secondary)]">
          @{app.user?.username}
          {app.user?.email ? ` · ${app.user.email}` : ""}
          {" · Applied "}
          {new Date(app.created_at).toLocaleDateString()}
        </p>

        {/* Application reason / pitch */}
        {app.reason && (
          <div className="rounded-xl bg-[var(--color-surface)] px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-txt-secondary)]">
              Application note
            </p>
            <p className="mt-1 text-sm text-[var(--color-txt)]">{app.reason}</p>
          </div>
        )}

        {/* Social / portfolio links */}
        {app.social_links && app.social_links.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {app.social_links.map((link, i) => (
              <a
                key={i}
                href={link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-white px-2.5 py-1 text-[11px] font-semibold text-[var(--color-brand)] hover:underline"
              >
                <ExternalLink size={10} />
                {new URL(link).hostname.replace("www.", "")}
              </a>
            ))}
          </div>
        )}

        {/* Rejection reason */}
        {app.status === "rejected" && app.rejection_reason && (
          <p className="rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs text-rose-700">
            Rejection reason: {app.rejection_reason}
          </p>
        )}
      </div>

      {app.status === "pending" && (
        <div className="flex flex-shrink-0 items-center gap-2 sm:flex-col sm:justify-center">
          <button
            onClick={() => onApprove(app)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 sm:w-28"
          >
            <CheckCircle size={14} /> Approve
          </button>
          <button
            onClick={() => onReject(app)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 sm:w-28"
          >
            <XCircle size={14} /> Reject
          </button>
        </div>
      )}
    </div>
  );
}

export default function ApplicationsPanel({ onQueueChange }) {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("pending");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [rejectApp, setRejectApp] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await fetchApplications({ page, status, search }));
    } catch (err) {
      setError(err.response?.data?.detail || "Could not load applications.");
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => {
    const t = setTimeout(load, search ? 350 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  const removeOrUpdate = (id, updatedStatus) =>
    setData((d) => ({
      ...d,
      count: Math.max(0, d.count - (status ? 1 : 0)),
      results: status
        ? d.results.filter((a) => a.id !== id)
        : d.results.map((a) => (a.id === id ? { ...a, status: updatedStatus } : a)),
    }));

  const doApprove = async (app) => {
    try {
      await reviewApplication(app.id, "approve");
      removeOrUpdate(app.id, "approved");
      onQueueChange?.();
    } catch (err) {
      setError(err.response?.data?.detail || "Could not approve that application.");
    }
  };

  const doReject = async () => {
    setBusy(true);
    try {
      await reviewApplication(rejectApp.id, "reject", rejectReason);
      removeOrUpdate(rejectApp.id, "rejected");
      setRejectApp(null);
      setRejectReason("");
      onQueueChange?.();
    } catch (err) {
      setError(err.response?.data?.detail || "Could not reject that application.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex gap-1 overflow-x-auto rounded-xl border border-[var(--color-border)] bg-white p-1">
          {STATUSES.map((s) => (
            <button
              key={s.id}
              onClick={() => { setPage(1); setStatus(s.id); }}
              className={`flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                status === s.id
                  ? "bg-[var(--color-brand)] text-white"
                  : "text-[var(--color-txt-secondary)] hover:bg-[var(--color-surface)]"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
          <input
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value); }}
            placeholder="Search by name, username or email…"
            className={`${inputCls} pl-9`}
          />
        </div>
      </div>

      {status === "pending" && (
        <p className="rounded-xl bg-[var(--color-brand-light)] px-4 py-2.5 text-xs text-[var(--color-brand)]">
          Approving an application grants the Creator role immediately.
        </p>
      )}

      {error && <ErrorState error={error} onRetry={load} />}

      {loading ? (
        <SkeletonRows />
      ) : !data?.results?.length ? (
        <EmptyState
          message={status === "pending" ? "No pending applications." : "Nothing here."}
        />
      ) : (
        <div className="space-y-2">
          {data.results.map((a) => (
            <ApplicationRow
              key={a.id}
              app={a}
              onApprove={doApprove}
              onReject={setRejectApp}
            />
          ))}
        </div>
      )}

      <Pager data={data} page={page} onPage={setPage} />

      <ConfirmModal
        open={!!rejectApp}
        title="Reject this application?"
        body={`@${rejectApp?.user?.username} will not get the Creator role. Give them a reason so they understand.`}
        confirmLabel="Reject"
        tone="danger"
        busy={busy}
        onConfirm={doReject}
        onCancel={() => { setRejectApp(null); setRejectReason(""); }}
      >
        <textarea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Reason for rejection (optional)…"
          className={`${inputCls} mb-3 min-h-[70px] resize-y`}
        />
      </ConfirmModal>
    </div>
  );
}
