// scales-data.ts
export type Scale = {
  name: string;
  nameEn: string;
  color: string;
  intervals: number[]; // 相对根音的半音偏移
  formula: string;
};

export const SCALES: Scale[] = [
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

export const INTERVAL_NAMES: Record<number, string> = {
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

export const WHITE_KEY_SEMITONES = [0, 2, 4, 5, 7, 9, 11];
