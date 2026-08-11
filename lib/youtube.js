// Terima berbagai format link YouTube (watch?v=, youtu.be/, embed/)
// dan kembalikan video ID-nya saja.
export function getYoutubeId(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.slice(1);
    }
    if (u.pathname.includes("/embed/")) {
      return u.pathname.split("/embed/")[1];
    }
    if (u.searchParams.get("v")) {
      return u.searchParams.get("v");
    }
    return null;
  } catch (e) {
    return null;
  }
}

export function getYoutubeThumbnail(url) {
  const id = getYoutubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

export function getYoutubeWatchUrl(url) {
  const id = getYoutubeId(url);
  return id ? `https://www.youtube.com/watch?v=${id}` : url;
}
