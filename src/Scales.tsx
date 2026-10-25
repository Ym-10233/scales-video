// Scales.tsx
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ---------- 音阶数据（半音偏移，0 = 根音）----------
type Scale = {
  name: string;
  nameEn: string;
  color: string;
  intervals: number[];
  formula: string;
};

const SCALES: Scale[] = [
  {
    name: "自然大调",
    nameEn: "Major",
    color: "#F5C542",
    intervals: [0, 2, 4, 5, 7, 9, 11],
    formula: "全 全 半 全 全 全 半",
  },
  {
    name: "自然小调",
    nameEn: "Natural Minor",
    color: "#5B8DEF",
    intervals: [0, 2, 3, 5, 7, 8, 10],
    formula: "全 半 全 全 半 全 全",
  },
  {
    name: "和声小调",
    nameEn: "Harmonic Minor",
    color: "#A78BFA",
    intervals: [0, 2, 3, 5, 7, 8, 11],
    formula: "全 半 全 全 半 增二 半",
  },
  {
    name: "五声音阶",
    nameEn: "Pentatonic",
    color: "#34D399",
    intervals: [0, 2, 4, 7, 9],
    formula: "宫 商 角 徵 羽",
  },
  {
    name: "布鲁斯音阶",
    nameEn: "Blues",
    color: "#F97316",
    intervals: [0, 3, 5, 6, 7, 10],
    formula: "小三度 · 大二度 · 小二度 · 小二度 · 小三度 · 大二度",
  },
];

// ---------- 音程名称（相对根音的半音数）----------
const INTERVAL_NAMES: Record<number, string> = {
  0: "根音",
  1: "小二度",
  2: "大二度",
  3: "小三度",
  4: "大三度",
  5: "纯四度",
  6: "增四度 / 减五度",
  7: "纯五度",
  8: "小六度",
  9: "大六度",
  10: "小七度",
  11: "大七度",
};

const WHITE_KEY_SEMITONES = [0, 2, 4, 5, 7, 9, 11];
const TOTAL_KEYS = 12;

const ScaleCard: React.FC<{ scale: Scale; index: number }> = ({
  scale,
  index,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: frame - index * 18,
    fps,
    config: { damping: 16, stiffness: 120, mass: 0.7 },
  });

  const translateY = interpolate(enter, [0, 1], [60, 0]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        marginBottom: 44,
        padding: "28px 36px",
        borderRadius: 20,
        background: "rgba(255,255,255,0.06)",
        border: `1px solid ${scale.color}44`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px ${scale.color}22`,
      }}
    >
      {/* 音阶标题 */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 14,
          marginBottom: 20,
        }}
      >
        <span
          style={{
            color: scale.color,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          {scale.name}
        </span>
        <span style={{ color: "#8899AA", fontSize: 16 }}>
          {scale.nameEn}
        </span>
        <span
          style={{
            marginLeft: "auto",
            color: "#667788",
            fontSize: 14,
            fontFamily: "monospace",
          }}
        >
          {scale.formula}
        </span>
      </div>

      {/* 钢琴卷帘 */}
      <PianoRoll scale={scale} parentEnter={enter} />

      {/* 音程标签 */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px 18px",
          marginTop: 18,
        }}
      >
        {scale.intervals.map((semi, i) => {
          const noteEnter = spring({
            frame: frame - index * 18 - 12 - i * 4,
            fps,
            config: { damping: 18, stiffness: 200 },
          });
          return (
            <span
              key={semi}
              style={{
                opacity: interpolate(noteEnter, [0, 1], [0, 1]),
                color: scale.color,
                fontSize: 13,
                fontFamily: "monospace",
                padding: "3px 10px",
                borderRadius: 999,
                background: `${scale.color}18`,
                border: `1px solid ${scale.color}33`,
              }}
            >
              {i + 1}. {INTERVAL_NAMES[semi] ?? `${semi}半音`}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const PianoRoll: React.FC<{ scale: Scale; parentEnter: number }> = ({
  scale,
  parentEnter,
}) => {
  const frame = useCurrentFrame();
  const keyWidth = 46;
  const whiteKeyHeight = 90;
  const blackKeyHeight = 58;

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        height: whiteKeyHeight,
        width: keyWidth * 7,
        borderRadius: 10,
        overflow: "hidden",
        background: "#0E1318",
      }}
    >
      {/* 白键 */}
      {WHITE_KEY_SEMITONES.map((semi, i) => {
        const active = scale.intervals.includes(semi);
        const glow = active
          ? interpolate(parentEnter, [0, 0.6, 1], [0, 1, 0.85])
          : 0;
        return (
          <div
            key={semi}
            style={{
              flex: 1,
              height: "100%",
              borderRight: i < 6 ? "1px solid #1C242C" : "none",
              background: active
                ? `linear-gradient(180deg, ${scale.color} 0%, ${scale.color}CC 100%)`
                : "#F0F4F8",
              boxShadow: active
                ? `inset 0 0 ${18 * glow}px ${scale.color}88, 0 0 24px ${scale.color}${Math.round(
                    glow * 120
                  ).toString(16).padStart(2, "0")}`
                : "inset 0 -2px 4px rgba(0,0,0,0.2)",
              transition: "background 0.3s",
            }}
          />
        );
      })}

      {/* 黑键 */}
      {Array.from({ length: TOTAL_KEYS }).map((_, semi) => {
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
              borderRadius: "0 0 6px 6px",
              border: "1px solid #0A0E12",
              zIndex: 2,
              boxShadow: active ? `0 0 16px ${scale.color}99` : "none",
            }}
          />
        );
      })}
    </div>
  );
};

export const ScalesVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const bgHue = interpolate(frame, [0, durationInFrames], [220, 280]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, hsl(${bgHue}, 30%, 8%) 0%, #0A0E14 100%)`,
        padding: "70px 90px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
        justifyContent: "center",
      }}
    >
      {/* 标题 */}
      <div
        style={{
          opacity: titleOpacity,
          marginBottom: 48,
          display: "flex",
          alignItems: "baseline",
          gap: 18,
        }}
      >
        <span
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: "#E8EDF2",
            letterSpacing: -1,
          }}
        >
          各种不同的音阶
        </span>
        <span style={{ fontSize: 22, color: "#556677", fontWeight: 400 }}>
          Scales，以 C 为根音
        </span>
      </div>

      {/* 音阶卡片列表 */}
      {SCALES.map((scale, i) => (
        <ScaleCard key={scale.name} scale={scale} index={i} />
      ))}
    </AbsoluteFill>
  );
};
