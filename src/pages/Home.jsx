import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/layout/Navbar.jsx";
import { NAV_LINKS } from "../constants/navLinks.js";
import { fetchReels, hideReel } from "../api/api.js";
import DecorativeBackground from "../components/ui/DecorativeBackground.jsx";
import GroundFooter from "../components/ui/GroundFooter.jsx";
import { X, Clapperboard, MoreHorizontal, EyeOff } from "lucide-react";
import { isYouTubeUrl, getYouTubeId, getYouTubeEmbedUrl, getYouTubeWatchUrl } from "../utils/youtube.js";

function getVideoHref(reel) {
  if (isYouTubeUrl(reel.video_url)) {
    return getYouTubeWatchUrl(getYouTubeId(reel.video_url));
  }
  return `/reel/${reel.post}`;
}

function VideoCard({ reel, onClick, onHidden }) {
  const navigate = useNavigate();
  const [hovering, setHovering] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuBtnRef = useRef(null);
  const isYouTube = isYouTubeUrl(reel.video_url);
  const youtubeId = isYouTube ? getYouTubeId(reel.video_url) : null;
  const creatorId = reel.user_profile?.user?.id || reel.created_by;
  const creatorName =
    reel.user_profile?.username || reel.user_profile?.user?.username || null;
  const href = getVideoHref(reel);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !menuBtnRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const handleClick = (e) => {
    // Let modifier/middle clicks behave like a normal link (open in new tab, etc.)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) return;
    e.preventDefault();
    onClick();
  };

  const handleCreatorClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (creatorId) navigate(`/profile/${creatorId}`);
  };

  const handleHide = async () => {
    setMenuOpen(false);
    try {
      await hideReel(reel.post);
      onHidden?.(reel.post);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
      <a
        href={href}
        onClick={handleClick}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className="relative block w-full bg-txt group"
        style={{ aspectRatio: "16/9" }}
      >
        {reel.thumbnail_url && (
          <img
            src={reel.thumbnail_url}
            alt={reel.title || "Video"}
            className="w-full h-full object-cover"
          />
        )}
        {hovering && (
          isYouTube ? (
            <iframe
              src={getYouTubeEmbedUrl(youtubeId, { autoplay: true, mute: true, loop: true, controls: false })}
              title={reel.title || "Video preview"}
              className="absolute inset-0 w-full h-full pointer-events-none"
              allow="autoplay; encrypted-media"
            />
          ) : (
            <video
              src={reel.video_url}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              autoPlay
              muted
              loop
              playsInline
            />
          )
        )}
      </a>

      <div className="flex items-start justify-between gap-2 px-3 pt-3">
        <a href={href} onClick={handleClick} className="min-w-0 flex-1 block text-left">
          <p className="text-base font-semibold text-txt line-clamp-2 leading-snug min-h-11">
            {reel.title || "Untitled"}
          </p>
        </a>
        <div className="relative flex-shrink-0">
          <button
            ref={menuBtnRef}
            onClick={() => setMenuOpen((o) => !o)}
            className="p-1.5 -mr-1 rounded-full hover:bg-surface transition-colors text-txt-secondary"
            aria-label="Video options"
          >
            <MoreHorizontal size={18} />
          </button>
          {menuOpen && (
            <div
              ref={menuRef}
              className="absolute right-0 top-8 z-20 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 overflow-hidden"
            >
              <button
                onClick={handleHide}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-txt hover:bg-surface transition-colors text-left"
              >
                <EyeOff size={15} className="flex-shrink-0" />
                Hide from feed
              </button>
            </div>
          )}
        </div>
      </div>

      {creatorName && (
        <div className="px-3 pb-3 pt-0.5">
          <span
            onClick={handleCreatorClick}
            className="inline-block text-xs text-txt-secondary hover:text-brand hover:underline cursor-pointer"
          >
            {creatorName}
          </span>
        </div>
      )}
    </div>
  );
}

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
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [lightboxId, setLightboxId] = useState(null);

  useEffect(() => {
    fetchReels(1, 30)
      .then((data) => setVideos(data.results || []))
      .catch(() => {})
      .finally(() => setVideosLoading(false));
  }, []);

  const handleVideoClick = (reel) => {
    if (isYouTubeUrl(reel.video_url)) {
      setLightboxId(getYouTubeId(reel.video_url));
    } else {
      navigate(`/reel/${reel.post}`);
    }
  };

  const handleHideVideo = (postId) => {
    setVideos((prev) => prev.filter((v) => v.post !== postId));
  };

  return (
    <div className="min-h-screen bg-surface" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <DecorativeBackground />
      <div className="relative" style={{ zIndex: 1 }}>
        <NavBar activePage="Home" />

        {/* ── Videos (YouTube-Kids-style grid, every reel) ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-10 py-5 sm:py-8 pb-24 sm:pb-8">
          <h2 className="text-xl font-bold text-txt mb-4">Videos</h2>
          {videosLoading ? (
            <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-lg bg-white border border-border animate-pulse" style={{ aspectRatio: "16/9" }} />
              ))}
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-brand-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clapperboard size={32} color="#5B2FC9" strokeWidth={1.8} />
              </div>
              <p className="text-base font-semibold text-txt">No videos yet</p>
              <p className="text-sm text-txt-secondary mt-1.5">
                Check back soon for fresh videos!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6">
              {videos.map((reel) => (
                <VideoCard
                  key={reel.post}
                  reel={reel}
                  onClick={() => handleVideoClick(reel)}
                  onHidden={handleHideVideo}
                />
              ))}
            </div>
          )}
        </section>

        {!videosLoading && <GroundFooter />}
      </div>

      <MobileBottomNav activePage="Home" />

      {/* ── Video lightbox ── */}
      {lightboxId && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightboxId(null)}
        >
          <div
            className="relative w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxId(null)}
              className="absolute -top-10 right-0 w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white"
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <div className="w-full rounded-xl overflow-hidden bg-black" style={{ aspectRatio: "16/9" }}>
              <iframe
                src={getYouTubeEmbedUrl(lightboxId, { autoplay: true })}
                title="Video"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
