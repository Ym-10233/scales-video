// ScalesComposition.tsx
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  Series,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio as SfxAudio } from "@remotion/sfx";
import { Scene1Keyboard } from "./Scene1Keyboard";
import { Scene2Three } from "./Scene2Three";
import { Scene3Compare } from "./Scene3Compare";

// 字幕：按时间窗硬编码
type Subtitle = { from: number; to: number; text: string; color: string };

const SUBTITLES: Subtitle[] = [
  { from: 0, to: 90, text: "七个音，全全半全全全半", color: "#F5C542" },
  { from: 90, to: 180, text: "黑键与白键，共同构成十二个半音", color: "#F5C542" },
  { from: 240, to: 330, text: "小调把三度、六度、七度降低", color: "#5B8DEF" },
  { from: 330, to: 420, text: "和声小调再升高七级，制造导音张力", color: "#A78BFA" },
  { from: 480, to: 570, text: "五声音阶省略半音，干净而古老", color: "#34D399" },
  { from: 570, to: 660, text: "布鲁斯加入“蓝调音”，味道立刻不同", color: "#F97316" },
];

const SubtitleLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const active = SUBTITLES.find((s) => frame >= s.from && frame < s.to);

  if (!active) return null;

  const localFrame = frame - active.from;
  const opacity = interpolate(localFrame, [0, 8, 24, 32], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: height * 0.06,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity,
        zIndex: 100,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontSize: width * 0.018,
          color: "#E8EDF2",
          background: "rgba(8, 12, 16, 0.82)",
          padding: `${height * 0.012}px ${width * 0.022}px`,
          borderRadius: width * 0.008,
          border: `1px solid ${active.color}44`,
          backdropFilter: "blur(8px)",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif',
        }}
      >
        {active.text}
      </div>
    </div>
  );
};

export const ScalesComposition: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();

  // 30s @ 30fps = 900 frames
  const scene1Duration = Math.round(fps * 8);   // 240
  const scene2Duration = Math.round(fps * 14);  // 420
  const scene3Duration = Math.round(fps * 8);   // 240

  return (
    <AbsoluteFill style={{ background: "#0A0E13" }}>
      {/* 背景音乐：全片淡入淡出 */}
      <Audio
        src="https://remotion.media/music.mp3"
        volume={(frame) =>
          interpolate(
            frame,
            [0, fps * 1.5, durationInFrames - fps * 1.5, durationInFrames],
            [0, 0.28, 0.28, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          )
        }
      />

      {/* 场景切换音效 */}
      <Sequence from={0} durationInFrames={30}>
        <SfxAudio src="https://remotion.media/whoosh.wav" volume={0.7} />
      </Sequence>
      <Sequence from={scene1Duration} durationInFrames={24}>
        <SfxAudio src="https://remotion.media/whoosh.wav" volume={0.7} />
      </Sequence>
      <Sequence from={scene1Duration + scene2Duration} durationInFrames={24}>
        <SfxAudio src="https://remotion.media/whoosh.wav" volume={0.7} />
      </Sequence>

      {/* 音符强调音效：场景 2 每组音阶切换时 */}
      <Sequence from={scene1Duration} durationInFrames={20}>
        <SfxAudio src="https://remotion.media/switch.wav" volume={0.9} />
      </Sequence>
      <Sequence from={scene1Duration + Math.round(fps * 4.2)} durationInFrames={20}>
        <SfxAudio src="https://remotion.media/switch.wav" volume={0.9} />
      </Sequence>
      <Sequence from={scene1Duration + Math.round(fps * 8.4)} durationInFrames={20}>
        <SfxAudio src="https://remotion.media/switch.wav" volume={0.9} />
      </Sequence>

      {/* 场景 3 布鲁斯出现时“叮”一声 */}
      <Sequence from={scene1Duration + scene2Duration + Math.round(fps * 1.2)} durationInFrames={30}>
        <SfxAudio src="https://remotion.media/ding.wav" volume={0.8} />
      </Sequence>

      {/* 三幕 Series */}
      <Series>
        <Series.Sequence durationInFrames={scene1Duration}>
          <Scene1Keyboard />
        </Series.Sequence>
        <Series.Sequence durationInFrames={scene2Duration}>
          <Scene2Three />
        </Series.Sequence>
        <Series.Sequence durationInFrames={scene3Duration}>
          <Scene3Compare />
        </Series.Sequence>
      </Series>

      {/* 字幕层 */}
      <SubtitleLayer />
    </AbsoluteFill>
  );
};
