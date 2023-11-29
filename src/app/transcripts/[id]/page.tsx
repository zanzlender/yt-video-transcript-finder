import React, { Suspense } from "react";
import TranscriptPlayerClient from "~/app/_components/TranscriptPlayerClient";
import PlyrVideoPlayer from "~/app/_components/VideoPlayer";
import { api } from "~/trpc/server";

type AcceptedSearchParams = "start" | "duration" | "lineId";

type Props = {
  searchParams: Record<AcceptedSearchParams, string>;
  params: { id: string };
};

const Transcript = async ({ searchParams, params }: Props) => {
  console.log("SEARCH PARAMS: ", searchParams);

  const startParam = searchParams.start;
  const durationParam = searchParams.duration;
  const lineIdParam = searchParams.lineId;

  const getTranscriptsQuery = await api.transcript.getTranscript.query({
    id: Number(params.id),
  });

  return (
    <div className="mx-auto mt-32 grid w-full max-w-7xl grid-cols-1 gap-6 md:grid-cols-2">
      <div className="h-fit w-full max-w-[500px]">
        <Suspense>
          <TranscriptPlayerClient url={getTranscriptsQuery.video.url} />
        </Suspense>
      </div>

      <div className="w-full">
        <h2 className="mb-2 text-3xl text-white">
          {getTranscriptsQuery.video?.title ?? "..."}
        </h2>
        <h3 className="mb-5 text-2xl font-semibold text-white">
          {getTranscriptsQuery.video?.author_name ?? "..."}
        </h3>

        <div className="w-full text-left">
          <div className="mb-4 rounded bg-green-700 px-3 py-2">
            <p className="text-white">
              <span className="font-semibold text-white">Hint:</span> Click on
              any line to seek that line in the video
            </p>
          </div>

          <div
            //ref={transcriptListRef}
            className="max-h-[500px] w-full overflow-y-auto"
          >
            {getTranscriptsQuery.transcript.text?.map((text, idx) => {
              return (
                <p
                  key={`transcript-line-${idx}`}
                  id={`transcript-line-${idx}`}
                  className={`text-white underline-offset-2 hover:cursor-pointer hover:underline`}
                  //onClick={() => handleSetTime(Number(text.start))}
                >
                  {text.formatedStart} - {text["#text"]}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transcript;
