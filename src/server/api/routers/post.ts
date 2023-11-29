import { ZodError, z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  GetYoutubeTranscriptFromURL as GetYoutubeTranscriptURL,
  GetYoutubeVideoInfoFromURL,
  VideoInformation,
  ZodVideoInformation,
} from "~/lib/youtube";
import { TRPCError } from "@trpc/server";
import {
  ParseXML,
  type TranscriptXMLFormat,
  ZodTranscriptXMLFormat,
} from "~/lib/xmlParser";

import { MeiliSearch } from "meilisearch";
import { secondsToHms } from "~/lib/timeParser";

export type TranscriptDocument = {
  id: number;
  transcript: TranscriptXMLFormat;
  video: VideoInformation;
};

const client = new MeiliSearch({
  host: "http://127.0.0.1:7700",
});

export const transcriptRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAllTranscripts: publicProcedure.query(async () => {
    const results = await client
      .index("video_transcripts")
      .getDocuments<TranscriptDocument>({
        fields: ["transcript", "video", "id"],
      });

    return {
      documents: results.results,
      total: results.total,
    };
  }),

  getTranscript: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const results = await client
        .index("video_transcripts")
        .getDocument<TranscriptDocument>(input.id);

      return {
        ...results,
      };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.post.create({
        data: {
          name: input.name,
        },
      });
    }),

  deleteTranscript: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      try {
        await client.index("video_transcripts").deleteDocument(input.id);

        return "Transcript deletion enqued, it will be done shortly";
      } catch (err) {
        throw new Error("Failed to delete transcript.");
      }
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
    });
  }),

  getTranscriptFromUrl: publicProcedure
    .input(
      z.object({
        url: z
          .string({ required_error: "URL is required." })
          .url({ message: "This is not a valid URL." }),
      }),
    )
    .mutation(async ({ input }) => {
      const transcriptUrl = await GetYoutubeTranscriptURL(input.url);
      const videoInfo = await GetYoutubeVideoInfoFromURL(input.url);

      if (typeof transcriptUrl !== "string") {
        throw new Error(transcriptUrl.error);
      }

      const res = await fetch(transcriptUrl);

      const transcript = await ParseXML(await res.text());
      const formatedTranscript = {
        text: transcript.transcript.text.map((x) => {
          return {
            ...x,
            formatedStart: secondsToHms(x.start),
          };
        }),
      };

      if (transcript instanceof ZodError || videoInfo === "ERROR_HAPPENED") {
        console.log("ERROR", transcript.errors);
        throw new Error("Error");
      } else {
        console.log("ALL GOOD", transcript.transcript.text[0]);
      }

      return {
        video: videoInfo,
        transcript: formatedTranscript,
      };
    }),

  search: publicProcedure
    .input(z.object({ search: z.string() }))
    .mutation(async ({ input }) => {
      const index = client.index("video_transcripts");
      const search = await index.search<TranscriptDocument>(input.search, {
        showMatchesPosition: true,
        attributesToHighlight: ["*"],
        matchingStrategy: "all",
        highlightPreTag:
          '<span class="bg-purple-200 text-purple-900 font-bold">',
        highlightPostTag: "</span>",
        limit: 10,
      });
      console.log(search);

      const filteredHits = search.hits.map((x) => {
        return {
          ...x,
          _formatted: {
            ...x._formatted,
            transcript: {
              id: x._formatted?.transcript?.id ?? 0,
              text:
                x._formatted?.transcript?.text.filter((y) =>
                  y["#text"].includes("<span"),
                ) ?? [],
            },
          },
        };
      });

      return { ...search, hits: filteredHits };
    }),

  saveTranscript: publicProcedure
    .input(
      z.object({
        transcript: ZodTranscriptXMLFormat,
        video: ZodVideoInformation,
      }),
    )
    .mutation(async ({ input }) => {
      const allDocuments = await client
        .index("video_transcripts")
        .getDocuments<{ id: number }>({
          fields: ["id"],
        });

      const lastId = allDocuments.results.reduce((prev, val) => {
        return Number(val.id) > Number(prev) ? val.id : prev;
      }, 0);

      const result = await AddOrUpdateDocuments({
        documents: [
          {
            id: lastId + 1,
            transcript: input.transcript,
            video: input.video,
          },
        ],
      });

      console.log(result);

      return result;
    }),
});

type GetDocumentsProps = {
  limit: number;
  offset: number;
};

async function GetDocuments({ limit, offset }: GetDocumentsProps) {
  const docs = await client
    .index("video_transcripts")
    .getDocuments<TranscriptXMLFormat>({
      filter:
        "(rating > 3 AND (genres = Adventure OR genres = Fiction)) AND language = English",
      fields: ["id", "text"],
      limit: 3,
    });

  return docs;
}

async function GetDocument(id: number) {
  const doc = await client
    .index("video_transcripts")
    .getDocument(25684, { fields: ["id", "title", "poster", "release_date"] });

  return doc;
}

type AddOrUpdateDocumentsProps = {
  documents: Array<TranscriptDocument>;
};

/**
 * Add a list of documents or update them if they already exist.
 * If the provided index does not exist, it will be created.
 * If you send an already existing document (same document id) the old document will be only partially updated according to the fields of the new document.
 * Thus, any fields not present in the new document are kept and remain unchanged.
 */
async function AddOrUpdateDocuments({ documents }: AddOrUpdateDocumentsProps) {
  const response = await client
    .index("video_transcripts")
    .updateDocuments(documents);

  return response;
}

async function DeleteDocument(id: number) {
  const response = await client.index("video_transcripts").deleteDocument(id);
  return response;
}
