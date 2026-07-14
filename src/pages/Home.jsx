import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/layout/Navbar.jsx";
import DecorativeBackground from "../components/ui/DecorativeBackground.jsx";
import GroundFooter from "../components/ui/GroundFooter.jsx";
import { fetchReels, getImageUrl } from "../api/api.js";
import { Play } from "lucide-react";

// ── Single reel card ──────────────────────────────────────────────────────────
function ReelCard({ reel, onClick }) {
  const avatarSrc = getImageUrl(reel.user_profile?.user?.profile_pic);
  const displayName = reel.user_profile?.user?.first_name
    ? `${reel.user_profile.user.first_name} ${reel.user_profile.user.last_name || ""}`.trim()
    : reel.user_profile?.user?.username || "Creator";

  const fmtCount = (n) => {
    if (!n && n !== 0) return "0";
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
    return String(n);
  };

  return (
    <div className="home-reel-card" onClick={() => onClick(reel.post)}>
      {/* Thumbnail */}
      <div className="home-reel-thumb">
        {reel.thumbnail_url ? (
          <img src={reel.thumbnail_url} alt={reel.title || "reel"} className="home-reel-img" />
        ) : (
          <div className="home-reel-img home-reel-placeholder" />
        )}
        {/* Play icon overlay */}
        <div className="home-reel-play-overlay">
          <div className="home-reel-play-btn">
            <Play size={18} fill="white" color="white" />
          </div>
        </div>
        {/* View count badge */}
        {reel.view_count > 0 && (
          <span className="home-reel-views">{fmtCount(reel.view_count)} views</span>
        )}
      </div>

      {/* Info row */}
      <div className="home-reel-info">
        {avatarSrc ? (
          <img src={avatarSrc} alt={displayName} className="home-reel-avatar" />
        ) : (
          <div className="home-reel-avatar-ph">
            {(displayName[0] || "?").toUpperCase()}
          </div>
        )}
        <div className="home-reel-meta">
          <p className="home-reel-title">{reel.title || "Untitled"}</p>
          <p className="home-reel-creator">{displayName}</p>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="home-reel-card">
      <div className="home-reel-thumb home-skeleton-thumb" />
      <div className="home-reel-info">
        <div className="home-skeleton-avatar" />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          <div className="home-skeleton-line" style={{ width: "75%" }} />
          <div className="home-skeleton-line" style={{ width: "50%", height: 10 }} />
        </div>
      </div>
    </div>
  );
}

// ── Main Home ─────────────────────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate();
  const [reels, setReels] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const loaderRef = useRef(null);

  const loadReels = useCallback(async (pageNum) => {
    try {
      const data = await fetchReels(pageNum, 20);
      const results = data.results || [];
      setHasMore(!!data.next);
      if (pageNum === 1) {
        setReels(results);
      } else {
        setReels((prev) => {
          const seen = new Set(prev.map((r) => r.post));
          return [...prev, ...results.filter((r) => !seen.has(r.post))];
        });
      }
    } catch (err) {
      console.error("Failed to load reels:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadReels(1);
  }, [loadReels]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    if (!loaderRef.current || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && hasMore) {
          setLoadingMore(true);
          const next = page + 1;
          setPage(next);
          loadReels(next);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, page, loadReels]);

  return (
    <>
      <style>{CSS}</style>
      <div className="min-h-screen bg-surface" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <DecorativeBackground />
        <div className="relative" style={{ zIndex: 1 }}>
          <NavBar activePage="Home" />
        </div>

        {/* ── Reels horizontal row ── */}
        <div className="home-grid-wrapper" style={{ position: "relative", zIndex: 2 }}>
          {loading ? (
            <div className="home-row">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : reels.length === 0 ? (
            <div className="home-empty">
              <span>No reels yet 😕</span>
            </div>
          ) : (
            <div className="home-row">
              {reels.map((reel) => (
                <ReelCard
                  key={reel.post}
                  reel={reel}
                  onClick={(id) => navigate(`/reel/${id}`)}
                />
              ))}
            </div>
          )}

          {/* Infinite scroll trigger */}
          {hasMore && <div ref={loaderRef} style={{ height: 40 }} />}

          {loadingMore && (
            <div className="home-loading-more">
              <div className="home-spinner" />
            </div>
          )}
        </div>

        {/* Ground footer at the very bottom */}
        <GroundFooter />
      </div>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700&display=swap');

  .home-grid-wrapper {
    position: relative;
    z-index: 2;
    max-width: 1152px;
    margin: 0 auto;
    padding: 24px 0 100px;
  }

  /* Video grid — 4 columns desktop, 2 on mobile */
  .home-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    padding: 0 20px 16px;
  }

  /* Each card */
  .home-reel-card {
    cursor: pointer;
    border-radius: 12px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 2px 10px rgba(0,0,0,0.07);
    transition: transform 0.18s ease, box-shadow 0.18s ease;
  }
  .home-reel-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.13);
  }

  @media (max-width: 900px) {
    .home-row { grid-template-columns: repeat(3, 1fr); }
  }
  @media (max-width: 600px) {
    .home-row { grid-template-columns: 1fr; gap: 14px; padding: 0 12px 16px; }
  }
  .home-reel-thumb {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    background: #e8e4f8;
    overflow: hidden;
  }
  .home-reel-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .home-reel-placeholder {
    background: linear-gradient(135deg, #c8b9f5 0%, #a78bfa 100%);
  }

  /* Play overlay */
  .home-reel-play-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.18);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
  }
  .home-reel-card:hover .home-reel-play-overlay { opacity: 1; }
  .home-reel-play-btn {
    width: 48px; height: 48px;
    border-radius: 50%;
    background: rgba(0,0,0,0.5);
    display: flex; align-items: center; justify-content: center;
    backdrop-filter: blur(4px);
  }

  /* Views badge */
  .home-reel-views {
    position: absolute;
    bottom: 8px; left: 8px;
    background: rgba(0,0,0,0.55);
    color: #fff;
    font-size: 0.65rem;
    font-weight: 600;
    padding: 3px 7px;
    border-radius: 20px;
    backdrop-filter: blur(4px);
  }

  /* Info row */
  .home-reel-info {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 10px 10px 12px;
  }
  .home-reel-avatar {
    width: 30px; height: 30px;
    border-radius: 50%; object-fit: cover; flex-shrink: 0;
    border: 2px solid #e8e4f8;
  }
  .home-reel-avatar-ph {
    width: 30px; height: 30px; flex-shrink: 0;
    border-radius: 50%;
    background: linear-gradient(135deg, #f7a84a, #e55d3c);
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 0.75rem; color: #fff;
  }
  .home-reel-meta { flex: 1; min-width: 0; }
  .home-reel-title {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem; font-weight: 600;
    color: #2d2456;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    margin: 0 0 2px;
  }
  .home-reel-creator {
    font-size: 0.7rem; color: #9891ad;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    margin: 0;
  }

  /* ── Skeleton ── */
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  .home-skeleton-thumb {
    aspect-ratio: 16 / 9;
    background: linear-gradient(90deg, #ede8f8 25%, #d8d0f0 50%, #ede8f8 75%);
    background-size: 200% 100%;
    animation: shimmer 1.6s ease-in-out infinite;
  }
  .home-skeleton-avatar {
    width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
    background: #ede8f8;
    animation: shimmer 1.6s ease-in-out infinite;
  }
  .home-skeleton-line {
    height: 12px; border-radius: 6px;
    background: linear-gradient(90deg, #ede8f8 25%, #d8d0f0 50%, #ede8f8 75%);
    background-size: 200% 100%;
    animation: shimmer 1.6s ease-in-out infinite;
  }

  /* ── Load more / empty ── */
  .home-empty {
    text-align: center;
    padding: 60px 20px;
    color: #9891ad;
    font-size: 1rem;
  }
  .home-loading-more {
    display: flex; justify-content: center;
    padding: 20px;
  }
  .home-spinner {
    width: 32px; height: 32px;
    border: 3px solid #ede8f8;
    border-top-color: #7c3aed;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;
