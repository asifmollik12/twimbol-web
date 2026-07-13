import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/layout/Navbar.jsx";
import { fetchReels } from "../api/api.js";
import DecorativeBackground from "../components/ui/DecorativeBackground.jsx";
import GroundFooter from "../components/ui/GroundFooter.jsx";
import { X, Clapperboard } from "lucide-react";
import { isYouTubeUrl, getYouTubeId, getYouTubeEmbedUrl, getYouTubeWatchUrl } from "../utils/youtube.js";

function getVideoHref(reel) {
  if (isYouTubeUrl(reel.video_url)) {
    return getYouTubeWatchUrl(getYouTubeId(reel.video_url));
  }
  return `/reel/${reel.post}`;
}

function VideoCard({ reel, onClick }) {
  const navigate = useNavigate();
  const [hovering, setHovering] = useState(false);
  const isYouTube = isYouTubeUrl(reel.video_url);
  const youtubeId = isYouTube ? getYouTubeId(reel.video_url) : null;
  const creatorId = reel.user_profile?.user?.id || reel.created_by;
  const creatorName =
    reel.user_profile?.username || reel.user_profile?.user?.username || null;

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

  return (
    <a
      href={getVideoHref(reel)}
      onClick={handleClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="block text-left group"
    >
      <div className="relative w-full rounded-lg overflow-hidden bg-txt shadow-sm" style={{ aspectRatio: "16/9" }}>
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
      </div>
      <p className="text-base font-semibold text-txt mt-3 line-clamp-2 leading-snug min-h-11">
        {reel.title || "Untitled"}
      </p>
      {creatorName && (
        <span
          onClick={handleCreatorClick}
          className="inline-block text-xs text-txt-secondary mt-1 hover:text-brand hover:underline"
        >
          {creatorName}
        </span>
      )}
    </a>
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

  return (
    <div className="min-h-screen bg-surface" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <DecorativeBackground />
      <div className="relative" style={{ zIndex: 1 }}>
        <NavBar activePage="Home" />

        {/* ── Videos (YouTube-Kids-style grid, every reel) ── */}
        <section className="max-w-6xl mx-auto px-10 py-8">
          <h2 className="text-xl font-bold text-txt mb-4">Videos</h2>
          {videosLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {videos.map((reel) => (
                <VideoCard key={reel.post} reel={reel} onClick={() => handleVideoClick(reel)} />
              ))}
            </div>
          )}
        </section>

        {!videosLoading && <GroundFooter />}
      </div>

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
