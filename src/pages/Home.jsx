import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/layout/Navbar.jsx";
import PostCard from "../components/post/PostCard.jsx";
import { fetchReels } from "../api/api.js";
import { getPosts } from "../api/posts.js";
import Spinner from "../components/ui/Spinner.jsx";
import { Play, Newspaper } from "lucide-react";

/**
 * Home.jsx – Twimbol news feed.
 * Instagram-style reel "stories" bar up top, Facebook-style vertical
 * feed of posts below. Supports infinite scroll / load more.
 */
export default function Home() {
  const navigate = useNavigate();
  const [reels, setReels] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const loaderRef = useRef(null);

  // Reels strip for the stories bar
  useEffect(() => {
    fetchReels(1, 15)
      .then((data) => setReels(data.results || []))
      .catch(() => {});
  }, []);

  const loadPosts = useCallback(async (pageNum = 1) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const res = await getPosts({ page: pageNum, page_size: 10 });
      const data = res.data;
      const results = data.results || [];

      setPosts((prev) => (pageNum === 1 ? results : [...prev, ...results]));
      setTotalPages(data.total_pages || 1);
      setPage(pageNum);
    } catch (err) {
      setError("Failed to load your feed. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

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
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  return (
    <div className="min-h-screen bg-surface" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <NavBar activePage="Home" />

      <main className="max-w-xl mx-auto px-4 py-6">
        {/* ── Stories bar (reels) ── */}
        {reels.length > 0 && (
          <div
            className="flex gap-4 overflow-x-auto pb-1 mb-5"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {reels.map((reel) => {
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
        ) : posts.length === 0 ? (
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
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onHidden={handleHidden} />
            ))}
          </div>
        )}

        {page < totalPages && (
          <div className="flex justify-center py-8" ref={loaderRef}>
            {loadingMore && <Spinner />}
          </div>
        )}
      </main>
    </div>
  );
}
