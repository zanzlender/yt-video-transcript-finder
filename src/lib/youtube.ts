import { z } from "zod";
import { ExtractYoutubeTrancriptLink } from "./urlParser";

type YoutubeTranscriptLinkExtractionResponse =
  | { error: "COULD_NOT_GET_TRANSCRIPT" }
  | string;

export async function GetYoutubeTranscriptFromURL(
  url: string,
): Promise<YoutubeTranscriptLinkExtractionResponse> {
  try {
    const response = await fetch(url);
    const responseText = await response.text();
    const youtubeTranscriptUrl = ExtractYoutubeTrancriptLink(responseText);

    if (typeof youtubeTranscriptUrl === "string") {
      // remove unicode characters
      return decodeURI(youtubeTranscriptUrl);
    }

    return {
      error: "COULD_NOT_GET_TRANSCRIPT",
    };
  } catch {
    return {
      error: "COULD_NOT_GET_TRANSCRIPT",
    };
  }
}

export const ZodVideoInformation = z.object({
  title: z.string(),
  author_name: z.string(),
  author_url: z.string(),
  type: z.string(),
  height: z.number(),
  width: z.number(),
  version: z.string(),
  provider_name: z.string(),
  provider_url: z.string(),
  thumbnail_height: z.number(),
  thumbnail_width: z.number(),
  thumbnail_url: z.string(),
  html: z.string(),
  url: z.string(),
  video_id: z.string(),
});

export type VideoInformation = z.infer<typeof ZodVideoInformation>;

export async function GetYoutubeVideoInfoFromURL(
  url: string,
): Promise<VideoInformation | "ERROR_HAPPENED"> {
  const videoInfoUrl = "https://www.youtube.com/oembed?url=" + url;

  try {
    const response = await fetch(videoInfoUrl);
    const data = (await response.json()) as VideoInformation;

    const cleanedData = decodeURIComponent(JSON.stringify(data));
    const dataObj = (await JSON.parse(cleanedData)) as VideoInformation;
    dataObj.url = url;

    // Get video ID
    // if it's a normal yt video
    if (url.includes("watch?v=")) {
      dataObj.video_id = url.split("watch?v=")[1]?.split("&")[0] ?? "";
    }
    // if it's a short
    else {
      dataObj.video_id = url.split("/")[-1] ?? "";
    }

    return dataObj;
  } catch {
    return "ERROR_HAPPENED";
  }
}
