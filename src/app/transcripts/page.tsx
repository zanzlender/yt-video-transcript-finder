import React from "react";

const transcripts = Array.from(Array(20).keys()).map((item) => {
  return {
    videoName: "My video " + item,
    url: "https://www.youtube.com?v=" + item,
  };
});

const TranscriptsPage = () => {
  return (
    <div className="mx-auto mt-32 w-full max-w-7xl">
      <h1 className="mb-8 text-4xl font-extrabold text-white">
        My transcripts
      </h1>

      <div className="mb-12 flex flex-wrap items-center justify-evenly">
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-pink-600 p-6">
          <p className="text-white">Number of scripts</p>
          <p className="text-white">125</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-pink-600 p-6">
          <p className="text-white">Number of scripts</p>
          <p className="text-white">125</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-pink-600 p-6">
          <p className="text-white">Number of scripts</p>
          <p className="text-white">125</p>
        </div>
      </div>

      <section className="flex flex-col gap-4">
        {transcripts.map((transcript, idx) => {
          return (
            <div key={`transcript_${idx}`} className="text-center text-white">
              <p>Name: {transcript.videoName}</p>
              <p>Name: {transcript.url}</p>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default TranscriptsPage;
