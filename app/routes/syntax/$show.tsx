import { json, redirect, useCatch, useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import styles from "~/styles/syntax/show.css";
import { padShowNumber } from "~/utils/padShowNumber";

export interface Show {
  number: string;
  title: string;
  html: string;
  url: string;
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

export function headers() {
  // return http headers
  // most common use is caching
}

// Action
// handle data mutations or other actions
// has the same API as a loader, called when a post/put/patch/delete request is made
export function action() {
  // most common use is for forms
}

// server only loader function
export let loader: LoaderFunction = async ({ params }) => {
  let showNumber = params.show;
  // redirect if show number is less than 3 digits
  if (showNumber && showNumber.length < 3) {
    showNumber = padShowNumber(showNumber);
    return redirect(`/syntax/${showNumber}`, 301);
  }
  const response = await fetch("https://syntax.fm/api/shows/" + showNumber);
  const show = await response.json();
  if (!show.url) {
    // throw a 404 error
    throw json("Episode not found", { status: 404 });
  }
  return show;
};

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <section>
      <h2>Error: {caught.data}</h2>
      <p>We couldn't find that episode! Choose another from the list.</p>
    </section>
  );
}

export default function Show() {
  const show = useLoaderData<Show>();
  return (
    <section className="show-details">
      <h2>
        #{show.number}: {show.title}
      </h2>
      <audio controls src={show.url} />
      <div dangerouslySetInnerHTML={{ __html: show.html }} />
    </section>
  );
}
