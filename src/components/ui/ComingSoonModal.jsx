import React from "react";
import { X } from "lucide-react";

/**
 * ComingSoonModal – playful, kid-friendly "not live yet" popup.
 * Used anywhere a feature (games, courses) isn't launched yet, so
 * clicking never feels like a dead/broken button.
 */
export default function ComingSoonModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 300, background: "rgba(26,10,62,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <style>{`
        @keyframes csmPop { from { transform: scale(0.7) rotate(-4deg); opacity: 0; } to { transform: scale(1) rotate(0deg); opacity: 1; } }
        @keyframes csmBounce { 0%, 100% { transform: translateY(0) rotate(var(--r, 0deg)); } 50% { transform: translateY(-6px) rotate(var(--r, 0deg)); } }
      `}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          background: "#fff",
          borderRadius: "28px",
          padding: "40px 28px 28px",
          maxWidth: "360px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
          border: "4px solid #fff",
          fontFamily: "'DM Sans', sans-serif",
          animation: "csmPop 0.35s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        {/* Sticker accents */}
        <div style={{ position: "absolute", top: "-18px", left: "-12px", fontSize: "34px", animation: "csmBounce 2.2s ease-in-out infinite", "--r": "-15deg" }}>⭐</div>
        <div style={{ position: "absolute", top: "-12px", right: "-14px", fontSize: "30px", animation: "csmBounce 2.6s ease-in-out infinite", "--r": "12deg" }}>🎈</div>
        <div style={{ position: "absolute", bottom: "-12px", left: "14px", fontSize: "26px", animation: "csmBounce 2.4s ease-in-out infinite", "--r": "10deg" }}>🎉</div>

        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute", top: "14px", right: "14px",
            width: "30px", height: "30px", borderRadius: "50%",
            border: "none", background: "#f1f0fa", color: "#5B2FC9",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <X size={16} />
        </button>

        <div style={{ fontSize: "56px", marginBottom: "10px" }}>🚧</div>
        <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#2D1B69", margin: "0 0 8px" }}>
          খুব শীঘ্রই আসছে!
        </h2>
        <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.6", margin: "0 0 24px" }}>
          একটু অপেক্ষা করো বন্ধু! মজার জিনিসগুলো তৈরি হচ্ছে 🎈
        </p>
        <button
          onClick={onClose}
          style={{
            background: "linear-gradient(135deg, #2D1B69, #5B2FC9)",
            color: "#fff",
            border: "none",
            padding: "12px 34px",
            borderRadius: "50px",
            fontSize: "14px",
            fontWeight: "800",
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: "0 4px 16px rgba(91,47,201,0.3)",
          }}
        >
          ঠিক আছে 👍
        </button>
      </div>
    </div>
  );
}
