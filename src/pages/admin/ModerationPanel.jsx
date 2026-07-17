import { useCallback, useEffect, useState } from "react";
import { Check, X, Search, Flag, Play } from "lucide-react";

import { fetchAdminPosts, moderatePost } from "../../api/admin";
import {
  Avatar, Badge, ConfirmModal, EmptyState, ErrorState, Pager, SkeletonRows, inputCls,
} from "./components";

const STATUSES = [
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
  { id: "", label: "All" },
];

function PostRow({ post, onApprove, onReject }) {
  const thumb = post.media?.thumbnail_url || post.post_banner;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-black/[0.07] bg-white p-4 sm:flex-row">
      <div className="relative h-24 w-full flex-shrink-0 overflow-hidden rounded-xl bg-[var(--color-surface-2)] sm:w-40">
        {thumb ? (
          <img src={thumb} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[var(--color-brand-light)] to-[var(--color-surface-2)]" />
        )}
        {post.media?.video_url && (
          <a
            href={post.media.video_url}
            target="_blank"
            rel="noreferrer"
            title="Open the video in a new tab"
            className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity hover:opacity-100"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60">
              <Play size={16} fill="white" color="white" />
            </span>
          </a>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-semibold text-[var(--color-txt)]">
            {post.post_title || "Untitled"}
          </p>
          <Badge tone={post.moderation_status}>{post.moderation_status}</Badge>
          <span className="text-[11px] font-medium text-[var(--color-muted)]">{post.post_type}</span>
          {post.reports_count > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700">
              <Flag size={10} /> {post.reports_count}
            </span>
          )}
        </div>

        {post.post_description && (
          <p className="mt-1 line-clamp-2 text-xs text-[var(--color-txt-secondary)]">
            {post.post_description}
          </p>
        )}

        <div className="mt-2 flex items-center gap-2">
          <Avatar src={post.created_by?.profile_pic} name={post.created_by?.username} size={22} />
          <span className="text-xs text-[var(--color-txt-secondary)]">
            @{post.created_by?.username} · {new Date(post.created_at).toLocaleDateString()}
          </span>
        </div>

        {post.moderation_status === "rejected" && post.rejection_reason && (
          <p className="mt-2 rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs text-rose-700">
            Rejected: {post.rejection_reason}
          </p>
        )}
        {post.moderated_by && (
          <p className="mt-1 text-[11px] text-[var(--color-muted)]">
            Reviewed by @{post.moderated_by}
          </p>
        )}
      </div>

      <div className="flex flex-shrink-0 items-center gap-2 sm:flex-col sm:justify-center">
        {post.moderation_status !== "approved" && (
          <button
            onClick={() => onApprove(post)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 sm:w-28"
          >
            <Check size={14} /> Approve
          </button>
        )}
        {post.moderation_status !== "rejected" && (
          <button
            onClick={() => onReject(post)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 sm:w-28"
          >
            <X size={14} /> Reject
          </button>
        )}
      </div>
    </div>
  );
}

export default function ModerationPanel({ onQueueChange }) {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("pending");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reject, setReject] = useState(null);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await fetchAdminPosts({ page, status, search }));
    } catch (err) {
      setError(err.response?.data?.detail || "Could not load posts.");
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => {
    const t = setTimeout(load, search ? 350 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  const settle = (updated) => {
    // While filtering by a status, a decision moves the post out of view.
    setData((d) => ({
      ...d,
      count: Math.max(0, d.count - (status ? 1 : 0)),
      results: status
        ? d.results.filter((p) => p.id !== updated.id)
        : d.results.map((p) => (p.id === updated.id ? updated : p)),
    }));
    onQueueChange?.();
  };

  const doApprove = async (post) => {
    try {
      settle(await moderatePost(post.id, "approve"));
    } catch (err) {
      setError(err.response?.data?.detail || "Could not approve that post.");
    }
  };

  const doReject = async () => {
    setBusy(true);
    try {
      settle(await moderatePost(reject.id, "reject", reason));
      setReject(null);
      setReason("");
    } catch (err) {
      setError(err.response?.data?.detail || "Could not reject that post.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex gap-1 overflow-x-auto rounded-xl border border-[var(--color-border)] bg-white p-1">
          {STATUSES.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setPage(1);
                setStatus(s.id);
              }}
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
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search title, description or creator…"
            className={`${inputCls} pl-9`}
          />
        </div>
      </div>

      {status === "pending" && (
        <p className="rounded-xl bg-[var(--color-brand-light)] px-4 py-2.5 text-xs text-[var(--color-brand)]">
          Nothing here is visible to kids yet. Oldest first, so the longest wait goes first.
        </p>
      )}

      {error && <ErrorState error={error} onRetry={load} />}

      {loading ? (
        <SkeletonRows />
      ) : !data?.results?.length ? (
        <EmptyState message={status === "pending" ? "Queue is clear. Nothing waiting." : "Nothing here."} />
      ) : (
        <div className="space-y-2">
          {data.results.map((p) => (
            <PostRow key={p.id} post={p} onApprove={doApprove} onReject={setReject} />
          ))}
        </div>
      )}

      <Pager data={data} page={page} onPage={setPage} />

      <ConfirmModal
        open={!!reject}
        title="Reject this post?"
        body={`"${reject?.post_title || "Untitled"}" stays hidden from every feed. The creator sees the reason below.`}
        confirmLabel="Reject"
        tone="danger"
        busy={busy}
        onConfirm={doReject}
        onCancel={() => {
          setReject(null);
          setReason("");
        }}
      >
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Why is it being rejected? (optional)"
          className={`${inputCls} min-h-[80px] resize-y`}
        />
      </ConfirmModal>
    </div>
  );
}
