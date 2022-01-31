import formatEpisodeTitle from "~/utils/getEpisodeNumber";
import { padShowNumber } from "~/utils/padShowNumber";
import { Episode } from "./episodes/$episode";

let siteUrl = "https://remix-demo-matthew-kelly.vercel.app";

export async function loader() {
  const podcastFeedParser = require("podcast-feed-parser");
  const { episodes }: { episodes: Episode[] } =
    await podcastFeedParser.getPodcastFromURL(
      "https://anchor.fm/s/476c2ff4/podcast/rss",
      {
        fields: {
          meta: ["title"],
        },
        uncleaned: {
          episodes: [],
        },
      }
    );
  const episodesXML: string = episodes
    .map(
      (episode) => `
        <url>
          <loc>${siteUrl}/episodes/${formatEpisodeTitle(episode.title)}</loc>
          <priority>1.0</priority>
          <changefreq>daily</changefreq>
        </url>`
    )
    .join("");

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${siteUrl}</loc>
        <priority>1.0</priority>
        <changefreq>daily</changefreq>
      </url>
      <url>
        <loc>${siteUrl}/contact</loc>
        <priority>1.0</priority>
        <changefreq>daily</changefreq>
      </url>
      <url>
        <loc>${siteUrl}/episodes</loc>
        <priority>1.0</priority>
        <changefreq>daily</changefreq>
      </url>
      ${episodesXML}
    </urlset>`;
  return new Response(sitemap, {
    headers: {
      "Content-Type": "text/xml",
    },
  });
}
