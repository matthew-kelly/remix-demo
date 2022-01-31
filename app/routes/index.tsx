import { LoaderFunction, useLoaderData } from "remix";

export interface Meta {
  title: string;
  description: string;
  link: string;
  imageURL: string;
  categories: string[];
}

export let loader: LoaderFunction = async () => {
  const podcastFeedParser = require("podcast-feed-parser");
  const { meta } = await podcastFeedParser.getPodcastFromURL(
    "https://anchor.fm/s/476c2ff4/podcast/rss"
  );
  return {
    meta,
  };
};

export default function Index() {
  let { meta } = useLoaderData();
  return (
    <div>
      <section className="home">
        <img src={meta.imageURL} alt={meta.title} />
        <main>
          <h1>{meta.title}</h1>
          <p>{meta.description}</p>
        </main>
      </section>
    </div>
  );
}
