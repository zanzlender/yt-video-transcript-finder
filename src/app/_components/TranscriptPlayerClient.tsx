"use client";

import React, { useRef } from "react";
import PlyrVideoPlayer from "./VideoPlayer";
import type { APITypes } from "plyr-react";

const TranscriptPlayerClient = ({ url }: { url: string }) => {
  const videoFrameRef = useRef<APITypes>(null);

  return (
    <>
      <PlyrVideoPlayer
        ref={videoFrameRef}
        source={{
          type: "video",
          title: "Some video",
          sources: [
            {
              src: url,
              provider: "youtube",
            },
          ],
        }}
        options={{
          controls: [
            "play",
            "progress",
            "current-time",
            "mute",
            "volume",
            "settings",
          ],
          volume: 0.5,
        }}
      />
    </>
  );
};

export default TranscriptPlayerClient;
