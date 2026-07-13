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

  // Reels row (uploaded reels) + Kids Video grid (YouTube-embedded reels)
  const [reelsRow, setReelsRow] = useState([]);
  const [videoGrid, setVideoGrid] = useState([]);
  const [lightboxId, setLightboxId] = useState(null);

  // Reel queue used to interleave (non-YouTube) reels into the post feed —
  // YouTube-hosted reels can't play in the <video> tag ReelFeedCard uses.
  const reelQueueRef = useRef([]);
  const reelPageRef = useRef(1);
  const reelIdsRef = useRef(new Set());
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
          if (!reelIdsRef.current.has(r.post) && !isYouTubeUrl(r.video_url)) {
            reelIdsRef.current.add(r.post);
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

  // Reels row + Kids Video grid (independent small fetch, first page of reels)
  useEffect(() => {
    fetchReels(1, 30)
      .then((data) => {
        const results = data.results || [];
        setReelsRow(results.filter((r) => !isYouTubeUrl(r.video_url)));
        setVideoGrid(results.filter((r) => isYouTubeUrl(r.video_url)));
      })
      .catch(() => {});
  }, []);

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

      <main className="max-w-xl mx-auto px-4 py-6">
        {/* ── Reels row ── */}
        {reelsRow.length > 0 && (
          <div
            className="flex gap-4 overflow-x-auto pb-1 mb-5"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {reelsRow.map((reel) => {
              const username =
                reel.user_profile?.username || reel.user_profile?.user?.username || "Reel";
              return (
                <button
                  key={reel.post}
                  onClick={() => navigate(`/reel/${reel.post}`)}
                  className="flex flex-col items-center gap-1.5 flex-shrink-0 w-16"
                >
                  <div
                    className="w-16 h-16 rounded-full flex-shrink-0"
                    style={{ padding: "2.5px", background: "linear-gradient(135deg, #2D1B69, #5B2FC9, #a855f7)" }}
                  >
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-txt border-2 border-white">
                      {reel.thumbnail_url && (
                        <img
                          src={reel.thumbnail_url}
                          alt={username}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/15">
                        <Play size={14} className="text-white fill-white" />
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-txt truncate w-full text-center">
                    {username}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* ── Kids Videos grid (YouTube-embedded) ── */}
        {videoGrid.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold text-txt mb-2.5">Kids Videos</h2>
            <div className="grid grid-cols-2 gap-3">
              {videoGrid.map((reel) => (
                <button
                  key={reel.post}
                  onClick={() => setLightboxId(getYouTubeId(reel.video_url))}
                  className="text-left group"
                >
                  <div className="relative w-full rounded-xl overflow-hidden bg-txt" style={{ aspectRatio: "16/9" }}>
                    {reel.thumbnail_url && (
                      <img
                        src={reel.thumbnail_url}
                        alt={reel.title || "Video"}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                        <Play size={16} className="text-brand fill-brand ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-txt mt-1.5 line-clamp-2">
                    {reel.title || "Untitled"}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

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
