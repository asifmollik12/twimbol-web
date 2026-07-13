import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/layout/Navbar.jsx";
import PostCard from "../components/post/PostCard.jsx";
import ReelFeedCard from "../components/reel/ReelFeedCard.jsx";
import { fetchReels } from "../api/api.js";
import { getPosts } from "../api/posts.js";
import Spinner from "../components/ui/Spinner.jsx";
import DecorativeBackground from "../components/ui/DecorativeBackground.jsx";
import GroundFooter from "../components/ui/GroundFooter.jsx";
import { Newspaper, Play, X } from "lucide-react";
import { isYouTubeUrl, getYouTubeId, getYouTubeEmbedUrl } from "../utils/youtube.js";

// Insert a reel into the feed after every REEL_INTERVAL posts.
const REEL_INTERVAL = 3;
// Auto-load only the first 2 pages (~20 posts) via scroll; after that the
// user must tap "See More" to keep going.
const AUTO_LOAD_PAGES = 2;

/**
 * Home.jsx – Twimbol news feed.
 * Facebook-style vertical feed mixing posts and reels. Supports infinite
 * scroll / load more.
 */
export default function Home() {
  const navigate = useNavigate();
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const loaderRef = useRef(null);

  // YouTube-Kids-style video grid: previews every reel (uploaded + YouTube-embedded)
  const [videos, setVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [lightboxId, setLightboxId] = useState(null);

  // Reel queue used to interleave reels into the post feed. Shares
  // usedReelIdsRef with the video grid fetch so the same reel doesn't show
  // twice; YouTube-hosted reels are skipped since ReelFeedCard's <video>
  // tag can't play them.
  const usedReelIdsRef = useRef(new Set());
  const reelQueueRef = useRef([]);
  const reelPageRef = useRef(1);
  const reelsExhaustedRef = useRef(false);

  const ensureReelQueue = useCallback(async (minCount) => {
    while (reelQueueRef.current.length < minCount && !reelsExhaustedRef.current) {
      try {
        const data = await fetchReels(reelPageRef.current, 15);
        const results = data.results || [];
        reelPageRef.current += 1;
        if (results.length === 0) {
          reelsExhaustedRef.current = true;
          break;
        }
        results.forEach((r) => {
          if (!usedReelIdsRef.current.has(r.post) && !isYouTubeUrl(r.video_url)) {
            usedReelIdsRef.current.add(r.post);
            reelQueueRef.current.push(r);
          }
        });
        if (data.total_pages && reelPageRef.current > data.total_pages) {
          reelsExhaustedRef.current = true;
        }
      } catch {
        reelsExhaustedRef.current = true;
      }
    }
  }, []);

  // Video grid (independent fetch, first pages of reels) — every reel is
  // shown here as a YouTube-Kids-style preview card.
  useEffect(() => {
    fetchReels(1, 30)
      .then((data) => {
        const results = data.results || [];
        results.forEach((r) => usedReelIdsRef.current.add(r.post));
        setVideos(results);
      })
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

  const loadPosts = useCallback(async (pageNum = 1) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const [res] = await Promise.all([
        getPosts({ page: pageNum, page_size: 10 }),
        ensureReelQueue(4),
      ]);
      const data = res.data;
      const newPosts = data.results || [];

      const newItems = [];
      newPosts.forEach((post, idx) => {
        newItems.push({ type: "post", key: `post-${post.id}`, data: post });
        if ((idx + 1) % REEL_INTERVAL === 0) {
          const reel = reelQueueRef.current.shift();
          if (reel) newItems.push({ type: "reel", key: `reel-${reel.post}`, data: reel });
        }
      });

      setFeedItems((prev) => (pageNum === 1 ? newItems : [...prev, ...newItems]));
      setTotalPages(data.total_pages || 1);
      setPage(pageNum);
    } catch (err) {
      setError("Failed to load your feed. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [ensureReelQueue]);

  useEffect(() => {
    loadPosts(1);
  }, [loadPosts]);

  // Infinite scroll with IntersectionObserver -- only auto-loads the first
  // AUTO_LOAD_PAGES pages (~20 posts); after that a manual "See More"
  // button takes over so the feed doesn't scroll forever unprompted.
  useEffect(() => {
    if (page >= AUTO_LOAD_PAGES) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && page < totalPages && !loadingMore) {
          loadPosts(page + 1);
        }
      },
      { threshold: 0.5 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [page, totalPages, loadingMore, loadPosts]);

  const handleHidden = (postId) => {
    setFeedItems((prev) => prev.filter((item) => !(item.type === "post" && item.data.id === postId)));
  };

  return (
    <div className="min-h-screen bg-surface" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <DecorativeBackground />
      <div className="relative" style={{ zIndex: 1 }}>
      <NavBar activePage="Home" />

      {/* ── Videos (YouTube-Kids-style grid, every reel) ── */}
      {(videosLoading || videos.length > 0) && (
        <section className="max-w-5xl mx-auto px-4 pt-6 pb-2">
          <h2 className="text-base font-bold text-txt mb-3">Videos</h2>
          {videosLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-xl bg-white border border-border animate-pulse" style={{ aspectRatio: "16/9" }} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {videos.map((reel) => {
                const username =
                  reel.user_profile?.username || reel.user_profile?.user?.username || "twimbol";
                return (
                  <button
                    key={reel.post}
                    onClick={() => handleVideoClick(reel)}
                    className="text-left group"
                  >
                    <div className="relative w-full rounded-xl overflow-hidden bg-txt shadow-sm" style={{ aspectRatio: "16/9" }}>
                      {reel.thumbnail_url && (
                        <img
                          src={reel.thumbnail_url}
                          alt={reel.title || "Video"}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/15 group-hover:bg-black/30 transition-colors">
                        <div className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center">
                          <Play size={18} className="text-brand fill-brand ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-txt mt-2 line-clamp-2 leading-snug">
                      {reel.title || "Untitled"}
                    </p>
                    <p className="text-xs text-txt-secondary mt-0.5">{username}</p>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      )}

      <main className="max-w-xl mx-auto px-4 py-6">
        {/* Error state */}
        {error && (
          <div className="flex items-center gap-3 bg-brand-light border border-brand/20 text-brand-hover rounded-xl px-5 py-3 mb-4 text-sm">
            <span>⚠️</span>
            {error}
            <button
              onClick={() => { setError(null); loadPosts(1); }}
              className="ml-auto bg-brand text-white rounded-full px-4 py-1.5 text-xs font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {/* Feed */}
        {loading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-border h-72 animate-pulse"
              />
            ))}
          </div>
        ) : feedItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-brand-light rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Newspaper size={32} color="#5B2FC9" strokeWidth={1.8} />
            </div>
            <p className="text-base font-semibold text-txt">Your feed is empty</p>
            <p className="text-sm text-txt-secondary mt-1.5">
              Follow creators and check back soon for fresh posts!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {feedItems.map((item) =>
              item.type === "post" ? (
                <PostCard key={item.key} post={item.data} onHidden={handleHidden} />
              ) : (
                <ReelFeedCard key={item.key} reel={item.data} />
              )
            )}
          </div>
        )}

        {page < totalPages && page < AUTO_LOAD_PAGES && (
          <div className="flex justify-center py-8" ref={loaderRef}>
            {loadingMore && <Spinner />}
          </div>
        )}

        {page < totalPages && page >= AUTO_LOAD_PAGES && (
          <div className="flex justify-center py-8">
            <button
              onClick={() => loadPosts(page + 1)}
              disabled={loadingMore}
              className="text-white font-bold text-sm rounded-full px-8 py-3 disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg, #2D1B69, #5B2FC9)",
                boxShadow: "0 4px 16px rgba(91,47,201,0.3)",
              }}
            >
              {loadingMore ? <Spinner /> : "See More"}
            </button>
          </div>
        )}
      </main>
      {!loading && <GroundFooter />}
      </div>

      {/* ── Kids Video lightbox ── */}
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
                title="Kids video"
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
