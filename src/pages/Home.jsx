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
import { Play, Newspaper } from "lucide-react";

// Insert a reel into the feed after every REEL_INTERVAL posts.
const REEL_INTERVAL = 3;

/**
 * Home.jsx – Twimbol news feed.
 * Instagram-style reel "stories" bar up top, Facebook-style vertical
 * feed mixing posts and reels below. Supports infinite scroll / load more.
 */
export default function Home() {
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const loaderRef = useRef(null);

  // Reel queue used to interleave reels into the post feed
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
          if (!reelIdsRef.current.has(r.post)) {
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

  // Stories bar (independent small fetch, first page of reels)
  useEffect(() => {
    fetchReels(1, 15)
      .then((data) => setStories(data.results || []))
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

  // Infinite scroll with IntersectionObserver
  useEffect(() => {
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
        {/* ── Stories bar (reels) ── */}
        {stories.length > 0 && (
          <div
            className="flex gap-4 overflow-x-auto pb-1 mb-5"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {stories.map((reel) => {
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

        {page < totalPages && (
          <div className="flex justify-center py-8" ref={loaderRef}>
            {loadingMore && <Spinner />}
          </div>
        )}
      </main>
      {!loading && page >= totalPages && <GroundFooter />}
      </div>
    </div>
  );
}
