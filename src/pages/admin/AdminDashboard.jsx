import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  ShieldAlert,
  Flag,
  UserCheck,
  LogOut,
} from "lucide-react";

import { useAuthStore } from "../../store/authStore";
import { fetchOverview } from "../../api/admin";
import Overview from "./Overview";
import UsersPanel from "./UsersPanel";
import ModerationPanel from "./ModerationPanel";
import ReportsPanel from "./ReportsPanel";
import ApplicationsPanel from "./ApplicationsPanel";

const NAV = [
  { id: "overview",     label: "Overview",     icon: <LayoutDashboard size={18} /> },
  { id: "users",        label: "Users",         icon: <Users size={18} /> },
  { id: "moderation",   label: "Moderation",    icon: <ShieldAlert size={18} /> },
  { id: "reports",      label: "Reports",       icon: <Flag size={18} /> },
  { id: "applications", label: "Applications",  icon: <UserCheck size={18} /> },
];

const TITLES = {
  overview:     "Overview",
  users:        "Users & Roles",
  moderation:   "Post Moderation",
  reports:      "Reports",
  applications: "Creator Applications",
};

export default function AdminDashboard() {
  const { user, logout } = useAuthStore();
  const [tab, setTab] = useState("overview");
  const [queues, setQueues] = useState({ pending_posts: 0, pending_reports: 0, pending_applications: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load queue counts for badge numbers in sidebar
  const loadQueues = async () => {
    try {
      const data = await fetchOverview();
      setQueues(data?.queues || {});
    } catch {
      // Non-critical — just won't show badge counts
    }
  };

  useEffect(() => {
    loadQueues();
  }, []);

  const queueCount = {
    overview:     0,
    users:        0,
    moderation:   queues.pending_posts || 0,
    reports:      queues.pending_reports || 0,
    applications: queues.pending_applications || 0,
  };

  const name = user?.user?.first_name || user?.username || "Admin";

  const navigate = (id) => {
    setTab(id);
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-surface)]">
      {/* ── Sidebar overlay on mobile ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-black/[0.07] bg-white transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo / Brand */}
        <div className="flex items-center gap-3 border-b border-black/[0.07] px-5 py-4">
          <img src="/logo-icon.png" alt="Twimbol" className="h-8 w-8 rounded-lg object-contain" />
          <div>
            <p className="text-sm font-bold text-[var(--color-txt)]">Twimbol Admin</p>
            <p className="text-[11px] text-[var(--color-muted)]">Hi, {name}</p>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {NAV.map((item) => {
            const count = queueCount[item.id];
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-[var(--color-brand)] text-white"
                    : "text-[var(--color-txt-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-txt)]"
                }`}
              >
                <span className={active ? "text-white" : "text-[var(--color-muted)]"}>
                  {item.icon}
                </span>
                <span className="flex-1 text-left">{item.label}</span>
                {count > 0 && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      active ? "bg-white/25 text-white" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-black/[0.07] p-3">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-black/[0.07] bg-white/80 px-4 py-3 backdrop-blur-sm lg:px-6">
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--color-border)] text-[var(--color-txt-secondary)] lg:hidden"
            aria-label="Open menu"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect x="2" y="4" width="12" height="1.5" rx="1" />
              <rect x="2" y="7.25" width="12" height="1.5" rx="1" />
              <rect x="2" y="10.5" width="12" height="1.5" rx="1" />
            </svg>
          </button>

          <h1 className="text-base font-bold text-[var(--color-txt)]">{TITLES[tab]}</h1>

          <div className="ml-auto flex items-center gap-2">
            {/* Refresh queue counts when returning from a sub-panel */}
            <button
              onClick={loadQueues}
              title="Refresh counts"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--color-border)] text-[var(--color-txt-secondary)] hover:bg-[var(--color-surface)] transition-colors"
              aria-label="Refresh"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2v6h-6" />
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                <path d="M3 22v-6h6" />
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
              </svg>
            </button>
          </div>
        </header>

        {/* Page body */}
        <main className="flex-1 overflow-y-auto px-4 py-6 lg:px-6">
          {tab === "overview" && (
            <Overview onGoTo={navigate} />
          )}
          {tab === "users" && (
            <UsersPanel />
          )}
          {tab === "moderation" && (
            <ModerationPanel onQueueChange={loadQueues} />
          )}
          {tab === "reports" && (
            <ReportsPanel onQueueChange={loadQueues} />
          )}
          {tab === "applications" && (
            <ApplicationsPanel onQueueChange={loadQueues} />
          )}
        </main>
      </div>
    </div>
  );
}
