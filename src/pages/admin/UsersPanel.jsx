import { useCallback, useEffect, useState } from "react";
import { Search, Ban, ShieldCheck } from "lucide-react";

import { fetchUsers, setUserBanned, setUserRole } from "../../api/admin";
import { useAuthStore } from "../../store/authStore";
import {
  Avatar, Badge, ConfirmModal, EmptyState, ErrorState, Pager, SkeletonRows, fmt, inputCls,
} from "./components";

const ROLES = ["visitor", "creator", "admin"];

function UserRow({ user, isSelf, onRole, onBan }) {
  const role = user.user_group?.[0] || "visitor";
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-black/[0.07] bg-white p-4 sm:flex-row sm:items-center">
      <Avatar src={user.profile_pic} name={name} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-semibold text-[var(--color-txt)]">{name}</p>
          <Badge tone={role}>{role}</Badge>
          {user.user_banned && <Badge tone="banned">banned</Badge>}
          {isSelf && <span className="text-[11px] text-[var(--color-muted)]">(you)</span>}
        </div>
        <p className="truncate text-xs text-[var(--color-txt-secondary)]">
          @{user.username}
          {user.email ? ` · ${user.email}` : ""}
        </p>
        <p className="mt-0.5 text-xs text-[var(--color-muted)]">
          {fmt(user.posts_count)} posts · {fmt(user.followers_count)} followers · joined{" "}
          {new Date(user.date_joined).toLocaleDateString()}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <select
          value={role}
          disabled={isSelf}
          onChange={(e) => onRole(user, e.target.value)}
          title={isSelf ? "You can't change your own role" : "Change role"}
          className="rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--color-txt)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <button
          onClick={() => onBan(user)}
          disabled={isSelf}
          title={isSelf ? "You can't ban yourself" : user.user_banned ? "Unban" : "Ban"}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
            user.user_banned
              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              : "bg-rose-50 text-rose-700 hover:bg-rose-100"
          }`}
        >
          {user.user_banned ? <ShieldCheck size={14} /> : <Ban size={14} />}
          {user.user_banned ? "Unban" : "Ban"}
        </button>
      </div>
    </div>
  );
}

export default function UsersPanel() {
  const { user: me } = useAuthStore();
  const myId = me?.user?.id;

  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await fetchUsers({ page, search, role }));
    } catch (err) {
      setError(err.response?.data?.detail || "Could not load users.");
    } finally {
      setLoading(false);
    }
  }, [page, search, role]);

  // Debounced so typing doesn't fire a request per keystroke.
  useEffect(() => {
    const t = setTimeout(load, search ? 350 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  const replaceUser = (updated) =>
    setData((d) => ({ ...d, results: d.results.map((u) => (u.id === updated.id ? updated : u)) }));

  const doRole = async (user, nextRole) => {
    setBusy(true);
    try {
      replaceUser(await setUserRole(user.id, nextRole));
    } catch (err) {
      setError(err.response?.data?.detail || "Could not change the role.");
    } finally {
      setBusy(false);
    }
  };

  const doBan = async () => {
    const user = confirm.user;
    setBusy(true);
    try {
      replaceUser(await setUserBanned(user.id, !user.user_banned));
      setConfirm(null);
    } catch (err) {
      setError(err.response?.data?.detail || "Could not update the ban.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search by name, username or email…"
            className={`${inputCls} pl-9`}
          />
        </div>
        <select
          value={role}
          onChange={(e) => {
            setPage(1);
            setRole(e.target.value);
          }}
          className="rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--color-txt)]"
        >
          <option value="">All roles</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {error && <ErrorState error={error} onRetry={load} />}

      {loading ? (
        <SkeletonRows />
      ) : !data?.results?.length ? (
        <EmptyState message="No users match that." />
      ) : (
        <div className="space-y-2">
          {data.results.map((u) => (
            <UserRow
              key={u.id}
              user={u}
              isSelf={u.id === myId}
              onRole={doRole}
              onBan={(user) => setConfirm({ user })}
            />
          ))}
        </div>
      )}

      <Pager data={data} page={page} onPage={setPage} />

      <ConfirmModal
        open={!!confirm}
        title={confirm?.user?.user_banned ? "Unban this user?" : "Ban this user?"}
        body={
          confirm?.user?.user_banned
            ? `@${confirm?.user?.username} will be able to sign in again.`
            : `@${confirm?.user?.username} will be signed out immediately and blocked from signing in. Their posts stay up — reject those separately if needed.`
        }
        confirmLabel={confirm?.user?.user_banned ? "Unban" : "Ban"}
        tone={confirm?.user?.user_banned ? "brand" : "danger"}
        busy={busy}
        onConfirm={doBan}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
