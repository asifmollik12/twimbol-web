import React from "react";

// Scattered playful icons (clouds, balloon, plane, rocket, notes, sparkles)
// living in the page margins, plus a grassy hill scene along the bottom —
// kept clear of the header row and the centered content column.
const FLOATERS = [
  { emoji: "☁️", top: "60px", left: "5%", size: 42, delay: 0 },
  { emoji: "☁️", top: "84px", left: "84%", size: 34, delay: 1.2 },
  { emoji: "🎈", top: "64px", left: "91%", size: 40, delay: 0.4 },
  { emoji: "✈️", top: "70px", left: "9%", size: 28, delay: 0.8, rotate: -15 },
  { emoji: "🚀", top: "52%", left: "94%", size: 30, delay: 1.6, rotate: 35 },
  { emoji: "🎵", top: "34%", left: "3%", size: 24, delay: 0.6 },
  { emoji: "🎶", top: "44%", left: "96%", size: 22, delay: 1.9 },
];

const STARS = [
  { type: "star4", top: "8%", left: "18%", size: 20, color: "#facc15", rotate: -12, delay: 0 },
  { type: "star5", top: "12%", left: "78%", size: 22, color: "#f472b6", rotate: 8, delay: 0.7 },
  { type: "star4", top: "28%", left: "94%", size: 16, color: "#38bdf8", rotate: 20, delay: 1.3 },
  { type: "star5", top: "22%", left: "2%", size: 18, color: "#a78bfa", rotate: -15, delay: 1.7 },
  { type: "star4", top: "58%", left: "4%", size: 18, color: "#f472b6", rotate: 10, delay: 1.0 },
  { type: "star5", top: "48%", left: "92%", size: 20, color: "#facc15", rotate: 30, delay: 0.3 },
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

const STAR_COMPONENTS = { star4: Star4, star5: Star5 };

/**
 * DecorativeBackground – fixed, non-interactive layer of playful scattered
 * icons (clouds, balloon, plane, rocket, notes, sparkles) in the margins.
 * Sits behind content (z-0); solid content cards naturally occlude it in
 * the main column. The grassy ground scene lives separately in
 * GroundFooter, since it needs to scroll with the page instead of staying
 * pinned to the viewport.
 */
export default function DecorativeBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden hidden md:block"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes twimbol-float {
          0%, 100% { transform: translateY(0) rotate(var(--r, 0deg)); }
          50% { transform: translateY(-10px) rotate(calc(var(--r, 0deg) + 5deg)); }
        }
      `}</style>

      {FLOATERS.map((f, i) => (
        <div
          key={`f-${i}`}
          style={{
            position: "absolute",
            top: f.top,
            left: f.left,
            fontSize: f.size,
            opacity: 0.85,
            lineHeight: 1,
            animation: `twimbol-float ${6 + (i % 4)}s ease-in-out infinite`,
            animationDelay: `${f.delay}s`,
            "--r": `${f.rotate || 0}deg`,
          }}
        >
          {f.emoji}
        </div>
      ))}

      {STARS.map((s, i) => {
        const Shape = STAR_COMPONENTS[s.type];
        return (
          <div
            key={`s-${i}`}
            style={{
              position: "absolute",
              top: s.top,
              left: s.left,
              opacity: 0.6,
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
