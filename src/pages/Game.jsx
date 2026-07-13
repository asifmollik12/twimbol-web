import React, { useState } from "react";
import NavBar from "../components/layout/Navbar";
import GroundFooter from "../components/ui/GroundFooter.jsx";

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
        comingSoon: false,
    },
    {
        id: 2,
        title: "Word Wizard",
        description: "Build vocabulary with fun word challenges.",
        emoji: "📝",
        color: "#8b5cf6",
        bg: "#f5f3ff",
        tag: "Language",
        comingSoon: false,
    },
    {
        id: 3,
        title: "Science Lab",
        description: "Virtual experiments and science trivia.",
        emoji: "🔬",
        color: "#10b981",
        bg: "#ecfdf5",
        tag: "Science",
        comingSoon: true,
    },
    {
        id: 4,
        title: "Coding Adventure",
        description: "Learn coding concepts through fun puzzles.",
        emoji: "💻",
        color: "#f59e0b",
        bg: "#fffbeb",
        tag: "Programming",
        comingSoon: true,
    },
    {
        id: 5,
        title: "Geography Explorer",
        description: "Discover countries, capitals and cultures.",
        emoji: "🌍",
        color: "#ef4444",
        bg: "#fef2f2",
        tag: "Geography",
        comingSoon: true,
    },
    {
        id: 6,
        title: "Art Studio",
        description: "Creative drawing and coloring games.",
        emoji: "🎨",
        color: "#ec4899",
        bg: "#fdf2f8",
        tag: "Arts",
        comingSoon: true,
    },
];

export default function Game() {
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const visible = GAMES.slice(0, visibleCount);

    return (
        <div style={{ minHeight: "100vh", background: "#f8f7fc", fontFamily: "'DM Sans', sans-serif" }}>
            <NavBar activePage="Game" />

            {/* Hero */}
            <div
                style={{
                    background: "linear-gradient(135deg, #1a0a3e 0%, #2D1B69 50%, #3B1F8E 100%)",
                    padding: "48px 32px 40px",
                    textAlign: "center",
                }}
            >
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>🎮</div>
                <h1 style={{ color: "#fff", fontSize: "32px", fontWeight: "800", margin: "0 0 8px" }}>
                    Play & Learn
                </h1>
                <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "15px", margin: 0 }}>
                    Educational games designed to make learning fun for kids
                </p>
            </div>

            <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 16px" }}>

                {/* Featured banner */}
                <div
                    style={{
                        background: "linear-gradient(135deg, #FF6B35, #ff8c5a)",
                        borderRadius: "20px",
                        padding: "28px 32px",
                        marginBottom: "32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "16px",
                    }}
                >
                    <div>
                        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "12px", fontWeight: "700", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "1px" }}>
                            Featured Game
                        </p>
                        <h2 style={{ color: "#fff", fontSize: "22px", fontWeight: "800", margin: "0 0 8px" }}>
                            ➕ Math Quest — Now Live!
                        </h2>
                        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "14px", margin: 0 }}>
                            Challenge yourself with 100+ math puzzles across 5 difficulty levels.
                        </p>
                    </div>
                    <button
                        style={{
                            background: "#fff",
                            color: "#FF6B35",
                            border: "none",
                            padding: "12px 28px",
                            borderRadius: "50px",
                            fontSize: "14px",
                            fontWeight: "800",
                            cursor: "pointer",
                            fontFamily: "'DM Sans', sans-serif",
                        }}
                    >
                        Play Now 🚀
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
                            style={{
                                background: "#fff",
                                borderRadius: "16px",
                                padding: "24px",
                                boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                                position: "relative",
                                transition: "transform 0.2s, box-shadow 0.2s",
                                cursor: game.comingSoon ? "default" : "pointer",
                                opacity: game.comingSoon ? 0.85 : 1,
                            }}
                            onMouseEnter={(e) => {
                                if (!game.comingSoon) {
                                    e.currentTarget.style.transform = "translateY(-4px)";
                                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)";
                            }}
                        >
                            {/* Coming soon badge */}
                            {game.comingSoon && (
                                <span
                                    style={{
                                        position: "absolute",
                                        top: "14px",
                                        right: "14px",
                                        background: "#f3f4f6",
                                        color: "#888",
                                        fontSize: "10px",
                                        fontWeight: "700",
                                        padding: "3px 10px",
                                        borderRadius: "50px",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.5px",
                                    }}
                                >
                                    Coming Soon
                                </span>
                            )}

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
                                }}
                            >
                                {game.emoji}
                            </div>

                            {/* Tag */}
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
                                disabled={game.comingSoon}
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    borderRadius: "10px",
                                    border: "none",
                                    background: game.comingSoon ? "#f3f4f6" : `linear-gradient(135deg, ${game.color}, ${game.color}cc)`,
                                    color: game.comingSoon ? "#aaa" : "#fff",
                                    fontSize: "13px",
                                    fontWeight: "700",
                                    cursor: game.comingSoon ? "not-allowed" : "pointer",
                                    fontFamily: "'DM Sans', sans-serif",
                                    transition: "opacity 0.2s",
                                }}
                            >
                                {game.comingSoon ? "Coming Soon" : "Play Now →"}
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
