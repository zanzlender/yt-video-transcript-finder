import React, { type ForwardedRef, forwardRef } from "react";
import Plyr, { type APITypes, type PlyrProps } from "plyr-react";
import "plyr-react/plyr.css";

type Props = PlyrProps;

const PlyrVideoPlayer = forwardRef(
  (props: Props, ref: ForwardedRef<APITypes> | undefined) => {
    return <Plyr ref={ref} {...props} />;
  },
);

PlyrVideoPlayer.displayName = "PlyrVideoPlayer";

export default PlyrVideoPlayer;
