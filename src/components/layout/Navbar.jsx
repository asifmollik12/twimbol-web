import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Home, BookOpen, Clapperboard, Lightbulb, Gamepad2, Search } from "lucide-react";
import Notification from "../layout/Notification.jsx";
import Menu from "../layout/Menu.jsx";
import { fetchProfile, fetchNotifications, getImageUrl } from "../../api/api.js";
import { onNotifications, startNotificationPolling } from "../../api/notifications.js";
// import useAuthStore from "../../store/authStore.js";

const NAV_LINKS = [
    { label: "Home", href: "/home", icon: Home, color: "#5B2FC9", bg: "#ede9ff" },
    { label: "Kids Book", href: "/kids-book", icon: BookOpen, color: "#e8620c", bg: "#fff1e6" },
    { label: "Reels", href: "/reel", icon: Clapperboard, color: "#d6208a", bg: "#fde7f3" },
    { label: "Learn", href: "/learn", icon: Lightbulb, color: "#0a9b8f", bg: "#e3faf7" },
    { label: "Game", href: "/game", icon: Gamepad2, color: "#2e9d3f", bg: "#e9f9ec" },
];

/**
 * NavBar – Top navigation bar for Twimbol.
 * Big playful search bar + colorful icon nav row (kids-app style), plus
 * notification bell and profile avatar.
 *
 * Props:
 *   activePage – one of "Home" | "Kids Book" | "Reels" | "Learn" | "Game"
 */
export default function NavBar({ activePage = "Reels" }) {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [profile, setProfile] = useState(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
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

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        navigate(`/post?search=${encodeURIComponent(searchQuery.trim())}`);
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
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
          flex-shrink: 0;
        }
        .icon-btn:hover { background: #ede9ff; border-color: #c4b5fd; transform: scale(1.07); }

        .fun-search {
          display: flex;
          align-items: center;
          flex: 1;
          max-width: 480px;
          background: #f5f4fb;
          border: 2px solid #e5e0f5;
          border-radius: 999px;
          padding: 4px 4px 4px 20px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .fun-search:focus-within {
          border-color: #5B2FC9;
          box-shadow: 0 0 0 4px rgba(91,47,201,0.12);
        }
        .fun-search input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          color: #2D1B69;
          padding: 10px 0;
        }
        .fun-search input::placeholder { color: #a89fc9; font-weight: 500; }
        .fun-search button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, #2D1B69, #5B2FC9);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: transform 0.15s;
        }
        .fun-search button:hover { transform: scale(1.08); }

        .nav-icon-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
          padding: 6px 10px;
          border-radius: 18px;
          text-decoration: none;
          cursor: pointer;
          transition: transform 0.15s;
        }
        .nav-icon-item:hover { transform: translateY(-2px); }
        .nav-icon-badge {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: box-shadow 0.2s;
        }
        .nav-icon-item.active .nav-icon-badge {
          box-shadow: 0 6px 16px rgba(91,47,201,0.28);
          transform: rotate(-3deg) scale(1.05);
        }
        .nav-icon-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 700;
          color: #8b85a3;
        }
        .nav-icon-item.active .nav-icon-label { color: #2D1B69; }
      `}</style>

            <nav
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 100,
                    background: "rgba(255,255,255,0.97)",
                    backdropFilter: "blur(16px)",
                    borderBottom: "1px solid #e5e0f5",
                    fontFamily: "'DM Sans', sans-serif",
                    boxShadow: "0 1px 20px rgba(91,47,201,0.06)",
                }}
            >
                {/* Row 1 — logo, big fun search bar, notif + profile */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "16px",
                        padding: "12px 32px",
                    }}
                >
                    {/* Logo */}
                    <a href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
                        <div className="flex items-center gap-1">
                            <img src="/logo.png" alt="Twimbol Logo" className="w-24" />
                        </div>
                    </a>

                    {/* Big playful search bar */}
                    <form onSubmit={handleSearch} className="fun-search">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search Twimbol Kids…"
                        />
                        <button type="submit" aria-label="Search">
                            <Search size={17} color="#fff" strokeWidth={2.5} />
                        </button>
                    </form>

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
                </div>

                {/* Row 2 — colorful icon nav row */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "12px",
                        padding: "2px 20px 12px",
                        overflowX: "auto",
                    }}
                >
                    {NAV_LINKS.map((link) => {
                        const Icon = link.icon;
                        const isActive = activePage === link.label;
                        return (
                            <a
                                key={link.label}
                                href={link.href}
                                className={`nav-icon-item ${isActive ? "active" : ""}`}
                            >
                                <div
                                    className="nav-icon-badge"
                                    style={{
                                        background: isActive
                                            ? "linear-gradient(135deg, #2D1B69, #5B2FC9)"
                                            : link.bg,
                                    }}
                                >
                                    <Icon
                                        size={22}
                                        color={isActive ? "#fff" : link.color}
                                        strokeWidth={2.2}
                                    />
                                </div>
                                <span className="nav-icon-label">{link.label}</span>
                            </a>
                        );
                    })}
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
