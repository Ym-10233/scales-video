import React from "react";
import { Composition } from "remotion";
import { ScalesVideo } from "./Scales";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="ScalesVideo"
      component={ScalesVideo}
      durationInFrames={330}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
