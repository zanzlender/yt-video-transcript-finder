"use client";

import Image from "next/image";
import React from "react";
import { toast } from "react-toastify";
import type { TranscriptDocument } from "~/server/api/routers/post";
import { api } from "~/trpc/react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = {
  document: TranscriptDocument;
};

const TranscriptCard = ({ document }: Props) => {
  const router = useRouter();

  const deleteTranscript = api.transcript.deleteTranscript.useMutation({
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      router.refresh();
    },
  });

  const handleDeleteTranscript = (id: number) => {
    deleteTranscript.mutate({ id: id });
  };

  return (
    <>
      <Popover>
        <PopoverTrigger className="w-full min-w-[150px] max-w-[200px] ">
          <div
            key={`transcript_${document.id}`}
            className="w-full overflow-clip rounded border border-gray-600 text-center text-white hover:scale-105 hover:cursor-pointer"
          >
            <div className="relative mb-4 aspect-video w-full object-cover">
              <Image
                fill={true}
                className="object-cover"
                alt={"Video thumbnail"}
                src={
                  document.video?.thumbnail_url ??
                  "/assets/no_thumbnail_found.jpg"
                }
              />
            </div>
            <p className="mb-2 font-bold">{document.video?.title ?? "???"}</p>
            <p className="mb-4 font-semibold">
              {document.video?.author_name ?? "???"}
            </p>
          </div>
        </PopoverTrigger>

        <PopoverContent className="border border-gray-600 bg-slate-900">
          <div className="mb-6 grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none text-white">
                Edit transcript
              </h4>
              <p className="text-sm text-muted-foreground">
                See more information or delete the transcript.
              </p>
            </div>
          </div>

          <div className="flex flex-row gap-2">
            <Button
              variant="destructive"
              type="button"
              onClick={() => handleDeleteTranscript(document.id)}
            >
              Delete
            </Button>
            <Link href={`/transcripts/${document.id}`}>
              <Button variant="outline" type="button">
                View
              </Button>
            </Link>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default TranscriptCard;
