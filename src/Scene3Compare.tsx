// Scene3Compare.tsx
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SCALES, WHITE_KEY_SEMITONES, INTERVAL_NAMES } from "./scales-data";

const MiniKeyboard: React.FC<{
  scale: (typeof SCALES)[0];
  delay: number;
}> = ({ scale, delay }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const enter = spring({
    frame: frame - delay,
    fps,
    config: { damping: 16, stiffness: 110 },
  });

  const keyboardWidth = width * 0.34;
  const keyWidth = keyboardWidth / 7;
  const whiteKeyHeight = height * 0.12;

  return (
    <div
      style={{
        opacity: interpolate(enter, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(enter, [0, 1], [50, 0])}px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: height * 0.02,
      }}
    >
      <div style={{ fontSize: width * 0.018, fontWeight: 700, color: scale.color }}>
        {scale.name}
      </div>
      <div
        style={{
          position: "relative",
          display: "flex",
          width: keyboardWidth,
          height: whiteKeyHeight,
          borderRadius: width * 0.006,
          overflow: "hidden",
          background: "#0E1318",
        }}
      >
        {WHITE_KEY_SEMITONES.map((semi, i) => {
          const active = scale.intervals.includes(semi);
          return (
            <div
              key={semi}
              style={{
                flex: 1,
                borderRight: i < 6 ? "1px solid #1C242C" : "none",
                background: active ? scale.color : "#F0F4F8",
                boxShadow: active ? `0 0 16px ${scale.color}66` : "none",
              }}
            />
          );
        })}
        {Array.from({ length: 12 }).map((_, semi) => {
          if (WHITE_KEY_SEMITONES.includes(semi)) return null;
          const whiteBefore = WHITE_KEY_SEMITONES.filter((w) => w < semi).length;
          const left = whiteBefore * keyWidth - keyWidth * 0.3;
          const active = scale.intervals.includes(semi);
          return (
            <div
              key={semi}
              style={{
                position: "absolute",
                left,
                top: 0,
                width: keyWidth * 0.6,
                height: whiteKeyHeight * 0.62,
                background: active ? scale.color : "#1A2028",
                borderRadius: "0 0 3px 3px",
                zIndex: 2,
              }}
            />
          );
        })}
      </div>
      <div
        style={{
          fontSize: width * 0.01,
          color: "#8899AA",
          fontFamily: "monospace",
          textAlign: "center",
          maxWidth: keyboardWidth,
        }}
      >
        {scale.formula}
      </div>
    </div>
  );
};

export const Scene3Compare: React.FC = () => {
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  const pentatonic = SCALES[3];
  const blues = SCALES[4];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(200deg, #0F141A 0%, #0A0E13 100%)",
        justifyContent: "center",
        alignItems: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif',
        gap: height * 0.06,
      }}
    >
      <div style={{ opacity: titleOpacity, textAlign: "center" }}>
        <div style={{ fontSize: width * 0.032, fontWeight: 800, color: "#E8EDF2" }}>
          五声 · 布鲁斯
        </div>
        <div style={{ fontSize: width * 0.013, color: "#667788", marginTop: height * 0.01 }}>
          更少的音，更强的色彩
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: width * 0.08,
          justifyContent: "center",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <MiniKeyboard scale={pentatonic} delay={15} />
        <MiniKeyboard scale={blues} delay={40} />
      </div>
    </AbsoluteFill>
  );
};
