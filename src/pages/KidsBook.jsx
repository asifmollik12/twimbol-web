import React, { useState, useEffect, useCallback, useRef } from "react";
import NavBar from "../components/layout/Navbar.jsx";
import PostCard from "../components/post/PostCard.jsx";
import { getPosts } from "../api/posts.js";
import Spinner from "../components/ui/Spinner.jsx";
import DecorativeBackground from "../components/ui/DecorativeBackground.jsx";
import GroundFooter from "../components/ui/GroundFooter.jsx";
import { BookOpen } from "lucide-react";

// Auto-load only the first 2 pages via scroll; after that the user must
// tap "See More" to keep going.
const AUTO_LOAD_PAGES = 2;

/**
 * KidsBook.jsx – Kids Book feed. Same post-preview feed layout as Home,
 * scoped to kids-book content.
 */
export default function KidsBook() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const loaderRef = useRef(null);

  const loadPosts = useCallback(async (pageNum = 1) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const res = await getPosts({ page: pageNum, page_size: 10 });
      const data = res.data;
      const newPosts = data.results || [];

      setPosts((prev) => (pageNum === 1 ? newPosts : [...prev, ...newPosts]));
      setTotalPages(data.total_pages || 1);
      setPage(pageNum);
    } catch (err) {
      setError("Failed to load kids books. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadPosts(1);
  }, [loadPosts]);

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
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  return (
    <div className="min-h-screen bg-surface" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <DecorativeBackground />
      <div className="relative" style={{ zIndex: 1 }}>
        <NavBar activePage="Kids Book" />

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
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-brand-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen size={32} color="#5B2FC9" strokeWidth={1.8} />
              </div>
              <p className="text-base font-semibold text-txt">No kids books yet</p>
              <p className="text-sm text-txt-secondary mt-1.5">
                Check back soon for fresh storybooks!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} onHidden={handleHidden} />
              ))}
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
    </div>
  );
}
