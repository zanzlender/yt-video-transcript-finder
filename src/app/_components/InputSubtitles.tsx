"use client";

import { useState } from "react";

const InputSubtitles = () => {
  const [nameInput, setNameInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [transcriptInput, setTranscriptInput] = useState("");

  const handleSave = () => {
    console.log("SAVING");
  };

  return (
    <>
      <div className="mt-20 flex w-full max-w-2xl flex-col items-center gap-2">
        <input
          name="nameInput"
          type="text"
          className="w-full rounded-md bg-slate-700 px-4 py-3 text-white outline-none outline-1 focus:outline-pink-500"
          placeholder="Input video name..."
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />
        <input
          name="urlInput"
          type="text"
          className="w-full rounded-md bg-slate-700 px-4 py-3 text-white outline-none outline-1 focus:outline-pink-500"
          placeholder="https://www.youtube.com/watch=?v...."
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
        />

        <textarea
          name="transcriptInput"
          placeholder="Paste transcript here..."
          className="min-h-[300px] w-full rounded-md bg-slate-700 px-4 py-3 text-white outline-none outline-1 focus:outline-pink-500"
          value={transcriptInput}
          onChange={(e) => setTranscriptInput(e.target.value)}
        />
      </div>

      <button
        disabled={false}
        onClick={handleSave}
        type="button"
        className="inline-block rounded bg-pink-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-pink-700 focus:outline-none focus:ring focus:ring-yellow-400 disabled:pointer-events-none disabled:grayscale"
      >
        Save transcript
      </button>
    </>
  );
};

export default InputSubtitles;
