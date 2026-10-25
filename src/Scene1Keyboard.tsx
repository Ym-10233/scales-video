// Scene1Keyboard.tsx
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SCALES, WHITE_KEY_SEMITONES, INTERVAL_NAMES } from "./scales-data";

export const Scene1Keyboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const scale = SCALES[0]; // 自然大调

  // 标题淡入
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 键盘整体入场
  const keyboardEnter = spring({
    frame: frame - 10,
    fps,
    config: { damping: 16, stiffness: 120 },
  });

  // 音程标签依次出现
  const labelEnter = (index: number) =>
    spring({
      frame: frame - 20 - index * 6,
      fps,
      config: { damping: 18, stiffness: 200 },
    });

  // 布局：键盘宽度占画面 60%，高度按比例
  const keyboardWidth = width * 0.6;
  const keyWidth = keyboardWidth / 7;
  const whiteKeyHeight = height * 0.16;
  const blackKeyHeight = whiteKeyHeight * 0.62;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(160deg, #0B0F14 0%, #12181F 100%)",
        justifyContent: "center",
        alignItems: "center",
        padding: width * 0.08,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif',
      }}
    >
      <div style={{ opacity: titleOpacity, textAlign: "center", marginBottom: height * 0.04 }}>
        <div style={{ fontSize: width * 0.035, fontWeight: 800, color: "#E8EDF2" }}>
          自然大调 · Major
        </div>
        <div style={{ fontSize: width * 0.016, color: "#667788", marginTop: height * 0.01 }}>
          {scale.formula}
        </div>
      </div>

      {/* 钢琴卷帘 */}
      <div
        style={{
          opacity: interpolate(keyboardEnter, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(keyboardEnter, [0, 1], [40, 0])}px)`,
          position: "relative",
          display: "flex",
          width: keyboardWidth,
          height: whiteKeyHeight,
          borderRadius: width * 0.008,
          overflow: "hidden",
          background: "#0E1318",
          boxShadow: `0 ${height * 0.02}px ${height * 0.06}px rgba(0,0,0,0.6)`,
        }}
      >
        {WHITE_KEY_SEMITONES.map((semi, i) => {
          const active = scale.intervals.includes(semi);
          const glow = active
            ? interpolate(keyboardEnter, [0, 0.6, 1], [0, 1, 0.85])
            : 0;
          return (
            <div
              key={semi}
              style={{
                flex: 1,
                borderRight: i < 6 ? "1px solid #1C242C" : "none",
                background: active
                  ? `linear-gradient(180deg, ${scale.color} 0%, ${scale.color}CC 100%)`
                  : "#F0F4F8",
                boxShadow: active
                  ? `inset 0 0 ${18 * glow}px ${scale.color}88, 0 0 24px ${scale.color}${Math.round(
                      glow * 100
                    )
                      .toString(16)
                      .padStart(2, "0")}`
                  : "inset 0 -2px 4px rgba(0,0,0,0.2)",
              }}
            />
          );
        })}

        {/* 黑键 */}
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
                height: blackKeyHeight,
                background: active
                  ? `linear-gradient(180deg, ${scale.color} 0%, ${scale.color}AA 100%)`
                  : "#1A2028",
                borderRadius: `0 0 ${width * 0.004}px ${width * 0.004}px`,
                border: "1px solid #0A0E12",
                zIndex: 2,
                boxShadow: active ? `0 0 16px ${scale.color}99` : "none",
              }}
            />
          );
        })}
      </div>

      {/* 音程标签 */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: `${height * 0.012}px ${width * 0.02}px`,
          marginTop: height * 0.04,
          width: keyboardWidth,
        }}
      >
        {scale.intervals.map((semi, i) => (
          <span
            key={semi}
            style={{
              opacity: interpolate(labelEnter(i), [0, 1], [0, 1]),
              color: scale.color,
              fontSize: width * 0.012,
              fontFamily: "monospace",
              padding: `${height * 0.006}px ${width * 0.012}px`,
              borderRadius: 999,
              background: `${scale.color}18`,
              border: `1px solid ${scale.color}33`,
            }}
          >
            {i + 1}. {INTERVAL_NAMES[semi] ?? `${semi}半音`}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
