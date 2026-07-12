import React, { useState, useEffect, useCallback, useRef } from "react";
import NavBar from "../components/layout/Navbar.jsx";
import ReelCard from "../components/reel/ReelCard.jsx";
import { fetchReels, fetchProfile, getImageUrl } from "../api/api.js";
import Spinner from "../components/ui/Spinner.jsx";
import { Clapperboard, BookOpen, Gamepad2, FileText, Flame, ArrowRight } from "lucide-react";

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

/**
 * Home.jsx – Twimbol Reels home page.
 * Displays a responsive masonry-style grid of ReelCards.
 * Supports infinite scroll / load more.
 */
export default function Home() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [profile, setProfile] = useState(null);
  const loaderRef = useRef(null);

  useEffect(() => {
    fetchProfile()
      .then((data) => setProfile(Array.isArray(data) ? data[0] : data))
      .catch(() => {});
  }, []);

  const loadReels = useCallback(async (pageNum = 1) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const data = await fetchReels(pageNum, 10);
      const results = data.results || [];

      setReels((prev) => (pageNum === 1 ? results : [...prev, ...results]));
      setTotalPages(data.total_pages || 1);
      setPage(pageNum);
    } catch (err) {
      setError("Failed to load reels. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadReels(1);
  }, [loadReels]);

  // Infinite scroll with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && page < totalPages && !loadingMore) {
          loadReels(page + 1);
        }
      },
      { threshold: 0.5 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [page, totalPages, loadingMore, loadReels]);

  return (
    <div style={{ minHeight: "100vh", background: "#f5f4fb", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .reels-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 14px;
        }
        @media (max-width: 1200px) { .reels-grid { grid-template-columns: repeat(4, 1fr); } }
        @media (max-width: 900px)  { .reels-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 600px)  { .reels-grid { grid-template-columns: repeat(2, 1fr); } }

        .reel-card-wrapper { animation: fadeUp 0.4s ease both; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .skeleton {
          background: linear-gradient(90deg, #e8e4f5 25%, #f0edfb 50%, #e8e4f5 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 16px;
          aspect-ratio: 9/16;
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .section-title {
          font-size: 20px;
          font-weight: 800;
          color: #1a1a2e;
          letter-spacing: -0.3px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .section-badge {
          background: linear-gradient(135deg, #2D1B69, #5B2FC9);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 10px;
          border-radius: 20px;
          letter-spacing: 0.3px;
        }
        .view-all-btn {
          font-size: 13px;
          font-weight: 600;
          color: #5B2FC9;
          background: #ede9ff;
          border: none;
          padding: 6px 16px;
          border-radius: 20px;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .view-all-btn:hover { background: #ddd6fe; }

        .load-more-btn {
          background: linear-gradient(135deg, #2D1B69, #5B2FC9);
          color: #fff;
          border: none;
          border-radius: 30px;
          padding: 12px 36px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(91,47,201,0.25);
        }
        .load-more-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(91,47,201,0.35);
        }
        .load-more-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .category-chip {
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }
        .category-chip.active {
          background: linear-gradient(135deg, #2D1B69, #5B2FC9);
          color: #fff;
          box-shadow: 0 4px 12px rgba(91,47,201,0.3);
        }
        .category-chip.inactive {
          background: #fff;
          color: #6b7280;
          border: 1.5px solid #e5e0f5;
        }
        .category-chip.inactive:hover { background: #ede9ff; color: #5B2FC9; border-color: #c4b5fd; }
      `}</style>

      <NavBar activePage="Home" />

      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "28px 24px" }}>

        {/* ── Greeting hero ── */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "20px",
            marginBottom: "24px",
            padding: "32px 36px",
            background: "linear-gradient(135deg, #2D1B69 0%, #5B2FC9 100%)",
            boxShadow: "0 8px 32px rgba(91,47,201,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px", minWidth: 0 }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                overflow: "hidden",
                flexShrink: 0,
                border: "2px solid rgba(255,255,255,0.4)",
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: "700",
                fontSize: "22px",
              }}
            >
              {profile?.user?.profile_pic ? (
                <img
                  src={getImageUrl(profile.user.profile_pic)}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                (profile?.user?.first_name || profile?.user?.username || "T")[0].toUpperCase()
              )}
            </div>
            <div style={{ minWidth: 0 }}>
              <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "800", color: "#fff", letterSpacing: "-0.3px" }}>
                {getGreeting()}{profile?.user?.first_name ? `, ${profile.user.first_name}` : ""} 👋
              </h1>
              <p style={{ margin: "4px 0 0", fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>
                Catch up on trending reels and fresh posts from your community.
              </p>
            </div>
          </div>
          <a
            href="/reel"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#fff",
              color: "#5B2FC9",
              fontWeight: "700",
              fontSize: "14px",
              padding: "12px 22px",
              borderRadius: "30px",
              textDecoration: "none",
              flexShrink: 0,
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Explore Reels <ArrowRight size={16} />
          </a>
        </div>

        {/* ── Quick stats bar ── */}
        <div style={{
          display: "flex", gap: "12px", marginBottom: "28px", flexWrap: "wrap"
        }}>
          {[
            { icon: Clapperboard, label: "Reels", value: "Trending now", color: "#5B2FC9", bg: "#ede9ff" },
            { icon: BookOpen, label: "Learn", value: "New courses", color: "#0ea5e9", bg: "#e0f2fe", href: "/learn" },
            { icon: Gamepad2, label: "Game", value: "Play & earn", color: "#10b981", bg: "#d1fae5", href: "/game" },
            { icon: FileText, label: "Posts", value: "Latest posts", color: "#f59e0b", bg: "#fef3c7", href: "/post" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href || "#"}
              style={{
                flex: "1 1 160px",
                background: "#fff",
                borderRadius: "16px",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                textDecoration: "none",
                border: "1.5px solid #e5e0f5",
                boxShadow: "0 2px 8px rgba(91,47,201,0.05)",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(91,47,201,0.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(91,47,201,0.05)"; }}
            >
              <div style={{ width: "44px", height: "44px", background: item.bg, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <item.icon size={22} color={item.color} strokeWidth={2.2} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#1a1a2e" }}>{item.label}</p>
                <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>{item.value}</p>
              </div>
            </a>
          ))}
        </div>

        {/* ── Reels section ── */}
        <div className="section-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h2 className="section-title">
              <Clapperboard size={20} color="#1a1a2e" strokeWidth={2.2} />
              Reels
            </h2>
            <span className="section-badge">
              <Flame size={12} style={{ verticalAlign: "-2px", marginRight: "3px" }} />
              TRENDING
            </span>
          </div>
          <a href="/reel" className="view-all-btn">View all →</a>
        </div>

        {/* Error state */}
        {error && (
          <div style={{ background: "#f0ebff", border: "1px solid #c4b5fd", borderRadius: "12px", padding: "14px 20px", color: "#4a25a8", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "18px" }}>⚠️</span>
            {error}
            <button
              onClick={() => { setError(null); loadReels(1); }}
              style={{ marginLeft: "auto", background: "#5B2FC9", color: "#fff", border: "none", borderRadius: "20px", padding: "6px 16px", cursor: "pointer", fontSize: "13px", fontWeight: "600", fontFamily: "'DM Sans', sans-serif" }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Skeleton */}
        {loading ? (
          <div className="reels-grid">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ animationDelay: `${i * 0.05}s` }} />
            ))}
          </div>
        ) : (
          <>
            {reels.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 20px" }}>
                <div style={{ width: "80px", height: "80px", background: "#ede9ff", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <Clapperboard size={36} color="#5B2FC9" strokeWidth={1.8} />
                </div>
                <p style={{ fontSize: "16px", fontWeight: "600", color: "#1a1a2e" }}>No reels yet</p>
                <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "6px" }}>Check back soon for fresh content!</p>
              </div>
            ) : (
              <div className="reels-grid">
                {reels.map((reel, i) => (
                  <div key={reel.post || i} className="reel-card-wrapper" style={{ animationDelay: `${(i % 10) * 0.05}s` }}>
                    <ReelCard reel={reel} onClick={() => { window.location.href = `/reel/${reel.post}`; }} />
                  </div>
                ))}
              </div>
            )}

            {page < totalPages && (
              <div style={{ display: "flex", justifyContent: "center", padding: "40px 0 20px" }} ref={loaderRef}>
                {loadingMore ? (
                  <Spinner />
                ) : (
                  <button className="load-more-btn" onClick={() => loadReels(page + 1)}>
                    Load more reels
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

