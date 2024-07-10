"use client";

import React, { type ForwardedRef, forwardRef } from "react";
import Plyr, { usePlyr, type APITypes, type PlyrProps } from "plyr-react";
import "plyr-react/plyr.css";

type Props = PlyrProps;

const PlyrVideoPlayer = forwardRef(
  (props: Props, ref: ForwardedRef<APITypes>) => {
    const { source, options = null, ...rest } = props;

    const raptorRef = usePlyr(ref, {
      source,
      options,
    });
    return <video ref={raptorRef} className="plyr-react plyr" {...rest} />;
  },
);

PlyrVideoPlayer.displayName = "PlyrVideoPlayer";

export default PlyrVideoPlayer;
