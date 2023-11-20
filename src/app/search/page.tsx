"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { api } from "~/trpc/react";
import { useDebounce } from "usehooks-ts";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import Link from "next/link";

const SearchPage = () => {
  const [search, setSearch] = useState("");
  const searchMutation = api.post.search.useMutation();
  const debouncedSearch = useDebounce(search, 500);

  const [parentRef] = useAutoAnimate({
    disrespectUserMotionPreference: false,
    easing: "ease-in-out",
    duration: 100,
  });

  useEffect(() => {
    const handleSearch = () => {
      searchMutation.mutate({ search: debouncedSearch });
    };

    handleSearch();
  }, [debouncedSearch]);

  return (
    <>
      <div className="mx-auto mt-32 w-full max-w-7xl">
        <h1 className="mb-8 text-4xl font-extrabold text-white">
          Search engine
        </h1>

        <div className="mb-12">
          <p className="text-white">
            Here you can search through all of your transcript to find the video
            you are looking for!
          </p>
        </div>

        <section>
          <div className="mx-auto w-full max-w-3xl">
            <div className="mb-6 flex w-full flex-row items-center gap-2">
              <input
                type="text"
                className="w-full rounded-md bg-slate-700 px-4 py-3 text-white outline-none outline-1 focus:outline-pink-500"
                placeholder="https://youtube.com?v=..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                disabled={false}
                type="button"
                className="inline-block whitespace-nowrap rounded bg-pink-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-pink-700 focus:outline-none focus:ring focus:ring-yellow-400 disabled:pointer-events-none disabled:grayscale"
              >
                Get transcript
              </button>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4" ref={parentRef}>
          {searchMutation.isSuccess &&
            searchMutation.data.hits.map((item, idx) => {
              return (
                <div
                  key={idx}
                  className="min-h-40 flex w-full gap-6 rounded-xl bg-white p-6"
                >
                  <picture className="relative aspect-square h-20 w-full max-w-[80px] object-cover">
                    <Image
                      alt="Video thumbnail"
                      objectFit="cover"
                      src={"https://i.ytimg.com/vi/hhbHMY0rvv8/hqdefault.jpg"}
                      fill={true}
                    />
                  </picture>

                  <div className="w-full">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-black">{item["title"]}</p>
                        <p className="mb-4 text-black">{item["id"]}</p>
                      </div>
                      <Link href={`/transcripts/${idx}`}>
                        <button className="rounded bg-teal-700 px-4 py-2 text-sm text-white hover:bg-teal-800">
                          Open
                        </button>
                      </Link>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/transcripts/${idx}?start=${123}&duration=${123}&lineId=${123}`}
                      >
                        <p className="text-black">{item["overview"]}</p>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}

          {searchMutation.isSuccess &&
            searchMutation.data.hits.length === 0 && (
              <div className="mx-auto">
                <p className="text-white">No results found.</p>
              </div>
            )}

          {searchMutation.isError && (
            <div className="mx-auto">
              <p className="text-white">
                There was an unexpected error. Refresh the page and try again.
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default SearchPage;
