import React, { Suspense } from "react";
import TranscriptCard from "../_components/TranscriptCard";
import { api } from "~/trpc/server";

const TranscriptsPage = async () => {
  const getTranscriptsQuery = await api.transcript.getAllTranscripts.query();

  return (
    <div className="mx-auto mt-32 w-full max-w-7xl">
      <h1 className="mb-8 text-4xl font-extrabold text-white">
        Manage transcripts
      </h1>

      <div className="mb-12 flex">
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-pink-600 p-6">
          <p className="text-white">Number of scripts</p>
          <p className="text-xl font-bold text-white">
            {getTranscriptsQuery.total}
          </p>
        </div>
      </div>

      <section className="flex flex-row flex-wrap justify-evenly gap-4">
        <Suspense>
          {getTranscriptsQuery.documents?.map((doc) => {
            return <TranscriptCard key={doc.id} document={{ ...doc }} />;
          })}
        </Suspense>
      </section>
    </div>
  );
};

export default TranscriptsPage;
