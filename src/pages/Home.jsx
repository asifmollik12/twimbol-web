import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/layout/Navbar.jsx";
import { NAV_LINKS } from "../constants/navLinks.js";
import DecorativeBackground from "../components/ui/DecorativeBackground.jsx";
import GroundFooter from "../components/ui/GroundFooter.jsx";

function MobileBottomNav({ activePage }) {
  return (
    <nav
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border flex items-stretch justify-around px-1 pt-1.5"
      style={{ paddingBottom: "calc(6px + env(safe-area-inset-bottom))" }}
    >
      {NAV_LINKS.map((link) => {
        const Icon = link.icon;
        const isActive = activePage === link.label;
        return (
          <a
            key={link.label}
            href={link.href}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-1"
          >
            <Icon size={22} color={isActive ? link.color : "#9891ad"} strokeWidth={2.2} />
            <span
              className="text-[10px] font-semibold"
              style={{ color: isActive ? link.color : "#9891ad" }}
            >
              {link.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}

/**
 * Home.jsx – Twimbol home. YouTube-Kids-style video grid only (no posts):
 * previews every reel (uploaded + YouTube-embedded).
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-surface" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <DecorativeBackground />
      <div className="relative" style={{ zIndex: 1 }}>
        <NavBar activePage="Home" />
        <GroundFooter />
      </div>

      <MobileBottomNav activePage="Home" />
    </div>
  );
}
