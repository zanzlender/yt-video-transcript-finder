"use client";

import { useState, useRef, type FormEvent } from "react";
import { api } from "~/trpc/react";
import { PuffLoader } from "react-spinners";
import { saveAs } from "file-saver";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import PlyrVideoPlayer from "./VideoPlayer";
import { type APITypes } from "plyr-react";
import { toast } from "react-toastify";

const GetSubtitles = () => {
  const [urlInput, setUrlInput] = useState("");
  const [parentRef] = useAutoAnimate();
  const videoFrameRef = useRef<APITypes>(null);
  const transcriptListRef = useRef<HTMLDivElement>(null);
  const [errorMessage, setErrorMessage] = useState(false);

  const getTranscriptMutation = api.post.getTranscriptFromUrl.useMutation({
    onError: (err) => {
      console.log("ERROR: ", err.message);
      setErrorMessage(true);
      toast.error("Could not download transcript");
    },
    onSuccess: (data) => {
      console.log(data);
      toast.success("Script downloaded!");
    },
    onMutate: () => {
      setErrorMessage(false);
    },
  });

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    getTranscriptMutation.mutate({ url: urlInput });
  };

  // TODO finish donwloading script
  const handleDownloadTranscript = () => {
    if (!getTranscriptMutation.isSuccess) return;

    const saveFile = new File(
      [JSON.stringify(getTranscriptMutation.data.transcript)],
      "transcript.txt",
      { type: "text/plain;charset=utf-8" },
    );
    saveAs(saveFile);
  };

  // TODO handle saving to meili
  const handleSaveSubtitle = () => {
    console.log("SAVING");
    toast.error("Hello");
  };

  const handleSetTime = async (time: number) => {
    if (videoFrameRef.current?.plyr) {
      videoFrameRef.current.plyr.currentTime = Math.round(time);

      if (!videoFrameRef.current.plyr.playing) {
        videoFrameRef.current.plyr.muted = false;
        await videoFrameRef.current.plyr.play();
      }
    }
  };

  return (
    <>
      <div className="mx-auto w-full">
        <form
          onSubmit={handleSearch}
          className="mx-auto mb-6 flex w-full max-w-3xl flex-row items-center gap-2"
        >
          <input
            type="text"
            className="w-full rounded-md bg-slate-700 px-4 py-3 text-white outline-none outline-1 focus:outline-pink-500"
            placeholder="https://youtube.com?v=..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <button
            disabled={false}
            type="submit"
            className="inline-block whitespace-nowrap rounded bg-pink-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-pink-700 focus:outline-none focus:ring focus:ring-yellow-400 disabled:pointer-events-none disabled:grayscale"
          >
            Get transcript
          </button>
        </form>

        {errorMessage && (
          <div
            role="alert"
            className="mx-auto max-w-2xl rounded border-s-4 border-red-500 bg-red-50 p-4"
          >
            <div className="flex items-center gap-2 text-red-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                  clipRule="evenodd"
                />
              </svg>

              <strong className="block font-medium">
                Unable to download transcript
              </strong>
            </div>

            <p className="mt-2 text-sm text-red-700">
              Something went wrong while trying to download the transcript. Make
              sure the it&apos;s a valid youtube video or shorts link and try
              again.
            </p>
          </div>
        )}

        {getTranscriptMutation.isLoading && (
          <div className="my-20">
            <PuffLoader size={120} color="white" className="mx-auto" />
          </div>
        )}

        <div ref={parentRef}>
          {getTranscriptMutation.isSuccess && (
            <div className="flex max-h-[1000px] flex-col gap-6 overflow-y-auto rounded-md border border-slate-600 bg-[#0f0024] p-2 py-4">
              <div className="flex w-full items-center justify-center gap-8">
                <button
                  onClick={handleDownloadTranscript}
                  type="button"
                  className="inline-block whitespace-nowrap rounded bg-pink-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-pink-700 focus:outline-none focus:ring focus:ring-yellow-400 disabled:pointer-events-none disabled:grayscale"
                >
                  Download transcript
                </button>

                <button
                  onClick={handleSaveSubtitle}
                  type="button"
                  className="inline-block whitespace-nowrap rounded bg-pink-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-pink-700 focus:outline-none focus:ring focus:ring-yellow-400 disabled:pointer-events-none disabled:grayscale"
                >
                  Save transcript
                </button>
              </div>

              <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="flex flex-col gap-4">
                  <PlyrVideoPlayer
                    ref={videoFrameRef}
                    source={{
                      type: "video",
                      title: "Some video",
                      sources: [
                        {
                          src: getTranscriptMutation.data.video.url,
                          provider: "youtube",
                        },
                      ],
                      poster: getTranscriptMutation.data.video.thumbnail_url,
                    }}
                    options={{
                      controls: [
                        "play",
                        "progress",
                        "current-time",
                        "mute",
                        "volume",
                        "settings",
                      ],
                      volume: 0.5,
                    }}
                  />

                  <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold text-white">
                      {getTranscriptMutation.data.video.title}
                    </h2>
                    <div className="flex gap-2">
                      <h2 className="font-semibold text-white">
                        {getTranscriptMutation.data.video.author_name}
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="w-full text-left">
                  <div className="mb-4 rounded bg-green-700 px-3 py-2">
                    <p className="text-white">
                      <span className="font-semibold text-white">Hint:</span>{" "}
                      Click on any line to seek that line in the video
                    </p>
                  </div>

                  <div
                    ref={transcriptListRef}
                    className="max-h-[500px] w-full overflow-y-auto"
                  >
                    {getTranscriptMutation.data.transcript.text.map(
                      (text, idx) => {
                        return (
                          <p
                            key={`transcript-line-${idx}`}
                            id={`transcript-line-${idx}`}
                            className={`text-white underline-offset-2 hover:cursor-pointer hover:underline`}
                            onClick={() => handleSetTime(Number(text.start))}
                          >
                            {text.formatedStart} - {text["#text"]}
                          </p>
                        );
                      },
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GetSubtitles;
