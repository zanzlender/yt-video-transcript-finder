import { XMLParser, type X2jOptions } from "fast-xml-parser";
import z from "zod";

const config: Partial<X2jOptions> = {
  ignoreAttributes: false,
  attributeNamePrefix: "",
  allowBooleanAttributes: true,
};

/**
 * ! Potential breaking changes
 */
type TranscriptXMLFormat2 = {
  transcript: {
    text: Array<{ "#text": string; start: string; dur: string }>;
    [key: string]: Record<string, unknown> | Array<Record<string, unknown>>;
  };
  [key: string]: Record<string, unknown>;
};

export const ZodTranscriptXMLFormat = z.object({
  id: z.number(),
  text: z.array(
    z.object({
      "#text": z.string(),
      start: z.string(),
      formatedStart: z.string(),
      dur: z.string(),
    }),
  ),
});

const test = `
<?xml version="1.0" encoding="utf-8" ?>
<transcript>
    <text start="460.16" dur="5.719">up nerds it&amp;#39;s the time to get started</text>
    <text start="463.16" dur="4.92">yall already do an end a hype train</text>
    <text start="465.879" dur="4.521">before I even went live officially</text>
    <text start="468.08" dur="2.32">freaking</text>
    <a href="#">Hello</a>
</transcript>
`;

export type TranscriptXMLFormat = z.infer<typeof ZodTranscriptXMLFormat>;

const parser = new XMLParser(config);

export async function ParseXML(xml: string) {
  const data = parser.parse(xml) as TranscriptXMLFormat;

  const dataString = JSON.stringify(data);
  const cleanedData = DecodeHtmlEntity(dataString);
  const cleanedDataObj = (await JSON.parse(
    cleanedData,
  )) as TranscriptXMLFormat2;

  const cleanedDataObj2: TranscriptXMLFormat2 = {
    transcript: {
      text: cleanedDataObj.transcript.text.map((x) => {
        return {
          "#text": x["#text"]?.toString() ?? "",
          dur: x.dur ?? 0,
          start: x.start ?? 0,
        };
      }),
    },
  };

  return cleanedDataObj2;
  /* console.log(data["transcript"]["text"][0]);

  const checkTypeResult = ZodTranscriptXMLFormat.safeParse(data);

  if (checkTypeResult.success) {
    return checkTypeResult.data.;
  } else {
    return checkTypeResult.error;
  } */
}

/**
 * Replaces encoded characters in XML which are not UNICODE (&....)
 * e.g. from &#39; to apostrophe '
 */
export function DecodeHtmlEntity(str: string) {
  return str.replace(/&#(\d+);/g, function (match, dec) {
    return String.fromCharCode(dec as number);
  });
}
