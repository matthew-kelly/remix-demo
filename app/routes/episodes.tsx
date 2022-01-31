import { Link, Outlet, useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import styles from "~/styles/episodes.css";
import { Episode } from "./episodes/$episode";
import { Meta } from "./index";
import formatEpisodeTitle from "~/utils/getEpisodeNumber";

export let links = () => {
  return [
    {
      rel: "stylesheet",
      href: styles,
    },
  ];
};

// sets the metadata for a route
export function meta() {
  return {
    title: "Two Additional Boleyn Girls",
    "og:title": "Two Additional Boleyn Girls",
  };
}

// export const handle = {
//   // object you can put anything in
// };

export let loader: LoaderFunction = async () => {
  const podcastFeedParser = require("podcast-feed-parser");
  const { meta, episodes }: { meta: Meta; episodes: Episode[] } =
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
  return {
    meta,
    episodes,
  };
};

export default function EpisodesPage() {
  let { meta, episodes } = useLoaderData<{ meta: Meta; episodes: Episode[] }>();
  return (
    <div>
      <section className="title-section">
        <h1>{meta.title}</h1>
      </section>
      <section className="cols">
        <aside className="playlist">
          <nav>
            {episodes.map((episode) => {
              const title = formatEpisodeTitle(episode.title);
              return (
                <ul key={title}>
                  <li>
                    <Link to={`/episodes/${title}`} prefetch="intent">
                      {episode.title}
                    </Link>
                  </li>
                </ul>
              );
            })}
          </nav>
        </aside>
        <Outlet context={{ meta, episodes }} />
      </section>
    </div>
  );
}
