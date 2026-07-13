import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Facebook, Twitter, Youtube, Loader2, Users } from "lucide-react";
import NavBar from "../components/layout/Navbar.jsx";
import PostCard from "../components/post/PostCard.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import { getUserProfile, getImageUrl, toggleFollow } from "../api/api.js";
import { getPosts } from "../api/posts.js";
import { useAuthStore } from "../store/authStore";

const GROUP_COLOR = {
  admin: "#1a1aff",
  creator: "#5B2FC9",
};

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: me } = useAuthStore();

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [followed, setFollowed] = useState(false);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const loaderRef = useRef(null);

  const isOwnProfile = String(me?.user?.id) === String(id);

  // Redirect to the "My Profile" style /profile/edit flow for yourself? No —
  // just show the same timeline view, hiding the Follow button instead.

  const loadProfile = useCallback(async () => {
    setProfileLoading(true);
    try {
      const data = await getUserProfile(id);
      setProfile(data);
      setFollowed(data?.followed_by_user || false);
    } catch {
      // Fallback: derive a public profile from the first post's embedded
      // user_profile if a dedicated profile-by-id lookup isn't available.
      try {
        const res = await getPosts({ created_by: id, page: 1, page_size: 1 });
        const first = res.data?.results?.[0];
        if (first?.user_profile) {
          setProfile(first.user_profile);
          setFollowed(first.user_profile.followed_by_user || false);
        }
      } catch {
        setProfile(null);
      }
    } finally {
      setProfileLoading(false);
    }
  }, [id]);

  const loadPosts = useCallback(async (pageNum = 1) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const res = await getPosts({ created_by: id, page: pageNum, page_size: 10 });
      const data = res.data;
      const results = data.results || [];

      setPosts((prev) => (pageNum === 1 ? results : [...prev, ...results]));
      setTotalPages(data.total_pages || 1);
      setPage(pageNum);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [id]);

  useEffect(() => {
    loadProfile();
    loadPosts(1);
  }, [loadProfile, loadPosts]);

  // Infinite scroll
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

  const handleFollow = async () => {
    const next = !followed;
    setFollowed(next);
    try {
      await toggleFollow(id);
    } catch {
      setFollowed(!next);
    }
  };

  const handleHidden = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const user = profile?.user || {};
  const profilePicUrl = user.profile_pic ? getImageUrl(user.profile_pic) : null;
  const displayName =
    [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username || "User";
  const username = user.username || "";
  const userGroup = user.user_group?.[0] || "visitor";

  return (
    <div className="min-h-screen bg-surface" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <NavBar activePage="" />

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Profile header */}
        {profileLoading ? (
          <div className="bg-white rounded-2xl border border-border p-6 mb-5 animate-pulse flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-surface flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 bg-surface rounded" />
              <div className="h-3 w-1/4 bg-surface rounded" />
            </div>
          </div>
        ) : !profile ? (
          <div className="bg-white rounded-2xl border border-border p-10 mb-5 text-center">
            <Users size={32} className="text-txt-secondary mx-auto mb-3" />
            <p className="text-base font-semibold text-txt">Profile not found</p>
            <p className="text-sm text-txt-secondary mt-1">
              This user may not exist or their profile is unavailable.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border p-6 mb-5">
            <div className="flex flex-wrap items-center gap-5">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 ring-4 ring-brand/15 bg-surface">
                {profilePicUrl ? (
                  <img src={profilePicUrl} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-brand bg-brand-light">
                    {displayName[0]?.toUpperCase()}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg font-bold text-txt">{displayName}</h1>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{
                      background: GROUP_COLOR[userGroup] || "#e8e8e8",
                      color: userGroup === "visitor" ? "#666" : "#fff",
                    }}
                  >
                    {userGroup}
                  </span>
                </div>
                <p className="text-sm text-txt-secondary">@{username}</p>

                {/* Social links */}
                {(user.user_social_fb || user.user_social_twt || user.user_social_yt) && (
                  <div className="flex items-center gap-3 mt-2">
                    {user.user_social_fb && (
                      <Facebook size={16} className="text-txt-secondary" />
                    )}
                    {user.user_social_twt && (
                      <Twitter size={16} className="text-txt-secondary" />
                    )}
                    {user.user_social_yt && (
                      <Youtube size={16} className="text-txt-secondary" />
                    )}
                  </div>
                )}
              </div>

              {/* Follow / Edit */}
              {isOwnProfile ? (
                <button
                  onClick={() => navigate("/profile/edit")}
                  className="px-5 py-2.5 rounded-xl border border-border text-sm font-semibold text-txt hover:bg-surface transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={handleFollow}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    followed
                      ? "border border-border text-txt hover:bg-surface"
                      : "text-white"
                  }`}
                  style={
                    followed
                      ? {}
                      : { background: "linear-gradient(135deg, #2D1B69, #5B2FC9)" }
                  }
                >
                  {followed ? "Following" : "Follow"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Timeline */}
        <h2 className="text-sm font-bold text-txt mb-3">Posts</h2>
        {loading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-border h-56 animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border text-center py-16">
            <p className="text-sm text-txt-secondary">No posts yet.</p>
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
