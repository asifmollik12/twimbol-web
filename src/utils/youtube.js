// Helpers for detecting and rendering YouTube-hosted video links.
// We store YouTube URLs in the same `video_url` field used for
// Cloudinary-hosted reels, so these helpers let the UI tell them apart.

const YOUTUBE_ID_RE =
  /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

export function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(YOUTUBE_ID_RE);
  return match ? match[1] : null;
}

export function isYouTubeUrl(url) {
  return !!getYouTubeId(url);
}

export function getYouTubeThumbnail(id) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

export function getYouTubeEmbedUrl(id, { autoplay = false } = {}) {
  return `https://www.youtube.com/embed/${id}${autoplay ? "?autoplay=1" : ""}`;
}

export function getYouTubeWatchUrl(id) {
  return `https://www.youtube.com/watch?v=${id}`;
}
