import { padShowNumber } from "~/utils/padShowNumber";
import { Show } from "./syntax/$show";

let siteUrl = "https://syntax.fm";

export async function loader() {
  const response = await fetch("https://syntax.fm/api/shows");
  const shows: Show[] = await response.json();
  const showsXML: string = shows
    .map(
      (show) => `
        <url>
          <loc>${siteUrl}/syntax/${padShowNumber(show.number)}</loc>
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
        <loc>${siteUrl}/syntax</loc>
        <priority>1.0</priority>
        <changefreq>daily</changefreq>
      </url>
      ${showsXML}
    </urlset>`;
  return new Response(sitemap, {
    headers: {
      "Content-Type": "text/xml",
    },
  });
}
