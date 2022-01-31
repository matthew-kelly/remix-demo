import {
  json,
  redirect,
  useCatch,
  useLoaderData,
  useLocation,
  useOutletContext,
} from "remix";
import type { LoaderFunction } from "remix";
import styles from "~/styles/episodes/episode.css";
import formatEpisodeTitle from "~/utils/getEpisodeNumber";

export interface Episode {
  title: string;
  description: string;
  link: string;
  imageURL: string;
  enclosure: object;
}

// set <link> tags in head for this page
export let links = () => {
  return [
    {
      rel: "stylesheet",
      href: styles,
    },
  ];
};

// export function headers() {
//   // return http headers
//   // most common use is caching
// }

// Action
// handle data mutations or other actions
// has the same API as a loader, called when a post/put/patch/delete request is made
// export function action() {
//   // most common use is for forms
// }

// server only loader function
export let loader: LoaderFunction = async ({ params }) => {
  let formattedTitle = params.episode;
  return formattedTitle;
};

export function CatchBoundary() {
  const caught = useCatch();
  const { state } = useLocation();
  console.log({ state });
  return (
    <section>
      <h2>Error: {caught.data}</h2>
      <p>We couldn't find that episode! Choose another from the list.</p>
    </section>
  );
}

export default function Episode() {
  const formattedTitle = useLoaderData<string>();
  const { episodes }: { episodes: Episode[] } = useOutletContext();
  let episode = episodes.find(
    (item) => formatEpisodeTitle(item.title) === formattedTitle
  );
  if (!episode) {
    // throw a 404 error
    throw json("Episode not found", { status: 404 });
  }
  return (
    <section className="episode-details">
      {episode ? (
        <>
          <h2>{episode.title}</h2>
          <img src={episode.imageURL} alt={episode.title} />
          <audio controls src={episode.enclosure.url} />
          <div
            dangerouslySetInnerHTML={{ __html: episode.description }}
            style={{ marginTop: "1rem" }}
          />
          <a
            target="_blank"
            href={episode.link}
            rel="noreferrer"
            style={{ display: "inline-block", marginTop: "1rem" }}
          >
            Listen on Anchor
          </a>
        </>
      ) : (
        <p>Error: Could not find the episode you are looking for.</p>
      )}
    </section>
  );
}
