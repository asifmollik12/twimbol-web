import React from "react";

// Scattered playful shapes (YouTube Kids-style), positioned in the page
// margins so they never sit under the centered content column.
const SHAPES = [
  { type: "star4", top: "6%", left: "4%", size: 26, color: "#facc15", rotate: -12, delay: 0 },
  { type: "star5", top: "18%", left: "91%", size: 30, color: "#f472b6", rotate: 8, delay: 0.6 },
  { type: "star4", top: "32%", left: "3%", size: 18, color: "#38bdf8", rotate: 20, delay: 1.2 },
  { type: "shooting", top: "10%", left: "80%", size: 40, color: "#f472b6", rotate: -35, delay: 0.3 },
  { type: "star5", top: "48%", left: "95%", size: 22, color: "#facc15", rotate: -15, delay: 1.6 },
  { type: "star4", top: "62%", left: "5%", size: 22, color: "#a78bfa", rotate: 10, delay: 0.9 },
  { type: "shooting", top: "70%", left: "2%", size: 34, color: "#38bdf8", rotate: 25, delay: 2 },
  { type: "star5", top: "80%", left: "92%", size: 26, color: "#5B2FC9", rotate: 30, delay: 1.1 },
  { type: "star4", top: "88%", left: "8%", size: 16, color: "#f472b6", rotate: -20, delay: 1.8 },
  { type: "star4", top: "40%", left: "97%", size: 16, color: "#a78bfa", rotate: 15, delay: 0.4 },
];

function Star4({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 0 C12 6, 12 6, 24 12 C12 12, 12 12, 12 24 C12 12, 12 12, 0 12 C12 6, 12 6, 12 0 Z" />
    </svg>
  );
}

function Star5({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 0l2.9 8.3H24l-7.1 5.2 2.7 8.5L12 17l-7.6 5 2.7-8.5L0 8.3h9.1z" />
    </svg>
  );
}

function Shooting({ size, color }) {
  return (
    <svg width={size * 1.8} height={size} viewBox="0 0 48 24" fill="none">
      <path d="M2 22 L34 4" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.35" />
      <path d="M18 13 L34 4" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
      <circle cx="34" cy="4" r="3.5" fill={color} />
    </svg>
  );
}

const SHAPE_COMPONENTS = { star4: Star4, star5: Star5, shooting: Shooting };

/**
 * DecorativeBackground – fixed, non-interactive layer of playful scattered
 * shapes rendered in the page margins. Sits behind content (z-0); solid
 * content cards naturally occlude it in the main column.
 */
export default function DecorativeBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes twimbol-float {
          0%, 100% { transform: translateY(0) rotate(var(--r)); }
          50% { transform: translateY(-10px) rotate(calc(var(--r) + 6deg)); }
        }
      `}</style>
      {SHAPES.map((s, i) => {
        const Shape = SHAPE_COMPONENTS[s.type];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: s.top,
              left: s.left,
              opacity: 0.55,
              animation: `twimbol-float ${6 + (i % 4)}s ease-in-out infinite`,
              animationDelay: `${s.delay}s`,
              "--r": `${s.rotate}deg`,
              transform: `rotate(${s.rotate}deg)`,
            }}
          >
            <Shape size={s.size} color={s.color} />
          </div>
        );
      })}
    </div>
  );
}
