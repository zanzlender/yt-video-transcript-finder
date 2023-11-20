import { ZodError, z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  GetYoutubeTranscriptFromURL as GetYoutubeTranscriptURL,
  GetYoutubeVideoInfoFromURL,
} from "~/lib/youtube";
import { TRPCError } from "@trpc/server";
import { ParseXML } from "~/lib/xmlParser";

import { MeiliSearch } from "meilisearch";
import { secondsToHms } from "~/lib/timeParser";

const client = new MeiliSearch({
  host: "http://127.0.0.1:7700",
});

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
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
      const index = client.index("movies");
      const search = await index.search(input.search);
      console.log(search);

      return search;
    }),
});
