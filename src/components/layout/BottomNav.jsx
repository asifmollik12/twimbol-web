import React from "react";
import { Home, BookOpen, Clapperboard, Lightbulb, Gamepad2 } from "lucide-react";
import { useLocation } from "react-router-dom";

const BOTTOM_LINKS = [
  { label: "Home", href: "/home", icon: Home, color: "#5B2FC9" },
  { label: "Kids Feed", href: "/kids-book", icon: BookOpen, color: "#e8620c" },
  { label: "Reels", href: "/reel", icon: Clapperboard, color: "#d6208a" },
  { label: "Learn", href: "/learn", icon: Lightbulb, color: "#0a9b8f" },
  { label: "Game", href: "/game", icon: Gamepad2, color: "#2e9d3f" },
];

export default function BottomNav() {
  const location = useLocation();

  // Don't show on public pages or admin dashboard
  const hiddenRoutes = ["/", "/signup", "/login", "/outgoing", "/child-safety", "/privacy-policy"];
  if (
    hiddenRoutes.some((r) => location.pathname === r || location.pathname.startsWith("/outgoing")) ||
    location.pathname.startsWith("/admin")
  ) {
    return null;
  }

  return (
    <>
      <style>{`
        .bottom-nav {
          display: none;
        }
        @media (max-width: 768px) {
          .bottom-nav {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 200;
            background: rgba(255,255,255,0.97);
            backdrop-filter: blur(16px);
            border-top: 1px solid #e5e0f5;
            box-shadow: 0 -4px 20px rgba(91,47,201,0.08);
            padding: 8px 0 max(8px, env(safe-area-inset-bottom));
            justify-content: space-around;
            align-items: center;
            font-family: 'DM Sans', sans-serif;
          }
          .bottom-nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 3px;
            flex: 1;
            text-decoration: none;
            padding: 4px 0;
            cursor: pointer;
            transition: transform 0.15s;
          }
          .bottom-nav-item:active { transform: scale(0.9); }
          .bottom-nav-icon {
            width: 44px;
            height: 44px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
          }
          .bottom-nav-item.active .bottom-nav-icon {
            background: linear-gradient(135deg, #2D1B69, #5B2FC9);
            box-shadow: 0 4px 12px rgba(91,47,201,0.3);
            transform: translateY(-4px) scale(1.05);
          }
          .bottom-nav-label {
            font-size: 10px;
            font-weight: 600;
            color: #a89fc9;
            transition: color 0.2s;
          }
          .bottom-nav-item.active .bottom-nav-label {
            color: #2D1B69;
            font-weight: 700;
          }
          /* Push page content up so it's not hidden behind bottom nav */
          .has-bottom-nav {
            padding-bottom: 80px;
          }
        }
      `}</style>

      <nav className="bottom-nav">
        {BOTTOM_LINKS.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.href ||
            (link.href === "/reel" && location.pathname.startsWith("/reel"));
          return (
            <a
              key={link.label}
              href={link.href}
              className={`bottom-nav-item ${isActive ? "active" : ""}`}
            >
              <div className="bottom-nav-icon">
                <Icon
                  size={22}
                  color={isActive ? "#fff" : link.color}
                  strokeWidth={2.2}
                />
              </div>
              <span className="bottom-nav-label">{link.label}</span>
            </a>
          );
        })}
      </nav>
    </>
  );
}
