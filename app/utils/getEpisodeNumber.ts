export default function formatEpisodeTitle(title: string) {
  return title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
}
