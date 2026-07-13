import React, { useState, useEffect, useRef, use } from "react";
import Notification from "../layout/Notification.jsx";
import Menu from "../layout/Menu.jsx";
import { fetchProfile, fetchNotifications, getImageUrl } from "../../api/api.js";
import { onNotifications, startNotificationPolling } from "../../api/notifications.js";
// import useAuthStore from "../../store/authStore.js";

const NAV_LINKS = [
    { label: "Home", href: "/home" },
    { label: "Kids Book", href: "/kids-book" },
    { label: "Reels", href: "/reel" },
    { label: "Learn", href: "/learn" },
    { label: "Game", href: "/game" },
];

/**
 * NavBar – Top navigation bar for Twimbol.
 * Handles active tab highlighting, notification bell with badge,
 * and profile avatar with dropdown menu.
 *
 * Props:
 *   activePage – one of "Home" | "Posts" | "Reels" | "Events"
 */
export default function NavBar({ activePage = "Reels" }) {
    const [notifications, setNotifications] = useState([]);
    const [profile, setProfile] = useState(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const notifRef = useRef(null);
    const menuRef = useRef(null);
    // const {user, setUser} = useAuthStore();

    // Load profile
    useEffect(() => {
        fetchProfile()
            .then((data) => setProfile(Array.isArray(data) ? data[0] : data))
            .catch(() => { });
    }, []);

    // Subscribe to notification polling
    useEffect(() => {
        startNotificationPolling();
        const unsub = onNotifications((notifs) => setNotifications(notifs));
        return unsub;
    }, []);

    const unreadCount = notifications.filter((n) => !n.is_read).length;

    const profilePicUrl =
        profile?.user?.profile_pic ? getImageUrl(profile.user.profile_pic) : null;
    const displayName =
        [profile?.user?.first_name, profile?.user?.last_name]
            .filter(Boolean)
            .join(" ") || profile?.user?.username || "";

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .nav-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 30px;
          transition: color 0.2s, background 0.2s;
        }
        .nav-link:hover { color: #5B2FC9; background: #ede9ff; }
        .nav-link.active {
          background: linear-gradient(135deg, #2D1B69, #5B2FC9);
          color: #fff !important;
          font-weight: 700;
        }
        .icon-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #f5f4fb;
          border: 1.5px solid #e5e0f5;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, border-color 0.2s;
        }
        .icon-btn:hover { background: #ede9ff; border-color: #c4b5fd; transform: scale(1.07); }
      `}</style>

            <nav
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 100,
                    background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(16px)",
                    borderBottom: "1px solid #e5e0f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 32px",
                    height: "64px",
                    fontFamily: "'DM Sans', sans-serif",
                    boxShadow: "0 1px 20px rgba(91,47,201,0.06)",
                }}
            >
                {/* Logo */}
                <a href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>

                        <div className="flex items-center gap-1">
                            <img src="/logo.png" alt="Twimbol Logo" className="w-24" />
                        </div>

                    </div>
                </a>

                {/* Nav links */}
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className={`nav-link ${activePage === link.label ? "active" : ""}`}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Right side: notification + profile */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {/* Notification bell */}
                    <div ref={notifRef} style={{ position: "relative" }}>
                        <button
                            className="icon-btn"
                            onClick={() => {
                                setShowNotifications((v) => !v);
                                setShowMenu(false);
                            }}
                            aria-label="Notifications"
                        >
                            <BellIcon />
                            {unreadCount > 0 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        top: "4px",
                                        right: "4px",
                                        width: "18px",
                                        height: "18px",
                                        background: "#5B2FC9",
                                        borderRadius: "50%",
                                        border: "2px solid #fff",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#fff",
                                        fontSize: "10px",
                                        fontWeight: "700",
                                        lineHeight: 1,
                                    }}
                                >
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <Notification
                                notifications={notifications}
                                onClose={() => setShowNotifications(false)}
                                onUpdate={() => {
                                    fetchNotifications()
                                        .then(setNotifications)
                                        .catch(() => { });
                                }}
                            />
                        )}
                    </div>

                    {/* Profile avatar */}
                    <div ref={menuRef} style={{ position: "relative" }}>
                        <button
                            className="icon-btn"
                            onClick={() => {
                                setShowMenu((v) => !v);
                                setShowNotifications(false);
                            }}
                            style={{ padding: 0, overflow: "hidden" }}
                            aria-label="Profile menu"
                        >
                            {profilePicUrl ? (
                                <img
                                    src={profilePicUrl}
                                    alt={displayName}
                                    style={{
                                        width: "42px",
                                        height: "42px",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                    }}
                                />
                            ) : (
                                <UserIcon />
                            )}
                        </button>

                        {showMenu && (
                            <Menu
                                profile={profile}
                                onClose={() => setShowMenu(false)}
                            />
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
}

function BellIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
    );
}

function UserIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}