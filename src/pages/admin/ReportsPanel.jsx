import { useCallback, useEffect, useState } from "react";
import { Flag, CheckCheck, XCircle } from "lucide-react";

import { fetchReports, reviewReport } from "../../api/admin";
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
  { id: "actioned", label: "Actioned" },
  { id: "dismissed", label: "Dismissed" },
  { id: "", label: "All" },
];

const REASONS = [
  { id: "", label: "All reasons" },
  { id: "spam", label: "Spam" },
  { id: "inappropriate", label: "Inappropriate" },
  { id: "violence", label: "Violence" },
  { id: "harassment", label: "Harassment" },
  { id: "other", label: "Other" },
];

function ReportRow({ report, onAction, onDismiss }) {
  const post = report.post;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-black/[0.07] bg-white p-4 sm:flex-row">
      {/* Post thumbnail */}
      <div className="relative h-16 w-full flex-shrink-0 overflow-hidden rounded-xl bg-[var(--color-surface-2)] sm:w-28">
        {post?.post_banner ? (
          <img src={post.post_banner} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[var(--color-brand-light)] to-[var(--color-surface-2)]" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-semibold text-[var(--color-txt)]">
            {post?.post_title || "Untitled post"}
          </p>
          <Badge tone={report.status}>{report.status}</Badge>
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700">
            <Flag size={10} /> {report.reason}
          </span>
        </div>

        {report.note && (
          <p className="mt-1 line-clamp-2 text-xs text-[var(--color-txt-secondary)]">
            "{report.note}"
          </p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[var(--color-txt-secondary)]">
          <span className="flex items-center gap-1.5">
            <Avatar src={report.reported_by?.profile_pic} name={report.reported_by?.username} size={18} />
            Reported by @{report.reported_by?.username}
          </span>
          <span>·</span>
          <span>{new Date(report.created_at).toLocaleDateString()}</span>
          {report.reviewed_by && (
            <>
              <span>·</span>
              <span>Reviewed by @{report.reviewed_by}</span>
            </>
          )}
        </div>

        {report.admin_note && (
          <p className="mt-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600">
            Admin note: {report.admin_note}
          </p>
        )}
      </div>

      {report.status === "pending" && (
        <div className="flex flex-shrink-0 items-center gap-2 sm:flex-col sm:justify-center">
          <button
            onClick={() => onAction(report)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 sm:w-28"
          >
            <CheckCheck size={14} /> Action
          </button>
          <button
            onClick={() => onDismiss(report)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 sm:w-28"
          >
            <XCircle size={14} /> Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

export default function ReportsPanel({ onQueueChange }) {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("pending");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Action modal state
  const [actionReport, setActionReport] = useState(null);
  const [rejectPost, setRejectPost] = useState(false);
  const [adminNote, setAdminNote] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await fetchReports({ page, status, reason }));
    } catch (err) {
      setError(err.response?.data?.detail || "Could not load reports.");
    } finally {
      setLoading(false);
    }
  }, [page, status, reason]);

  useEffect(() => {
    load();
  }, [load]);

  const removeReport = (id) =>
    setData((d) => ({
      ...d,
      count: Math.max(0, d.count - (status ? 1 : 0)),
      results: status
        ? d.results.filter((r) => r.id !== id)
        : d.results.map((r) => (r.id === id ? { ...r, status: "actioned" } : r)),
    }));

  const doAction = async () => {
    setBusy(true);
    try {
      await reviewReport(actionReport.id, "action", {
        note: adminNote,
        reject_post: rejectPost,
      });
      removeReport(actionReport.id);
      setActionReport(null);
      setAdminNote("");
      setRejectPost(false);
      onQueueChange?.();
    } catch (err) {
      setError(err.response?.data?.detail || "Could not action that report.");
    } finally {
      setBusy(false);
    }
  };

  const doDismiss = async (report) => {
    try {
      await reviewReport(report.id, "dismiss");
      setData((d) => ({
        ...d,
        results: status
          ? d.results.filter((r) => r.id !== report.id)
          : d.results.map((r) => (r.id === report.id ? { ...r, status: "dismissed" } : r)),
      }));
      onQueueChange?.();
    } catch (err) {
      setError(err.response?.data?.detail || "Could not dismiss that report.");
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

        <select
          value={reason}
          onChange={(e) => { setPage(1); setReason(e.target.value); }}
          className="rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--color-txt)]"
        >
          {REASONS.map((r) => (
            <option key={r.id} value={r.id}>{r.label}</option>
          ))}
        </select>
      </div>

      {error && <ErrorState error={error} onRetry={load} />}

      {loading ? (
        <SkeletonRows />
      ) : !data?.results?.length ? (
        <EmptyState message={status === "pending" ? "No open reports. All clear." : "Nothing here."} />
      ) : (
        <div className="space-y-2">
          {data.results.map((r) => (
            <ReportRow
              key={r.id}
              report={r}
              onAction={setActionReport}
              onDismiss={doDismiss}
            />
          ))}
        </div>
      )}

      <Pager data={data} page={page} onPage={setPage} />

      {/* Action confirm modal */}
      <ConfirmModal
        open={!!actionReport}
        title="Action this report?"
        body={`Mark as actioned for "${actionReport?.post?.post_title || "this post"}".`}
        confirmLabel="Action"
        tone="danger"
        busy={busy}
        onConfirm={doAction}
        onCancel={() => { setActionReport(null); setAdminNote(""); setRejectPost(false); }}
      >
        <div className="mb-3 space-y-3">
          <textarea
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            placeholder="Admin note (optional)…"
            className={`${inputCls} min-h-[70px] resize-y`}
          />
          <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-txt)]">
            <input
              type="checkbox"
              checked={rejectPost}
              onChange={(e) => setRejectPost(e.target.checked)}
              className="h-4 w-4 rounded border-[var(--color-border)] accent-[var(--color-brand)]"
            />
            Also reject the post from the feed
          </label>
        </div>
      </ConfirmModal>
    </div>
  );
}
