"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { api } from "~/trpc/react";
import { useDebounce } from "usehooks-ts";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import Link from "next/link";
import { PuffLoader } from "react-spinners";

const SearchPage = () => {
  const [search, setSearch] = useState("");
  const searchMutation = api.transcript.search.useMutation();
  const debouncedSearch = useDebounce(search, 500);
  const transcriptListRef = useRef<HTMLDivElement>(null);

  const [parentRef] = useAutoAnimate({
    disrespectUserMotionPreference: false,
    easing: "ease-in-out",
    duration: 100,
  });

  useEffect(() => {
    const handleSearch = () => {
      searchMutation.mutate({ search: debouncedSearch });
    };

    if (debouncedSearch.length > 3) handleSearch();

    // we cannot include the mutation object here because it changes on each render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  console.log(searchMutation.data?.hits);

  /* const handleSetTime = async (time: number) => {
    if (videoFrameRef.current?.plyr) {
      videoFrameRef.current.plyr.currentTime = Math.round(time);

      if (!videoFrameRef.current.plyr.playing) {
        videoFrameRef.current.plyr.muted = false;
        await videoFrameRef.current.plyr.play();
      }
    }
  }; */

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
                placeholder="Type anything you want"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </section>

        {searchMutation.isIdle && (
          <div className="mx-auto flex justify-center">
            <p className="text-center font-bold text-white">
              Start typing anything to search your transcripts (more than 3
              letters)
            </p>
          </div>
        )}

        <section className="flex flex-col gap-4" ref={parentRef}>
          {searchMutation.isLoading && (
            <div className="my-20">
              <PuffLoader size={120} color="white" className="mx-auto" />
            </div>
          )}

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
                        <p className="text-black">{item.video.title}</p>
                        <p className="mb-4 text-black">
                          {item.video.author_name}
                        </p>
                      </div>
                      <Link href={`/transcripts/${item.id}`}>
                        <button className="rounded bg-teal-700 px-4 py-2 text-sm text-white hover:bg-teal-800">
                          Open
                        </button>
                      </Link>
                    </div>

                    <div className="w-full text-left">
                      <div className="mb-4 rounded bg-green-700 px-3 py-2">
                        <p className="text-white">
                          <span className="font-semibold text-white">
                            Hint:
                          </span>{" "}
                          Click on any line to seek that line in the video
                        </p>
                      </div>

                      <div
                        ref={transcriptListRef}
                        className="max-h-[300px] w-full overflow-auto"
                      >
                        {item._formatted?.transcript?.text?.map((text, idx) => {
                          return (
                            <p
                              key={`transcript-line-${idx}`}
                              id={`transcript-line-${idx}`}
                              className={`text-black underline-offset-2 hover:cursor-pointer hover:underline`}
                              //onClick={() => handleSetTime(Number(text.start))}
                            >
                              {text.formatedStart} -{" "}
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: text["#text"],
                                }}
                              ></span>
                            </p>
                          );
                        })}
                      </div>
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
