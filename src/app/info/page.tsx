import Link from "next/link";
import React from "react";

const Information = () => {
  return (
    <div>
      <div className="mx-auto mt-32 w-full max-w-7xl">
        <h1 className="mb-10 text-4xl font-extrabold text-white">How to use</h1>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-bold text-white">
            Download scripts
          </h2>

          <p className="text-white">
            First you can download all the scripts you need{" "}
            <Link
              className="text-blue-500 underline-offset-4 hover:underline"
              href="/"
            >
              Here
            </Link>
            .
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-bold text-white">
            View your scripts
          </h2>

          <p className="text-white">
            You can browse all your transcripts on the{" "}
            <Link
              className="text-blue-500 underline-offset-4 hover:underline"
              href="/transcripts"
            >
              Transcripts page
            </Link>
            .
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-bold text-white">
            Find what you need
          </h2>

          <p className="text-white">
            You can search through all transcripts on the{" "}
            <Link
              className="text-blue-500 underline-offset-4 hover:underline"
              href="/search"
            >
              Search page
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
};

export default Information;
