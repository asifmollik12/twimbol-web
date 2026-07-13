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

function GroundScene() {
  return (
    <div className="absolute bottom-0 left-0 w-full" style={{ height: "150px" }}>
      {/* Rolling hill */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        style={{ height: "140px" }}
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
      >
        <path
          d="M0,120 C200,90 400,140 600,110 C800,80 1000,130 1200,100 C1300,90 1400,110 1440,100 L1440,200 L0,200 Z"
          fill="#bbf0c6"
        />
        <path
          d="M0,150 C200,170 400,140 600,165 C800,190 1000,150 1200,175 C1300,185 1400,165 1440,170 L1440,200 L0,200 Z"
          fill="#7fd858"
        />
      </svg>

      {/* Tree, bottom-left */}
      <svg
        className="absolute"
        style={{ bottom: "58px", left: "3%" }}
        width="72"
        height="90"
        viewBox="0 0 72 90"
      >
        <rect x="31" y="46" width="10" height="40" rx="2" fill="#8b5a2b" />
        <circle cx="24" cy="34" r="20" fill="#66bb6a" />
        <circle cx="48" cy="34" r="18" fill="#4caf50" />
        <circle cx="36" cy="18" r="20" fill="#5cb860" />
      </svg>

      {/* Flowers near the tree */}
      <svg className="absolute" style={{ bottom: "50px", left: "12%" }} width="24" height="30" viewBox="0 0 24 30">
        <rect x="10" y="14" width="3" height="16" fill="#4caf50" />
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx="11.5" cy="8" rx="4" ry="6" fill="#ef4444" transform={`rotate(${a} 11.5 8)`} />
        ))}
        <circle cx="11.5" cy="8" r="3" fill="#facc15" />
      </svg>
      <svg className="absolute" style={{ bottom: "48px", left: "17%" }} width="20" height="26" viewBox="0 0 20 26">
        <rect x="8" y="12" width="3" height="14" fill="#4caf50" />
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx="9.5" cy="7" rx="3.4" ry="5" fill="#a78bfa" transform={`rotate(${a} 9.5 7)`} />
        ))}
        <circle cx="9.5" cy="7" r="2.5" fill="#facc15" />
      </svg>

      {/* Small bushes for texture */}
      <svg className="absolute" style={{ bottom: "44px", left: "35%" }} width="40" height="20" viewBox="0 0 40 20">
        <ellipse cx="10" cy="14" rx="10" ry="8" fill="#5cb860" />
        <ellipse cx="24" cy="12" rx="12" ry="9" fill="#4caf50" />
      </svg>
      <svg className="absolute" style={{ bottom: "40px", left: "78%" }} width="34" height="18" viewBox="0 0 34 18">
        <ellipse cx="9" cy="12" rx="9" ry="7" fill="#66bb6a" />
        <ellipse cx="21" cy="10" rx="10" ry="8" fill="#4caf50" />
      </svg>
    </div>
  );
}

/**
 * DecorativeBackground – fixed, non-interactive layer with a grassy ground
 * scene along the bottom and playful scattered icons (clouds, balloon,
 * plane, rocket, notes, sparkles) in the margins. Sits behind content (z-0);
 * solid content cards naturally occlude it in the main column.
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
          0%, 100% { transform: translateY(0) rotate(var(--r, 0deg)); }
          50% { transform: translateY(-10px) rotate(calc(var(--r, 0deg) + 5deg)); }
        }
      `}</style>

      <GroundScene />

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
