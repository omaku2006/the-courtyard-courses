const YOUTUBE_ID_PATTERN =
  /(?:youtube\.com\/(?:watch\?v=|embed\/|live\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;

export const extractYouTubeId = (url = '') => {
  const match = String(url).match(YOUTUBE_ID_PATTERN);
  return match ? match[1] : null;
};

const parseIsoDuration = (iso) => {
  if (typeof iso !== 'string') return null;
  const match = iso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!match) return null;
  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2] ?? 0);
  const seconds = Number(match[3] ?? 0);
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  if (totalSeconds <= 0) return null;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

export const youtubeDuration = async (id) => {
  if (!id) return null;
  const key = process.env.YOUTUBE_KEY;
  if (!key) return null;
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${encodeURIComponent(id)}&part=contentDetails&key=${key}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return parseIsoDuration(data?.items?.[0]?.contentDetails?.duration);
  } catch {
    return null;
  }
};
