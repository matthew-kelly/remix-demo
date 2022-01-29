import { Link, Outlet, useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import type { Show } from "./syntax/$show";
import styles from "~/styles/syntax.css";
import { padShowNumber } from "~/utils/padShowNumber";

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
    title: "The Syntax Podcast",
    "og:title": "The Syntax Podcast",
  };
}

export const handle = {
  // object you can put anything in
};

export let loader: LoaderFunction = async () => {
  const response = await fetch("https://syntax.fm/api/shows");
  const shows: Show[] = await response.json();
  return {
    podcastName: "The Syntax Podcast",
    shows,
  };
};

export default function SyntaxPage() {
  let { podcastName, shows } =
    useLoaderData<{ podcastName: string; shows: Show[] }>();
  return (
    <div>
      <section>
        <h1>{podcastName}</h1>
      </section>
      <section className="cols">
        <aside className="playlist">
          <nav>
            {shows.map((show) => (
              <ul key={show.number}>
                <li>
                  <Link to={`/syntax/${padShowNumber(show.number)}`}>
                    #{show.number}: {show.title}
                  </Link>
                </li>
              </ul>
            ))}
          </nav>
        </aside>
        <Outlet />
      </section>
    </div>
  );
}
