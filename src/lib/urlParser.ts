/**
 * String has to start with https://www.youtube.com/api/timedtext?v=
 * it then gets the whole word in between the " ".
 *
 * The current youtube link looks like: {..., baseUrl: "https://www.youtube.com/api/timedtext?v=...."}
 */
const ytTranscriptLinkRegex =
  /\bhttps:\/\/www.youtube\.com\/api\/timedtext\?v=[a-zA-Z0-9&?=%./_\-\\\,]+/;

export function ReplaceUnicodeCharacters(inputString: string) {
  const unicodeRegex = /\\u([\dA-Fa-f]{4})/g;

  return inputString.replace(unicodeRegex, (match, group) => {
    const codePoint = parseInt(group as string, 16);
    return String.fromCharCode(codePoint);
  });
}

type YoutubeTranscriptLinkParserResponse =
  | { error: "COULD_NOT_PARSE" }
  | string;

export function ExtractYoutubeTrancriptLink(
  text: string,
): YoutubeTranscriptLinkParserResponse {
  try {
    const matches = ytTranscriptLinkRegex.exec(text);

    if (!matches) return "COULD_NOT_PARSE";

    const replacedString = ReplaceUnicodeCharacters(matches[0]);

    return replacedString;
  } catch {
    return "COULD_NOT_PARSE";
  }
}
