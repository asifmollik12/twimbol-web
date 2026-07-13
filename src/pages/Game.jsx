import React, { useState } from "react";
import NavBar from "../components/layout/Navbar";
import GroundFooter from "../components/ui/GroundFooter.jsx";
import ComingSoonModal from "../components/ui/ComingSoonModal.jsx";

const PAGE_SIZE = 20;

const GAMES = [
    {
        id: 1,
        title: "Math Quest",
        description: "Solve math puzzles and level up your skills!",
        emoji: "➕",
        color: "#3b82f6",
        bg: "#eff6ff",
        tag: "Math",
    },
    {
        id: 2,
        title: "Word Wizard",
        description: "Build vocabulary with fun word challenges.",
        emoji: "📝",
        color: "#8b5cf6",
        bg: "#f5f3ff",
        tag: "Language",
    },
    {
        id: 3,
        title: "Science Lab",
        description: "Virtual experiments and science trivia.",
        emoji: "🔬",
        color: "#10b981",
        bg: "#ecfdf5",
        tag: "Science",
    },
    {
        id: 4,
        title: "Coding Adventure",
        description: "Learn coding concepts through fun puzzles.",
        emoji: "💻",
        color: "#f59e0b",
        bg: "#fffbeb",
        tag: "Programming",
    },
    {
        id: 5,
        title: "Geography Explorer",
        description: "Discover countries, capitals and cultures.",
        emoji: "🌍",
        color: "#ef4444",
        bg: "#fef2f2",
        tag: "Geography",
    },
    {
        id: 6,
        title: "Art Studio",
        description: "Creative drawing and coloring games.",
        emoji: "🎨",
        color: "#ec4899",
        bg: "#fdf2f8",
        tag: "Arts",
    },
];

export default function Game() {
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [comingSoonOpen, setComingSoonOpen] = useState(false);
    const visible = GAMES.slice(0, visibleCount);

    return (
        <div style={{ minHeight: "100vh", background: "#f8f7fc", fontFamily: "'DM Sans', sans-serif" }}>
            <NavBar activePage="Game" />
            <ComingSoonModal open={comingSoonOpen} onClose={() => setComingSoonOpen(false)} />

            {/* Hero */}
            <div
                style={{
                    position: "relative",
                    overflow: "hidden",
                    background: "linear-gradient(135deg, #1a0a3e 0%, #2D1B69 50%, #3B1F8E 100%)",
                    padding: "52px 32px 44px",
                    textAlign: "center",
                }}
            >
                <div style={{ position: "absolute", top: "-50px", left: "-50px", width: "180px", height: "180px", borderRadius: "50%", border: "2px solid rgba(77,217,232,0.22)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: "-70px", right: "-40px", width: "240px", height: "240px", borderRadius: "50%", border: "1px solid rgba(233,30,140,0.18)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", top: "20%", right: "10%", width: "70px", height: "70px", borderRadius: "50%", background: "rgba(255,215,0,0.1)", pointerEvents: "none" }} />

                <div style={{ position: "relative", zIndex: 1 }}>
                    <div
                        style={{
                            width: "84px", height: "84px", borderRadius: "50%",
                            background: "#fff", border: "4px solid rgba(255,255,255,0.3)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "42px", margin: "0 auto 16px",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
                            transform: "rotate(-6deg)",
                        }}
                    >
                        🎮
                    </div>
                    <h1 style={{ color: "#fff", fontSize: "32px", fontWeight: "800", margin: "0 0 8px", letterSpacing: "-0.5px" }}>
                        Play &amp; Learn
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "15px", margin: 0 }}>
                        Educational games designed to make learning fun for kids
                    </p>
                </div>
            </div>

            <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 16px" }}>

                {/* Featured banner */}
                <div
                    onClick={() => setComingSoonOpen(true)}
                    style={{
                        background: "linear-gradient(135deg, #2D1B69, #5B2FC9)",
                        borderRadius: "20px",
                        padding: "28px 32px",
                        marginBottom: "32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "16px",
                        cursor: "pointer",
                    }}
                >
                    <div>
                        <span
                            style={{
                                display: "inline-block", background: "rgba(255,255,255,0.15)",
                                color: "#FFD700", fontSize: "11px", fontWeight: "800",
                                padding: "3px 12px", borderRadius: "50px", textTransform: "uppercase",
                                letterSpacing: "1px", marginBottom: "10px",
                            }}
                        >
                            ✨ Coming Soon
                        </span>
                        <h2 style={{ color: "#fff", fontSize: "22px", fontWeight: "800", margin: "0 0 8px" }}>
                            ➕ Math Quest
                        </h2>
                        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "14px", margin: 0 }}>
                            Get ready for 100+ math puzzles across 5 difficulty levels!
                        </p>
                    </div>
                    <button
                        style={{
                            background: "#fff",
                            color: "#2D1B69",
                            border: "none",
                            padding: "12px 28px",
                            borderRadius: "50px",
                            fontSize: "14px",
                            fontWeight: "800",
                            cursor: "pointer",
                            fontFamily: "'DM Sans', sans-serif",
                        }}
                    >
                        Notify Me 🔔
                    </button>
                </div>

                {/* Game grid */}
                <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1a1a2e", marginBottom: "20px" }}>
                    All Games
                </h2>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                        gap: "20px",
                    }}
                >
                    {visible.map((game) => (
                        <div
                            key={game.id}
                            onClick={() => setComingSoonOpen(true)}
                            style={{
                                background: "#fff",
                                borderRadius: "16px",
                                padding: "24px",
                                boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                                position: "relative",
                                transition: "transform 0.2s, box-shadow 0.2s",
                                cursor: "pointer",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-4px)";
                                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)";
                            }}
                        >
                            {/* Coming soon sticker badge */}
                            <span
                                style={{
                                    position: "absolute",
                                    top: "12px",
                                    right: "12px",
                                    background: "#fff",
                                    color: "#5B2FC9",
                                    fontSize: "10px",
                                    fontWeight: "800",
                                    padding: "4px 10px",
                                    borderRadius: "50px",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                    border: "2px solid #ede9ff",
                                    boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
                                    transform: "rotate(6deg)",
                                }}
                            >
                                Soon
                            </span>

                            {/* Icon */}
                            <div
                                style={{
                                    width: "56px",
                                    height: "56px",
                                    background: game.bg,
                                    borderRadius: "14px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "26px",
                                    marginBottom: "14px",
                                    border: "3px solid #fff",
                                    boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
                                }}
                            >
                                {game.emoji}
                            </div>

                            {/* Tag — sticker style */}
                            <span
                                style={{
                                    fontSize: "11px",
                                    fontWeight: "700",
                                    color: game.color,
                                    background: game.bg,
                                    padding: "2px 10px",
                                    borderRadius: "50px",
                                    marginBottom: "10px",
                                    display: "inline-block",
                                    border: "2px solid #fff",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                                    transform: "rotate(-2deg)",
                                }}
                            >
                                {game.tag}
                            </span>

                            <h3 style={{ margin: "8px 0 6px", fontSize: "16px", fontWeight: "700", color: "#1a1a2e" }}>
                                {game.title}
                            </h3>
                            <p style={{ margin: "0 0 16px", fontSize: "13px", color: "#666", lineHeight: "1.5" }}>
                                {game.description}
                            </p>

                            <button
                                onClick={(e) => { e.stopPropagation(); setComingSoonOpen(true); }}
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    borderRadius: "10px",
                                    border: "none",
                                    background: "linear-gradient(135deg, #2D1B69, #5B2FC9)",
                                    color: "#fff",
                                    fontSize: "13px",
                                    fontWeight: "700",
                                    cursor: "pointer",
                                    fontFamily: "'DM Sans', sans-serif",
                                    transition: "opacity 0.2s",
                                }}
                            >
                                Coming Soon 🔔
                            </button>
                        </div>
                    ))}
                </div>

                {visibleCount < GAMES.length && (
                    <div style={{ display: "flex", justifyContent: "center", padding: "32px 0 8px" }}>
                        <button
                            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                            style={{
                                background: "linear-gradient(135deg, #2D1B69, #5B2FC9)",
                                color: "#fff",
                                border: "none",
                                borderRadius: "50px",
                                padding: "12px 32px",
                                fontSize: "14px",
                                fontWeight: "700",
                                cursor: "pointer",
                                fontFamily: "'DM Sans', sans-serif",
                                boxShadow: "0 4px 16px rgba(91,47,201,0.3)",
                            }}
                        >
                            See More
                        </button>
                    </div>
                )}
            </div>

            <GroundFooter />
        </div>
    );
}
