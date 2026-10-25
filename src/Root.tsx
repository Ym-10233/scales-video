import React from "react";
import { Composition } from "remotion";
import { ScalesComposition } from "./ScalesComposition";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Scales30s"
      component={ScalesComposition}
      durationInFrames={900} // 30s @ 30fps
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
