import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/layout/Navbar.jsx";
import { fetchReels } from "../api/api.js";
import DecorativeBackground from "../components/ui/DecorativeBackground.jsx";
import GroundFooter from "../components/ui/GroundFooter.jsx";
import { Play, X, Clapperboard } from "lucide-react";
import { isYouTubeUrl, getYouTubeId, getYouTubeEmbedUrl } from "../utils/youtube.js";

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
                <div key={i} className="bg-white border border-border animate-pulse" style={{ aspectRatio: "16/9" }} />
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
              {videos.map((reel) => {
                const username =
                  reel.user_profile?.username || reel.user_profile?.user?.username || "twimbol";
                return (
                  <button
                    key={reel.post}
                    onClick={() => handleVideoClick(reel)}
                    className="text-left group"
                  >
                    <div className="relative w-full overflow-hidden bg-txt shadow-sm" style={{ aspectRatio: "16/9" }}>
                      {reel.thumbnail_url && (
                        <img
                          src={reel.thumbnail_url}
                          alt={reel.title || "Video"}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/15 group-hover:bg-black/30 transition-colors">
                        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                          <Play size={24} className="text-brand fill-brand ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <p className="text-base font-semibold text-txt mt-3 line-clamp-2 leading-snug min-h-11">
                      {reel.title || "Untitled"}
                    </p>
                    <p className="text-sm text-txt-secondary mt-1">{username}</p>
                  </button>
                );
              })}
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
