import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { SCALES } from "./scales-data";

const TwelveBars: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scales = [SCALES[0], SCALES[1], SCALES[2]];
  const segmentDuration = fps * 4.2;

  const activeIndex = Math.min(Math.floor(frame / segmentDuration), scales.length - 1);
  const localFrame = frame - activeIndex * segmentDuration;
  const activeScale = scales[activeIndex];

  // 【修改点1】用旋转整个场景组来代替移动摄像机
  const groupRotation = (frame / fps) * 0.18;

  return (
    // 【修改点2】把所有的 3D 元素包在一个 <group> 里，给它加上旋转
    <group rotation={[0, groupRotation, 0]}>
      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 8, 5]} intensity={0.9} />
      <pointLight position={[-4, 3, -4]} intensity={0.5} color={activeScale.color} />

      {Array.from({ length: 12 }).map((_, semi) => {
        const active = activeScale.intervals.includes(semi);
        const baseHeight = active ? 2.2 : 0.35;

        const enter = spring({
          frame: localFrame,
          fps,
          config: { damping: 14, stiffness: 90 },
        });
        const height = active
          ? interpolate(enter, [0, 1], [0.35, baseHeight])
          : interpolate(enter, [0, 1], [baseHeight, 0.35]);

        const x = (semi - 5.5) * 0.42;

        return (
          <mesh key={semi} position={[x, height / 2, 0]}>
            <boxGeometry args={[0.3, height, 0.3]} />
            <meshStandardMaterial
              color={active ? activeScale.color : "#2A3340"}
              emissive={active ? activeScale.color : "#000000"}
              emissiveIntensity={active ? 0.45 : 0}
              metalness={0.3}
              roughness={0.4}
            />
          </mesh>
        );
      })}

      <gridHelper args={[8, 12, "#1E2A38", "#1E2A38"]} position={[0, 0, 0]} />
    </group>
  );
};

export const Scene2Three: React.FC = () => {
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(circle at 50% 40%, #141C26 0%, #0A0E13 80%)",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif',
      }}
    >
      <div
        style={{
          position: "absolute",
          top: height * 0.08,
          opacity: titleOpacity,
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <div style={{ fontSize: width * 0.028, fontWeight: 700, color: "#E8EDF2" }}>
          半音结构 · 3D 音柱
        </div>
        <div style={{ fontSize: width * 0.012, color: "#667788", marginTop: height * 0.008 }}>
          高柱 = 音阶包含该半音；矮柱 = 不包含
        </div>
      </div>

      {/* 【修改点3】把摄像机固定在这里，不要写在里面去动态挂载 */}
      <ThreeCanvas
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0 }}
        camera={{ fov: 45, position: [0, 4.5, 6] }}
        gl={{ antialias: true }}
      >
        <TwelveBars />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
