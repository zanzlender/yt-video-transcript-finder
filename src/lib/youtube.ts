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

type VideoInformation = {
  title: string;
  author_name: string;
  author_url: string;
  type: string;
  height: number;
  width: number;
  version: string;
  provider_name: string;
  provider_url: string;
  thumbnail_height: number;
  thumbnail_width: number;
  thumbnail_url: string;
  html: string;
  url: string;
  video_id: string;
};

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
      dataObj.video_id = url.split("watch?v=")[1] ?? "";
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
