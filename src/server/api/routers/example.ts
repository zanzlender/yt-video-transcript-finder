import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

import fs from "fs";
import { Index, Document } from "flexsearch-ts";
import path from "path";
import { cwd } from "process";
import { TRPCError } from "@trpc/server";
import { env } from "~/env.mjs";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  search: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input }) => {
      const searchIndexPath = path.join(cwd(), "/src/content/");

      const index = new Document({
        document: {
          id: "date",
          index: ["content"],
        },
        tokenize: "forward",
      });

      index.add({ date: "2021-11-01", content: "asdf asdf asd asd asd asd" });
      index.add({ date: "2021-11-02", content: "fobar 334kkk" });
      index.add({ date: "2021-11-04", content: "fobar 234 sffgfd" });

      await index.export((key, data) =>
        fs.writeFileSync(`${searchIndexPath}${key}.json`, data ? data : "")
      );

      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  downloadVideoTranscript: publicProcedure
    .input(
      z.object({
        url: z.string().url(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const videoId = input.url.split("?v=");

        if (videoId.length === 1 || !videoId[1]) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "INVALID_URL, should be in format: https://www.youtube.com/watch?v={ID}",
          });
        }

        const userData = await ctx.prisma.user.findFirstOrThrow({
          where: {
            id: ctx.session?.user.id,
          },
          select: {
            accounts: {
              select: {
                access_token: true,
              },
            },
          },
        });

        const apiUrl = `https://www.googleapis.com/youtube/v3/captions/${videoId[1]}`;

        console.log(apiUrl);
        console.log(userData.accounts[0]?.access_token);

        const getData = await fetch(apiUrl, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${userData.accounts[0]?.access_token ?? ""}`,
          },
        }).then((data) => data.json());

        console.log(getData);
        console.log(getData.error.errors);

        return getData;
      } catch (error) {
        if (error instanceof TRPCError) {
          return new TRPCError({
            code: error.code,
            message: error.message,
          });
        }
        return error;
      }
    }),
});
