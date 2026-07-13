import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Share2, Volume2, VolumeX, Play } from "lucide-react";
import { getImageUrl, likeReel, unlikeReel, toggleFollow, recordReelView } from "../../api/api.js";

function formatCount(n) {
  if (!n && n !== 0) return "0";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  return String(n);
}

/**
 * ReelFeedCard – renders a reel as an inline feed post (Facebook-style),
 * autoplaying muted when scrolled into view.
 */
export default function ReelFeedCard({ reel }) {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const hasViewedRef = useRef(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState(reel.liked_by_user || false);
  const [likeCount, setLikeCount] = useState(reel.like_count || 0);
  const [followed, setFollowed] = useState(reel.user_profile?.followed_by_user || false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasLoaded(true);
          const video = videoRef.current;
          if (video) {
            video.play().then(() => setPlaying(true)).catch(() => {});
            if (!hasViewedRef.current) {
              hasViewedRef.current = true;
              recordReelView(reel.post);
            }
          }
        } else {
          const video = videoRef.current;
          if (video) {
            video.pause();
            setPlaying(false);
          }
        }
      },
      { threshold: 0.6 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reel.post]);

  const handleLike = async () => {
    const next = !liked;
    setLiked(next);
    setLikeCount((c) => (next ? c + 1 : Math.max(0, c - 1)));
    try {
      if (next) await likeReel(reel.post);
      else await unlikeReel(reel.post);
    } catch {
      setLiked(!next);
      setLikeCount((c) => (next ? c - 1 : c + 1));
    }
  };

  const handleFollow = async () => {
    const next = !followed;
    setFollowed(next);
    try {
      await toggleFollow(reel.user_profile?.user?.id || reel.created_by);
    } catch {
      setFollowed(!next);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/reel/${reel.post}`;
    if (navigator.share) {
      navigator.share({ title: reel.title || "Reel", url });
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const username = reel.user_profile?.username || reel.user_profile?.user?.username || "Creator";
  const profilePic = getImageUrl(reel.user_profile?.user?.profile_pic || null);
  const description = reel.reel_description || reel.title || "";
  const commentCount = reel.comments ?? 0;

  return (
    <article ref={containerRef} className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-surface overflow-hidden flex-shrink-0 ring-2 ring-brand/20">
            {profilePic ? (
              <img src={profilePic} alt={username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-base font-bold text-brand bg-brand-light">
                {username[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-txt">{username}</span>
              <span
                className="text-brand text-sm font-semibold cursor-pointer hover:underline"
                onClick={handleFollow}
              >
                {followed ? "• Following" : "• Follow"}
              </span>
            </div>
            <span className="text-xs text-txt-secondary">Reel</span>
          </div>
        </div>
      </div>

      {/* Caption */}
      {description && (
        <p className="px-5 pb-3 text-sm text-txt leading-relaxed">{description}</p>
      )}

      {/* Video */}
      <div
        className="relative w-full bg-black cursor-pointer overflow-hidden"
        style={{ aspectRatio: "9/16", maxHeight: "560px" }}
      >
        <video
          ref={videoRef}
          src={hasLoaded ? reel.video_url : undefined}
          poster={reel.thumbnail_url}
          className="w-full h-full object-cover"
          muted={muted}
          loop
          playsInline
          preload="none"
          onClick={togglePlay}
        />
        {!playing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
            <div className="w-14 h-14 rounded-full bg-white/25 backdrop-blur flex items-center justify-center">
              <Play size={24} className="text-white fill-white ml-1" />
            </div>
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); setMuted((m) => !m); }}
          className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-black/45 backdrop-blur flex items-center justify-center text-white"
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <div className="absolute top-3 left-3 bg-black/45 backdrop-blur rounded-full px-2.5 py-1 text-white text-xs font-semibold">
          Reel
        </div>
      </div>

      {/* Stats row */}
      <div className="px-5 py-2 flex items-center justify-between text-xs text-txt-secondary border-t border-border">
        <div className="flex items-center gap-1">
          <span className="w-5 h-5 rounded-full bg-brand flex items-center justify-center">
            <Heart size={10} className="text-white fill-white" />
          </span>
          <span className="ml-1">{formatCount(likeCount)}</span>
        </div>
        {commentCount > 0 && <span>{commentCount} comments</span>}
      </div>

      {/* Actions */}
      <div className="px-3 py-1 flex items-center border-t border-gray-100">
        <button
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-surface ${liked ? "text-brand" : "text-txt-secondary"
            }`}
        >
          <Heart size={18} className={liked ? "fill-current" : ""} />
          Like
        </button>
        <button
          onClick={() => navigate(`/reel/${reel.post}`)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-txt-secondary hover:bg-surface transition-colors"
        >
          <MessageCircle size={18} />
          Comment
        </button>
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-txt-secondary hover:bg-surface transition-colors"
        >
          <Share2 size={18} />
          Share
        </button>
      </div>
    </article>
  );
}
