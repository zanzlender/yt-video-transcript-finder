import FeatureCard from "./_components/FeatureCard";
import {
  AlertTriangle as AlertTriangleIcon,
  Search as SeachIcon,
  Undo2 as UndoIcon,
  Database as DatabaseIcon,
  Download as DownloadIcon,
} from "lucide-react";
import SearchSubtitles from "./_components/GetSubtitles";
import { Suspense } from "react";

export default function Home() {
  // const data = await getData();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-20 ">
        <h1 className="bg-gradient-to-r from-[#ce3f3f] via-yellow-400 to-pink-500 bg-clip-text text-5xl font-extrabold tracking-tight sm:text-[5rem] ">
          <span className="text-transparent">YouTube</span>{" "}
          <span className="text-transparent">video finder</span>
        </h1>

        <h2 className="text-2xl font-bold text-white">
          To get the transcript try pasting any Youtube video url!
        </h2>

        {/* <div className="inline-block rounded bg-pink-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-pink-700 focus:outline-none focus:ring focus:ring-yellow-400">
            Get Started Today
          </div> */}

        <section id="searchSubtitles" className="w-full">
          <Suspense>
            <SearchSubtitles />
          </Suspense>
        </section>

        <section id="info" className="text-white">
          <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-12 text-3xl font-bold underline decoration-pink-500 decoration-wavy sm:text-4xl">
                What is this?
              </h2>

              <p className="mt-4 text-gray-300">
                Did you ever want to find the video once watched where you
                remember what was talked about but don&apos;t know which one it
                is?{" "}
                <strong className="underline decoration-purple-500 underline-offset-2">
                  Well I have.
                </strong>{" "}
              </p>
              <p className="mt-4 text-gray-300">
                Which is why YTF&apos;s idea is simple. Find videos on YT based
                on keywords and context of the video&apos;s content
                (transcript).
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                title="Download transcripts"
                text="You can download transcripts of YT videos from their URL's"
                Icon={
                  <DownloadIcon className="h-9 w-9 stroke-pink-500 stroke-2" />
                }
              />

              <FeatureCard
                title="Storage"
                text="All the transcripts you download are stored locally"
                Icon={
                  <DatabaseIcon className="h-9 w-9 stroke-pink-500 stroke-2" />
                }
              />

              <FeatureCard
                title="DB backup"
                text="The transcripts and the url's are also saved in a local
              SQLite database just in case. And if both get deleted just download again 👌"
                Icon={<UndoIcon className="h-9 w-9 stroke-pink-500 stroke-2" />}
              />

              <FeatureCard
                title="Search"
                text="YTF uses Meilisearch under the hood to search through all
              the transcripts and using content awareness hopefully finds which
              video you are looking for"
                Icon={
                  <SeachIcon className="h-9 w-9 stroke-pink-500 stroke-2" />
                }
              />

              <FeatureCard
                title="Always works! Most of the time..."
                text="Since Youtube's actual API doesn't offer this service, we use a clever way to give you your transcripts! Which may not always work..."
                Icon={
                  <AlertTriangleIcon className="h-9 w-9 stroke-pink-500 stroke-2" />
                }
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
