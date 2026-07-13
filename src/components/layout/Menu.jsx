import React, { useEffect, useRef } from "react";
import { Pencil, Clapperboard, LayoutDashboard, Settings, LogOut } from "lucide-react";
import { logout, getImageUrl } from "../../api/api.js";

/**
 * Menu.jsx – Profile dropdown card shown when clicking the avatar in NavBar.
 *
 * Props:
 *   profile – data from GET /user/api/profile/ (first item of array)
 *   onClose – called when user dismisses the menu
 */
export default function Menu({ profile, onClose }) {
  const menuRef = useRef(null);

  const user = profile?.user || {};
  const profilePicUrl = user.profile_pic ? getImageUrl(user.profile_pic) : null;
  const displayName =
    [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username || "User";
  const username = user.username || "";
  const userGroup = user.user_group?.[0] || "visitor";

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose?.();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  const menuItems = [
    // { icon: Users, label: "My Profile", href: "/profile" },
    { icon: Pencil, label: "Edit Profile", href: "/profile/edit" },
    // { icon: Bell, label: "Notification Settings", href: "/settings/notifications" },
    // { icon: Lock, label: "Change Password", href: "/settings/password" },
    ...(userGroup === "visitor"
      ? [{ icon: Clapperboard, label: "Apply for Creator", href: "/creator/dashboard" }]
      : []),
    ...(userGroup === "creator" || userGroup === "admin"
      ? [{ icon: LayoutDashboard, label: "Creator Dashboard", href: "/creator/dashboard" }]
      : []),
    // { icon: Users, label: "Parental Controls", href: "/settings/parental" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <div
      ref={menuRef}
      style={{
        position: "absolute",
        top: "calc(100% + 12px)",
        right: 0,
        width: "280px",
        maxWidth: "calc(100vw - 24px)",
        background: "#fff",
        borderRadius: "20px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08)",
        zIndex: 1000,
        overflow: "hidden",
        fontFamily: "'DM Sans', sans-serif",
        animation: "menuSlide 0.2s ease",
      }}
    >
      <style>{`
        @keyframes menuSlide {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .menu-item:hover { background: #f8f8f8; }
        .menu-item { transition: background 0.15s ease; }
      `}</style>

      {/* Profile header */}
      <div
        style={{
          padding: "22px 20px 18px",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          alignItems: "center",
          gap: "14px",
      background: "linear-gradient(135deg, #f0ebff, #fff)",
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            overflow: "hidden",
            flexShrink: 0,
            border: "3px solid #5B2FC9",
            background: "#eee",
          }}
        >
          {profilePicUrl ? (
            <img
              src={profilePicUrl}
              alt={displayName}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <AvatarFallback name={displayName} />
          )}
        </div>

        <div style={{ minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontWeight: "700",
              fontSize: "15px",
              color: "#1a1a1a",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {displayName}
          </p>
          <p
            style={{
              margin: "2px 0 0",
              fontSize: "12px",
              color: "#888",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            @{username}
          </p>
          <span
            style={{
              display: "inline-block",
              marginTop: "5px",
              background:
                userGroup === "admin"
                  ? "#1a1aff"
                  : userGroup === "creator"
                  ? "#5B2FC9"
                  : "#e8e8e8",
              color: userGroup === "visitor" ? "#666" : "#fff",
              fontSize: "10px",
              fontWeight: "700",
              padding: "2px 8px",
              borderRadius: "20px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {userGroup}
          </span>
        </div>
      </div>

      {/* Menu items */}
      <div style={{ padding: "8px 0" }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.href}
              href={item.href}
              className="menu-item"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "11px 20px",
                textDecoration: "none",
                color: "#333",
                fontSize: "14px",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <span style={{ width: "22px", display: "flex", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={18} strokeWidth={2} color="#5B2FC9" />
              </span>
              {item.label}
            </a>
          );
        })}
      </div>

      {/* Logout */}
      <div style={{ padding: "8px 0 12px", borderTop: "1px solid #f0f0f0" }}>
        <button
          onClick={handleLogout}
          className="menu-item"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "11px 20px",
            width: "100%",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#5B2FC9",
            fontSize: "14px",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: "600",
            textAlign: "left",
          }}
        >
          <span style={{ width: "22px", display: "flex", justifyContent: "center", flexShrink: 0 }}>
            <LogOut size={18} strokeWidth={2} color="#5B2FC9" />
          </span>
          Log Out
        </button>
      </div>
    </div>
  );
}

function AvatarFallback({ name }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #2D1B69, #5B2FC9)",
        color: "#fff",
        fontWeight: "700",
        fontSize: "20px",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {(name || "?")[0].toUpperCase()}
    </div>
  );
}