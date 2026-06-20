import type {CSSProperties} from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const PALETTE = {
  ink: "#161018",
  ocean: "#12bfd3",
  oceanDeep: "#087aa3",
  oceanLight: "#7ef7ff",
  foam: "#f5ffff",
  sand: "#ffd86c",
  sandDark: "#e6a93f",
  sunset: "#ff8438",
  sunsetDeep: "#ff4e8b",
  sky: "#66d9ff",
  pink: "#ff39bf",
  purple: "#8b35ff",
  electricPurple: "#6534ff",
  orange: "#ff8b22",
  green: "#42f269",
  yellow: "#ffe94a",
  blue: "#2f8dff",
  lantern: "#ffd15c",
  tent: "#fff1c4",
  tentShade: "#f0b85e",
  white: "#fff8ea",
};

const shirtColors = [
  "#ff39bf",
  "#2f8dff",
  "#42f269",
  "#ffe94a",
  "#ff8b22",
  "#8b35ff",
  "#12bfd3",
  "#ff5b5b",
  "#fff8ea",
  "#3dffdf",
];

const pantsColors = [
  "#173bff",
  "#221a42",
  "#ff6b2b",
  "#25a75a",
  "#f0469d",
  "#6d46ff",
  "#fff8ea",
  "#00a6b7",
];

const skinColors = ["#ffd1a6", "#f6b379", "#d98c59", "#8c553d", "#ffe0bd"];
const hairColors = ["#29160d", "#5c3119", "#d78329", "#121212", "#7f4eff"];
const neonColors = [
  PALETTE.pink,
  PALETTE.purple,
  PALETTE.green,
  PALETTE.yellow,
  PALETTE.blue,
  PALETTE.oceanLight,
  PALETTE.orange,
];

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

type CharacterStyle = "2d" | "3d";

const seconds = (value: number, fps: number) => Math.round(value * fps);

const seeded = (seed: number) => {
  const value = Math.sin(seed * 742.91) * 10000;
  return value - Math.floor(value);
};

const pick = <T,>(items: T[], seed: number) =>
  items[Math.floor(seeded(seed) * items.length) % items.length];

const lineStyle = (width = 5): CSSProperties => ({
  border: `${width}px solid ${PALETTE.ink}`,
  boxSizing: "border-box",
});

const dancers = Array.from({length: 340}, (_, index) => {
  const ySeed = seeded(index + 4.2);
  const y = 325 + ySeed * 520;
  const depth = (y - 325) / 520;
  const laneWidth = 520 + depth * 1080;
  const x = 960 + (seeded(index + 18.8) - 0.5) * laneWidth;
  const scale = 0.36 + depth * 0.82 + seeded(index + 22.1) * 0.12;

  return {
    id: index,
    x,
    y,
    scale,
    shirt: pick(shirtColors, index + 1),
    pants: pick(pantsColors, index + 2),
    skin: pick(skinColors, index + 3),
    hair: pick(hairColors, index + 4),
    accent: pick(neonColors, index + 5),
    phase: seeded(index + 6) * Math.PI * 2,
    danceSpeed: 1.35 + seeded(index + 8) * 1.7,
    lean: (seeded(index + 9) - 0.5) * 16,
    hat: seeded(index + 10) > 0.78,
    glasses: seeded(index + 11) > 0.84,
    flag: index % 31 === 0,
    phone: index % 43 === 0,
    whiteLook: seeded(index + 12) > 0.86,
  };
}).sort((a, b) => a.y - b.y);

const confetti = Array.from({length: 430}, (_, index) => ({
  id: index,
  x: seeded(index + 100) * 1920,
  y: seeded(index + 200) * 1180 - 180,
  speed: 1.6 + seeded(index + 300) * 4.8,
  drift: -28 + seeded(index + 400) * 56,
  size: 5 + seeded(index + 500) * 13,
  color: pick(neonColors, index + 600),
  delay: seeded(index + 700) * 140,
  shape: seeded(index + 800) > 0.5 ? "circle" : "rect",
}));

const balloons = Array.from({length: 24}, (_, index) => ({
  id: index,
  x: 100 + seeded(index + 900) * 1720,
  y: 165 + seeded(index + 901) * 520,
  color: pick(neonColors, index + 902),
  size: 26 + seeded(index + 903) * 22,
  speed: 0.38 + seeded(index + 904) * 0.75,
  phase: seeded(index + 905) * Math.PI * 2,
}));

const sparkles = Array.from({length: 130}, (_, index) => ({
  id: index,
  x: seeded(index + 1100) * 1920,
  y: 70 + seeded(index + 1200) * 850,
  size: 4 + seeded(index + 1300) * 8,
  color: pick([PALETTE.foam, PALETTE.yellow, PALETTE.pink, PALETTE.green], index + 1400),
  phase: seeded(index + 1500) * Math.PI * 2,
}));

const vipGuests = Array.from({length: 34}, (_, index) => ({
  id: index,
  x: 30 + seeded(index + 1700) * 320,
  y: 96 + seeded(index + 1800) * 170,
  scale: 0.42 + seeded(index + 1900) * 0.2,
  shirt: pick(shirtColors, index + 2000),
  skin: pick(skinColors, index + 2100),
  phase: seeded(index + 2200) * Math.PI * 2,
}));

function CameraWorld({children}: {children: React.ReactNode}) {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const total = durationInFrames - 1;
  const intro = seconds(5, fps);
  const crowd = seconds(10, fps);
  const vip = seconds(15, fps);
  const stage = seconds(20, fps);

  const scale = interpolate(
    frame,
    [0, intro, crowd, vip, stage, total],
    [1.42, 0.96, 1.42, 1.2, 1.32, 0.87],
    {
      ...clamp,
      easing: Easing.bezier(0.45, 0, 0.55, 1),
    },
  );
  const x = interpolate(
    frame,
    [0, intro, crowd, vip, stage, total],
    [0, 0, -340, 280, 0, 0],
    {
      ...clamp,
      easing: Easing.bezier(0.45, 0, 0.55, 1),
    },
  );
  const y = interpolate(
    frame,
    [0, intro, crowd, vip, stage, total],
    [-245, 5, -170, -120, -300, 30],
    {
      ...clamp,
      easing: Easing.bezier(0.45, 0, 0.55, 1),
    },
  );
  const rotate = interpolate(
    frame,
    [0, intro, crowd, vip, stage, total],
    [-1.6, 0.2, -1.1, 0.9, 0.2, 0],
    clamp,
  );

  return (
    <AbsoluteFill
      style={{
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${rotate}deg)`,
        transformOrigin: "50% 55%",
      }}
    >
      {children}
    </AbsoluteFill>
  );
}

function Sky() {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const glow = interpolate(Math.sin((frame / fps) * Math.PI * 1.35), [-1, 1], [0.55, 1]);

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background:
          "linear-gradient(180deg, #ff7b3e 0%, #ff54a8 16%, #74ddff 46%, #eaf8ff 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 1330,
          top: 88,
          width: 260,
          height: 260,
          borderRadius: "50%",
          background: `radial-gradient(circle, #fff58a 0%, ${PALETTE.orange} 48%, rgba(255,57,191,0.08) 74%)`,
          boxShadow: `0 0 ${120 * glow}px rgba(255,233,74,0.9), 0 0 220px rgba(255,57,191,0.45)`,
          ...lineStyle(6),
        }}
      />
      {Array.from({length: 9}).map((_, index) => (
        <CartoonCloud
          key={index}
          x={-220 + index * 270 + Math.sin(frame / 75 + index) * 20}
          y={74 + seeded(index + 40) * 210}
          scale={0.62 + seeded(index + 41) * 0.5}
          color={index % 2 === 0 ? "#ffffff" : "#dff9ff"}
        />
      ))}
      <Fireworks />
      <SparkleField />
    </AbsoluteFill>
  );
}

function CartoonCloud({
  x,
  y,
  scale,
  color,
}: {
  x: number;
  y: number;
  scale: number;
  color: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 230,
        height: 86,
        transform: `scale(${scale})`,
        transformOrigin: "left top",
        opacity: 0.78,
      }}
    >
      {[0, 1, 2, 3].map((part) => (
        <div
          key={part}
          style={{
            position: "absolute",
            left: 20 + part * 46,
            top: part === 1 ? 3 : part === 2 ? 0 : 22,
            width: part === 1 ? 88 : 72,
            height: part === 1 ? 72 : 56,
            borderRadius: "50%",
            background: color,
            ...lineStyle(4),
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: 18,
          right: 10,
          bottom: 0,
          height: 46,
          borderRadius: 28,
          background: color,
          ...lineStyle(4),
        }}
      />
    </div>
  );
}

function Fireworks() {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const bursts = [
    {x: 278, y: 150, color: PALETTE.pink, offset: 0},
    {x: 565, y: 88, color: PALETTE.green, offset: 1.2},
    {x: 1110, y: 162, color: PALETTE.yellow, offset: 2.3},
    {x: 1630, y: 205, color: PALETTE.purple, offset: 3.5},
  ];

  return (
    <>
      {bursts.map((burst, burstIndex) => {
        const loop = ((frame / fps + burst.offset) % 4.4) / 4.4;
        const radius = interpolate(loop, [0, 0.55, 1], [8, 116, 160], clamp);
        const opacity = interpolate(loop, [0, 0.14, 0.65, 1], [0, 1, 0.82, 0], clamp);

        return (
          <div
            key={burstIndex}
            style={{
              position: "absolute",
              left: burst.x,
              top: burst.y,
              width: 1,
              height: 1,
              opacity,
            }}
          >
            {Array.from({length: 18}).map((_, ray) => {
              const angle = (ray / 18) * Math.PI * 2 + seeded(ray + burstIndex) * 0.22;
              return (
                <div
                  key={ray}
                  style={{
                    position: "absolute",
                    left: Math.cos(angle) * radius,
                    top: Math.sin(angle) * radius,
                    width: 46,
                    height: 8,
                    borderRadius: 20,
                    background: burst.color,
                    boxShadow: `0 0 20px ${burst.color}`,
                    transform: `translate(-50%, -50%) rotate(${angle}rad)`,
                    ...lineStyle(2),
                  }}
                />
              );
            })}
          </div>
        );
      })}
    </>
  );
}

function SparkleField() {
  const frame = useCurrentFrame();
  return (
    <>
      {sparkles.map((sparkle) => {
        const twinkle = interpolate(
          Math.sin(frame / 11 + sparkle.phase),
          [-1, 1],
          [0.14, 1],
        );

        return (
          <div
            key={sparkle.id}
            style={{
              position: "absolute",
              left: sparkle.x,
              top: sparkle.y,
              width: sparkle.size,
              height: sparkle.size,
              opacity: twinkle * 0.72,
              transform: `rotate(${frame * 2 + sparkle.id * 14}deg)`,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "45%",
                top: 0,
                width: "12%",
                height: "100%",
                borderRadius: 20,
                background: sparkle.color,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 0,
                top: "45%",
                width: "100%",
                height: "12%",
                borderRadius: 20,
                background: sparkle.color,
              }}
            />
          </div>
        );
      })}
    </>
  );
}

function SandAndBeach() {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: -160,
          right: -160,
          top: 248,
          height: 720,
          background:
            "linear-gradient(180deg, #ffec9a 0%, #ffd86c 42%, #f4b44c 100%)",
          borderTop: `7px solid ${PALETTE.ink}`,
          overflow: "hidden",
        }}
      >
        {Array.from({length: 74}).map((_, index) => {
          const x = seeded(index + 2500) * 2200;
          const y = seeded(index + 2600) * 675;
          const rotate = seeded(index + 2700) * 180;
          const color = pick(["#e8a948", "#fff0a8", "#ffc456"], index + 2800);
          return (
            <div
              key={index}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: 28 + seeded(index + 2900) * 54,
                height: 6,
                borderRadius: 20,
                background: color,
                opacity: 0.55,
                transform: `rotate(${rotate}deg) translateX(${Math.sin(frame / 45 + index) * 2}px)`,
              }}
            />
          );
        })}
        <FestivalPaths />
      </div>
    </AbsoluteFill>
  );
}

function FestivalPaths() {
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 700,
          top: -30,
          width: 250,
          height: 760,
          background: "rgba(255,255,255,0.25)",
          clipPath: "polygon(38% 0%, 62% 0%, 100% 100%, 0% 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 890,
          top: -18,
          width: 64,
          height: 745,
          opacity: 0.3,
          background:
            "repeating-linear-gradient(180deg, #fff8d0 0 18px, transparent 18px 40px)",
          transform: "rotate(10deg)",
        }}
      />
    </>
  );
}

function Ocean() {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const waveTime = frame / fps;

  return (
    <div
      style={{
        position: "absolute",
        left: -140,
        right: -140,
        top: 785,
        height: 315,
        overflow: "hidden",
        background: `linear-gradient(180deg, ${PALETTE.oceanLight} 0%, ${PALETTE.ocean} 34%, ${PALETTE.oceanDeep} 100%)`,
        borderTop: `8px solid ${PALETTE.ink}`,
        zIndex: 40,
      }}
    >
      {Array.from({length: 12}).map((_, index) => (
        <WaveLine
          key={index}
          index={index}
          y={18 + index * 24 + Math.sin(waveTime * 2 + index) * 7}
          shift={Math.sin(waveTime * 1.5 + index) * 70}
        />
      ))}
      {Array.from({length: 78}).map((_, index) => {
        const x = (seeded(index + 3100) * 2200 + frame * (0.7 + seeded(index + 3200))) % 2200;
        const y = 20 + seeded(index + 3300) * 265;
        const size = 8 + seeded(index + 3400) * 16;
        const opacity = interpolate(Math.sin(frame / 9 + index), [-1, 1], [0.16, 0.95]);

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: x - 120,
              top: y,
              width: size,
              height: size * 0.36,
              borderRadius: "50%",
              background: PALETTE.foam,
              opacity,
              transform: `rotate(${seeded(index + 3500) * 25 - 12}deg)`,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          left: -10,
          right: -10,
          top: -6,
          height: 28,
          background:
            "repeating-linear-gradient(90deg, #f8ffff 0 52px, #8ffaff 52px 92px, #f8ffff 92px 128px)",
          borderBottom: `5px solid ${PALETTE.ink}`,
          transform: `translateX(${Math.sin(waveTime * 2) * 18}px)`,
        }}
      />
    </div>
  );
}

function WaveLine({index, y, shift}: {index: number; y: number; shift: number}) {
  return (
    <svg
      viewBox="0 0 2200 70"
      preserveAspectRatio="none"
      style={{
        position: "absolute",
        left: -110 + shift,
        top: y,
        width: 2200,
        height: 70,
        opacity: interpolate(index, [0, 11], [0.86, 0.22], clamp),
      }}
    >
      <path
        d="M0 35 C80 0 160 70 240 35 S400 0 480 35 S640 70 720 35 S880 0 960 35 S1120 70 1200 35 S1360 0 1440 35 S1600 70 1680 35 S1840 0 1920 35 S2080 70 2200 35"
        fill="none"
        stroke={index % 2 ? PALETTE.foam : PALETTE.oceanLight}
        strokeWidth={10 - index * 0.35}
        strokeLinecap="round"
      />
      <path
        d="M0 35 C80 0 160 70 240 35 S400 0 480 35 S640 70 720 35 S880 0 960 35 S1120 70 1200 35 S1360 0 1440 35 S1600 70 1680 35 S1840 0 1920 35 S2080 70 2200 35"
        fill="none"
        stroke={PALETTE.ink}
        strokeWidth={2.5}
        strokeLinecap="round"
        opacity={0.52}
      />
    </svg>
  );
}

function Stage() {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pulse = interpolate(Math.sin((frame / fps) * Math.PI * 2.2), [-1, 1], [0.72, 1.28]);

  return (
    <div
      style={{
        position: "absolute",
        left: 472,
        top: 88,
        width: 976,
        height: 300,
        zIndex: 18,
      }}
    >
      <LaserShow />
      <div
        style={{
          position: "absolute",
          left: 72,
          top: 36,
          width: 832,
          height: 242,
          borderRadius: 18,
          background: "#202041",
          boxShadow: `0 0 ${54 * pulse}px rgba(255,57,191,0.75)`,
          ...lineStyle(7),
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 42,
            top: 42,
            width: 188,
            height: 138,
            borderRadius: 12,
            background: `linear-gradient(135deg, ${PALETTE.oceanLight}, ${PALETTE.purple})`,
            boxShadow: `0 0 28px ${PALETTE.oceanLight}`,
            ...lineStyle(5),
          }}
        >
          <PerformerSilhouettes offset={0} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 276,
            top: 26,
            width: 280,
            height: 168,
            borderRadius: 14,
            background: `radial-gradient(circle at 50% 44%, #ffe94a 0%, ${PALETTE.pink} 42%, ${PALETTE.electricPurple} 100%)`,
            boxShadow: `0 0 44px ${PALETTE.pink}`,
            ...lineStyle(5),
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 20,
              right: 20,
              top: 34,
              textAlign: "center",
              fontFamily: "Arial Black, Impact, sans-serif",
              fontSize: 30,
              lineHeight: 0.9,
              color: PALETTE.white,
              textShadow: `4px 4px 0 ${PALETTE.ink}`,
              letterSpacing: 1,
            }}
          >
            BEDOUIN
            <br />
            WHITE PARTY
          </div>
          <div
            style={{
              position: "absolute",
              left: 86,
              bottom: 16,
              width: 112,
              height: 12,
              borderRadius: 12,
              background: PALETTE.green,
              boxShadow: `0 0 20px ${PALETTE.green}`,
              ...lineStyle(2),
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            right: 42,
            top: 42,
            width: 188,
            height: 138,
            borderRadius: 12,
            background: `linear-gradient(135deg, ${PALETTE.orange}, ${PALETTE.pink})`,
            boxShadow: `0 0 28px ${PALETTE.orange}`,
            ...lineStyle(5),
          }}
        >
          <PerformerSilhouettes offset={1.4} />
        </div>
        <Equalizer />
      </div>
      <StageRoof />
      <StageBase />
      <Speakers />
      <ColorSmoke />
    </div>
  );
}

function StageRoof() {
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 20,
          top: 0,
          width: 936,
          height: 78,
          background: "#17162b",
          clipPath: "polygon(7% 0%, 93% 0%, 100% 100%, 0% 100%)",
          ...lineStyle(7),
        }}
      />
      {Array.from({length: 9}).map((_, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: 125 + index * 88,
            top: 14,
            width: 30,
            height: 42,
            borderRadius: 15,
            background: pick(neonColors, index),
            boxShadow: `0 0 26px ${pick(neonColors, index)}`,
            ...lineStyle(3),
          }}
        />
      ))}
    </>
  );
}

function StageBase() {
  return (
    <div
      style={{
        position: "absolute",
        left: 30,
        right: 30,
        top: 260,
        height: 72,
        borderRadius: 12,
        background:
          "repeating-linear-gradient(90deg, #ff39bf 0 60px, #8b35ff 60px 120px, #12bfd3 120px 180px, #42f269 180px 240px)",
        ...lineStyle(7),
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 24,
          height: 10,
          background: "rgba(255,255,255,0.58)",
        }}
      />
    </div>
  );
}

function Speakers() {
  return (
    <>
      {[0, 1].map((side) => (
        <div
          key={side}
          style={{
            position: "absolute",
            left: side === 0 ? 0 : 884,
            top: 78,
            width: 92,
            height: 210,
            borderRadius: 12,
            background: "#26243a",
            ...lineStyle(6),
          }}
        >
          {[0, 1, 2].map((unit) => (
            <div
              key={unit}
              style={{
                position: "absolute",
                left: 17,
                top: 18 + unit * 62,
                width: 56,
                height: 48,
                borderRadius: "50%",
                background: "#10101d",
                ...lineStyle(4),
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 14,
                  top: 11,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: pick(neonColors, unit + side * 6),
                }}
              />
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

function PerformerSilhouettes({offset}: {offset: number}) {
  const frame = useCurrentFrame();
  return (
    <>
      {Array.from({length: 3}).map((_, index) => {
        const lift = Math.sin(frame / 8 + offset + index) * 7;
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: 38 + index * 46,
              top: 62 + lift,
              width: 26,
              height: 58,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 7,
                top: 0,
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: PALETTE.ink,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 5,
                top: 15,
                width: 20,
                height: 34,
                borderRadius: "11px 11px 8px 8px",
                background: PALETTE.ink,
              }}
            />
          </div>
        );
      })}
    </>
  );
}

function Equalizer() {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: 128,
        right: 128,
        bottom: 16,
        height: 36,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: 7,
      }}
    >
      {Array.from({length: 56}).map((_, index) => {
        const height = interpolate(
          Math.sin(frame / (4.5 + seeded(index) * 3) + index),
          [-1, 1],
          [8, 36],
        );
        const color = pick(neonColors, index);

        return (
          <div
            key={index}
            style={{
              width: 6,
              height,
              borderRadius: 8,
              background: color,
              boxShadow: `0 0 10px ${color}`,
            }}
          />
        );
      })}
    </div>
  );
}

function LaserShow() {
  const frame = useCurrentFrame();
  return (
    <>
      {Array.from({length: 11}).map((_, index) => {
        const color = pick(neonColors, index + 20);
        const angle = -58 + index * 11 + Math.sin(frame / 18 + index) * 9;
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: 490,
              top: 90,
              width: 580,
              height: 18,
              borderRadius: 999,
              background: `linear-gradient(90deg, ${color}, transparent)`,
              opacity: 0.56,
              transformOrigin: "0 50%",
              transform: `rotate(${angle}deg)`,
              boxShadow: `0 0 22px ${color}`,
              zIndex: -1,
            }}
          />
        );
      })}
    </>
  );
}

function ColorSmoke() {
  const frame = useCurrentFrame();
  return (
    <>
      {Array.from({length: 14}).map((_, index) => {
        const color = pick([PALETTE.pink, PALETTE.purple, PALETTE.green, PALETTE.oceanLight], index + 70);
        const x = 90 + seeded(index + 80) * 780 + Math.sin(frame / 38 + index) * 18;
        const y = 238 + seeded(index + 81) * 60 - (frame % 90) * 0.18;
        const size = 58 + seeded(index + 82) * 68;
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size * 0.62,
              borderRadius: "50%",
              background: color,
              opacity: 0.2,
              filter: "blur(9px)",
              zIndex: 3,
            }}
          />
        );
      })}
    </>
  );
}

function VipAreas({characterStyle}: {characterStyle: CharacterStyle}) {
  return (
    <>
      <VipTent side="left" x={78} y={458} characterStyle={characterStyle} />
      <VipTent side="right" x={1460} y={470} characterStyle={characterStyle} />
      <MajlisRug x={255} y={665} flip={false} />
      <MajlisRug x={1515} y={665} flip />
    </>
  );
}

function VipTent({
  side,
  x,
  y,
  characterStyle,
}: {
  side: "left" | "right";
  x: number;
  y: number;
  characterStyle: CharacterStyle;
}) {
  const frame = useCurrentFrame();
  const flip = side === "right";

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 388,
        height: 240,
        transform: flip ? "scaleX(-1)" : undefined,
        zIndex: 24,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 18,
          top: 0,
          width: 340,
          height: 116,
          background: `linear-gradient(135deg, ${PALETTE.white}, ${PALETTE.tentShade})`,
          clipPath: "polygon(8% 100%, 50% 0%, 92% 100%)",
          ...lineStyle(6),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 48,
          top: 96,
          width: 286,
          height: 132,
          borderRadius: "0 0 28px 28px",
          background: `linear-gradient(90deg, ${PALETTE.tent} 0%, #ffffff 50%, ${PALETTE.tentShade} 100%)`,
          ...lineStyle(6),
        }}
      />
      {Array.from({length: 7}).map((_, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: 58 + index * 39,
            top: 110,
            width: 22,
            height: 82,
            background: index % 2 ? PALETTE.pink : PALETTE.oceanLight,
            borderRadius: "0 0 18px 18px",
            opacity: 0.7,
            transform: `skewX(${Math.sin(frame / 26 + index) * 4}deg)`,
            ...lineStyle(3),
          }}
        />
      ))}
      {Array.from({length: 6}).map((_, index) => (
        <Lantern
          key={index}
          x={42 + index * 54}
          y={88 + Math.sin(frame / 16 + index) * 4}
          color={index % 2 ? PALETTE.lantern : PALETTE.pink}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: 68,
          top: 182,
          width: 244,
          height: 42,
          borderRadius: 22,
          background: `repeating-linear-gradient(90deg, ${PALETTE.purple} 0 30px, ${PALETTE.pink} 30px 60px, ${PALETTE.green} 60px 90px)`,
          ...lineStyle(5),
        }}
      />
      {vipGuests.slice(side === "left" ? 0 : 17, side === "left" ? 17 : 34).map((guest) =>
        characterStyle === "3d" ? (
          <MiniGuest3D key={guest.id} guest={guest} />
        ) : (
          <MiniGuest key={guest.id} guest={guest} />
        ),
      )}
    </div>
  );
}

function Lantern({x, y, color}: {x: number; y: number; color: string}) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 30,
        height: 46,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 13,
          top: -20,
          width: 3,
          height: 22,
          background: PALETTE.ink,
        }}
      />
      <div
        style={{
          width: 30,
          height: 38,
          borderRadius: "50% 50% 45% 45%",
          background: color,
          boxShadow: `0 0 26px ${color}`,
          ...lineStyle(3),
        }}
      />
    </div>
  );
}

function MiniGuest({
  guest,
}: {
  guest: {
    x: number;
    y: number;
    scale: number;
    shirt: string;
    skin: string;
    phase: number;
  };
}) {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame / 8 + guest.phase) * 5;

  return (
    <div
      style={{
        position: "absolute",
        left: guest.x,
        top: guest.y + bob,
        width: 35,
        height: 56,
        transform: `scale(${guest.scale})`,
        transformOrigin: "50% 100%",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 9,
          top: 0,
          width: 17,
          height: 17,
          borderRadius: "50%",
          background: guest.skin,
          ...lineStyle(2),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 5,
          top: 17,
          width: 25,
          height: 30,
          borderRadius: 9,
          background: guest.shirt,
          ...lineStyle(2),
        }}
      />
    </div>
  );
}

function MiniGuest3D({
  guest,
}: {
  guest: {
    x: number;
    y: number;
    scale: number;
    shirt: string;
    skin: string;
    phase: number;
  };
}) {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame / 8 + guest.phase) * 5;
  const turn = Math.sin(frame / 18 + guest.phase) * 10;

  return (
    <div
      style={{
        position: "absolute",
        left: guest.x,
        top: guest.y + bob,
        width: 38,
        height: 62,
        transform: `scale(${guest.scale}) rotateY(${turn}deg)`,
        transformOrigin: "50% 100%",
        transformStyle: "preserve-3d",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 4,
          bottom: -4,
          width: 32,
          height: 10,
          borderRadius: "50%",
          background: "rgba(22,16,24,0.2)",
          filter: "blur(1px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 6,
          top: 18,
          width: 27,
          height: 35,
          borderRadius: "15px 15px 11px 11px",
          background: `radial-gradient(circle at 30% 18%, rgba(255,255,255,0.85), transparent 20%), linear-gradient(135deg, rgba(255,255,255,0.25), transparent 42%, rgba(0,0,0,0.28) 100%), ${guest.shirt}`,
          boxShadow:
            "inset -6px -8px 0 rgba(0,0,0,0.2), inset 4px 4px 0 rgba(255,255,255,0.35), 0 5px 0 rgba(22,16,24,0.2)",
          ...lineStyle(2),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 8,
          top: 0,
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: `radial-gradient(circle at 32% 24%, #fff6df 0%, ${guest.skin} 44%, transparent 58%), linear-gradient(135deg, rgba(255,255,255,0.25), transparent 42%, rgba(0,0,0,0.26) 100%), ${guest.skin}`,
          boxShadow:
            "inset -5px -6px 0 rgba(0,0,0,0.18), inset 4px 3px 0 rgba(255,255,255,0.45), 0 4px 0 rgba(22,16,24,0.18)",
          ...lineStyle(2),
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 7,
            top: 10,
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: PALETTE.ink,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 6,
            top: 10,
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: PALETTE.ink,
          }}
        />
      </div>
    </div>
  );
}

function MajlisRug({x, y, flip}: {x: number; y: number; flip: boolean}) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 300,
        height: 78,
        transform: flip ? "scaleX(-1)" : undefined,
        zIndex: 21,
        borderRadius: 16,
        background:
          "repeating-linear-gradient(90deg, #ff39bf 0 34px, #12bfd3 34px 68px, #ffe94a 68px 102px, #8b35ff 102px 136px)",
        boxShadow: "0 16px 0 rgba(93,55,20,0.18)",
        ...lineStyle(5),
      }}
    >
      {Array.from({length: 6}).map((_, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: 26 + index * 44,
            top: 20,
            width: 26,
            height: 26,
            background: index % 2 ? PALETTE.green : PALETTE.white,
            transform: "rotate(45deg)",
            ...lineStyle(2),
          }}
        />
      ))}
    </div>
  );
}

function FestivalFlags() {
  const frame = useCurrentFrame();
  const strings = [
    {x: 160, y: 366, width: 560, rotate: -8},
    {x: 1188, y: 350, width: 560, rotate: 8},
    {x: 620, y: 430, width: 760, rotate: 0},
  ];

  return (
    <>
      {strings.map((string, stringIndex) => (
        <div
          key={stringIndex}
          style={{
            position: "absolute",
            left: string.x,
            top: string.y,
            width: string.width,
            height: 84,
            transform: `rotate(${string.rotate}deg)`,
            zIndex: 25,
          }}
        >
          <svg
            viewBox={`0 0 ${string.width} 82`}
            preserveAspectRatio="none"
            style={{position: "absolute", left: 0, top: 0, width: string.width, height: 82}}
          >
            <path
              d={`M0 16 C${string.width * 0.33} 70 ${string.width * 0.66} 70 ${string.width} 16`}
              fill="none"
              stroke={PALETTE.ink}
              strokeWidth={5}
              strokeLinecap="round"
            />
          </svg>
          {Array.from({length: Math.floor(string.width / 54)}).map((_, index) => {
            const x = 28 + index * 54;
            const y = 20 + Math.sin((index / Math.max(1, string.width / 54)) * Math.PI) * 36;
            const color = pick(neonColors, index + stringIndex * 30);
            return (
              <div
                key={index}
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  width: 32,
                  height: 42,
                  background: color,
                  clipPath: "polygon(0 0, 100% 0, 100% 72%, 50% 100%, 0 72%)",
                  transform: `rotate(${Math.sin(frame / 13 + index) * 7}deg)`,
                  transformOrigin: "50% 0%",
                  ...lineStyle(2),
                }}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

function Crowd({characterStyle}: {characterStyle: CharacterStyle}) {
  return (
    <>
      {dancers.map((dancer) => (
        characterStyle === "3d" ? (
          <Dancer3D key={dancer.id} dancer={dancer} />
        ) : (
          <Dancer key={dancer.id} dancer={dancer} />
        )
      ))}
    </>
  );
}

function Dancer({
  dancer,
}: {
  dancer: (typeof dancers)[number];
}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const beat = frame / fps * Math.PI * 2 * dancer.danceSpeed + dancer.phase;
  const bob = Math.sin(beat) * 8;
  const jump = Math.max(0, Math.sin(beat * 0.5)) * (dancer.flag ? 12 : 5);
  const lean = dancer.lean + Math.sin(beat * 0.7) * 8;
  const shirt = dancer.whiteLook ? PALETTE.white : dancer.shirt;
  const pants = dancer.whiteLook ? dancer.accent : dancer.pants;
  const armWave = Math.sin(beat + 0.8) * 34;

  return (
    <div
      style={{
        position: "absolute",
        left: dancer.x,
        top: dancer.y + bob - jump,
        width: 52,
        height: 86,
        zIndex: Math.round(dancer.y),
        transform: `translate(-50%, -100%) scale(${dancer.scale}) rotate(${lean}deg)`,
        transformOrigin: "50% 100%",
      }}
    >
      {dancer.flag ? <HandFlag color={dancer.accent} wave={armWave} /> : null}
      <Arm side="left" color={dancer.skin} angle={-34 - armWave * 0.35} />
      <Arm side="right" color={dancer.skin} angle={32 + armWave} phone={dancer.phone} />
      <div
        style={{
          position: "absolute",
          left: 14,
          top: 28,
          width: 26,
          height: 35,
          borderRadius: "13px 13px 9px 9px",
          background: shirt,
          ...lineStyle(3),
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 4,
            right: 4,
            top: 8,
            height: 6,
            borderRadius: 6,
            background: dancer.accent,
          }}
        />
      </div>
      <Leg side="left" color={pants} angle={-12 + Math.sin(beat) * 14} />
      <Leg side="right" color={pants} angle={14 - Math.sin(beat) * 14} />
      <div
        style={{
          position: "absolute",
          left: 10,
          top: 3,
          width: 34,
          height: 34,
          borderRadius: "50%",
          background: dancer.skin,
          ...lineStyle(3),
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 6,
            top: 14,
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: PALETTE.ink,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 6,
            top: 14,
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: PALETTE.ink,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 12,
            bottom: 7,
            width: 12,
            height: 6,
            borderRadius: "0 0 12px 12px",
            borderBottom: `3px solid ${PALETTE.ink}`,
          }}
        />
      </div>
      <Hair dancer={dancer} />
      {dancer.hat ? <PartyHat color={dancer.accent} /> : null}
      {dancer.glasses ? <Glasses /> : null}
    </div>
  );
}

function Dancer3D({
  dancer,
}: {
  dancer: (typeof dancers)[number];
}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const beat = frame / fps * Math.PI * 2 * dancer.danceSpeed + dancer.phase;
  const bob = Math.sin(beat) * 8;
  const jump = Math.max(0, Math.sin(beat * 0.5)) * (dancer.flag ? 12 : 5);
  const lean = dancer.lean * 0.45 + Math.sin(beat * 0.7) * 5;
  const turn = Math.sin(beat * 0.34 + dancer.id) * 18;
  const shirt = dancer.whiteLook ? PALETTE.white : dancer.shirt;
  const pants = dancer.whiteLook ? dancer.accent : dancer.pants;
  const armWave = Math.sin(beat + 0.8) * 34;

  return (
    <div
      style={{
        position: "absolute",
        left: dancer.x,
        top: dancer.y + bob - jump,
        width: 62,
        height: 94,
        zIndex: Math.round(dancer.y),
        transform: `translate(-50%, -100%) scale(${dancer.scale}) rotate(${lean}deg) rotateY(${turn}deg)`,
        transformOrigin: "50% 100%",
        transformStyle: "preserve-3d",
        perspective: 220,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 6,
          bottom: -7,
          width: 50,
          height: 14,
          borderRadius: "50%",
          background: "rgba(22,16,24,0.22)",
          filter: "blur(1.2px)",
          transform: `scaleX(${1.05 + Math.abs(Math.sin(beat)) * 0.18})`,
        }}
      />
      {dancer.flag ? <HandFlag color={dancer.accent} wave={armWave} /> : null}
      <Arm3D side="left" color={dancer.skin} angle={-34 - armWave * 0.35} />
      <Arm3D side="right" color={dancer.skin} angle={32 + armWave} phone={dancer.phone} />
      <Leg3D side="left" color={pants} angle={-12 + Math.sin(beat) * 14} />
      <Leg3D side="right" color={pants} angle={14 - Math.sin(beat) * 14} />
      <div
        style={{
          position: "absolute",
          left: 16,
          top: 30,
          width: 32,
          height: 40,
          borderRadius: "18px 18px 13px 13px",
          background: `radial-gradient(circle at 30% 18%, rgba(255,255,255,0.86), transparent 20%), linear-gradient(135deg, rgba(255,255,255,0.26), transparent 44%, rgba(0,0,0,0.32) 100%), ${shirt}`,
          boxShadow:
            "inset -8px -10px 0 rgba(0,0,0,0.22), inset 5px 4px 0 rgba(255,255,255,0.36), 0 7px 0 rgba(22,16,24,0.22)",
          ...lineStyle(3),
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 6,
            right: 6,
            top: 10,
            height: 8,
            borderRadius: 999,
            background: `linear-gradient(90deg, ${dancer.accent}, rgba(255,255,255,0.75))`,
            boxShadow: `0 0 10px ${dancer.accent}`,
            ...lineStyle(1),
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 7,
            top: 25,
            width: 8,
            height: 5,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.55)",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 11,
          top: 3,
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: `radial-gradient(circle at 32% 22%, #fff8e8 0%, ${dancer.skin} 43%, transparent 58%), linear-gradient(135deg, rgba(255,255,255,0.24), transparent 42%, rgba(0,0,0,0.3) 100%), ${dancer.skin}`,
          boxShadow:
            "inset -8px -9px 0 rgba(0,0,0,0.2), inset 6px 4px 0 rgba(255,255,255,0.5), 0 6px 0 rgba(22,16,24,0.22)",
          ...lineStyle(3),
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 9,
            top: 17,
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: PALETTE.ink,
            boxShadow: "1px 1px 0 rgba(255,255,255,0.45)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 8,
            top: 17,
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: PALETTE.ink,
            boxShadow: "1px 1px 0 rgba(255,255,255,0.45)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 14,
            bottom: 8,
            width: 14,
            height: 7,
            borderRadius: "0 0 14px 14px",
            borderBottom: `4px solid ${PALETTE.ink}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 9,
            top: 7,
            width: 9,
            height: 5,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.55)",
          }}
        />
      </div>
      <Hair3D dancer={dancer} />
      {dancer.hat ? <PartyHat3D color={dancer.accent} /> : null}
      {dancer.glasses ? <Glasses3D /> : null}
    </div>
  );
}

function Arm3D({
  side,
  color,
  angle,
  phone,
}: {
  side: "left" | "right";
  color: string;
  angle: number;
  phone?: boolean;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: side === "left" ? 5 : 42,
        top: 34,
        width: 14,
        height: 38,
        borderRadius: 999,
        background: `radial-gradient(circle at 30% 16%, rgba(255,255,255,0.82), transparent 18%), linear-gradient(135deg, rgba(255,255,255,0.18), transparent 42%, rgba(0,0,0,0.25)), ${color}`,
        boxShadow:
          "inset -4px -5px 0 rgba(0,0,0,0.16), inset 3px 3px 0 rgba(255,255,255,0.35), 0 4px 0 rgba(22,16,24,0.18)",
        transformOrigin: side === "left" ? "80% 8%" : "20% 8%",
        transform: `rotate(${angle}deg)`,
        ...lineStyle(2),
      }}
    >
      {phone ? <Phone3D side={side} /> : null}
    </div>
  );
}

function Phone3D({side}: {side: "left" | "right"}) {
  return (
    <div
      style={{
        position: "absolute",
        left: side === "left" ? -7 : 9,
        top: 25,
        width: 15,
        height: 24,
        borderRadius: 5,
        background:
          "radial-gradient(circle at 32% 20%, #aefcff, transparent 20%), linear-gradient(135deg, #1b1f3b, #050713)",
        boxShadow: `0 0 12px ${PALETTE.oceanLight}, inset -3px -3px 0 rgba(0,0,0,0.35)`,
        ...lineStyle(2),
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 4,
          top: 5,
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: PALETTE.oceanLight,
        }}
      />
    </div>
  );
}

function Leg3D({side, color, angle}: {side: "left" | "right"; color: string; angle: number}) {
  return (
    <div
      style={{
        position: "absolute",
        left: side === "left" ? 17 : 33,
        top: 64,
        width: 13,
        height: 32,
        borderRadius: 999,
        background: `radial-gradient(circle at 30% 14%, rgba(255,255,255,0.82), transparent 17%), linear-gradient(135deg, rgba(255,255,255,0.18), transparent 42%, rgba(0,0,0,0.32)), ${color}`,
        boxShadow:
          "inset -4px -6px 0 rgba(0,0,0,0.2), inset 3px 3px 0 rgba(255,255,255,0.32), 0 4px 0 rgba(22,16,24,0.16)",
        transformOrigin: "50% 0%",
        transform: `rotate(${angle}deg)`,
        ...lineStyle(2),
      }}
    />
  );
}

function Arm({
  side,
  color,
  angle,
  phone,
}: {
  side: "left" | "right";
  color: string;
  angle: number;
  phone?: boolean;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: side === "left" ? 4 : 34,
        top: 31,
        width: 12,
        height: 34,
        borderRadius: 10,
        background: color,
        transformOrigin: side === "left" ? "80% 8%" : "20% 8%",
        transform: `rotate(${angle}deg)`,
        ...lineStyle(2),
      }}
    >
      {phone ? (
        <div
          style={{
            position: "absolute",
            left: side === "left" ? -6 : 8,
            top: 24,
            width: 14,
            height: 22,
            borderRadius: 4,
            background: "#111827",
            boxShadow: `0 0 10px ${PALETTE.oceanLight}`,
            ...lineStyle(2),
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 3,
              top: 4,
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: PALETTE.oceanLight,
            }}
          />
        </div>
      ) : null}
    </div>
  );
}

function Leg({side, color, angle}: {side: "left" | "right"; color: string; angle: number}) {
  return (
    <div
      style={{
        position: "absolute",
        left: side === "left" ? 16 : 29,
        top: 59,
        width: 10,
        height: 30,
        borderRadius: 9,
        background: color,
        transformOrigin: "50% 0%",
        transform: `rotate(${angle}deg)`,
        ...lineStyle(2),
      }}
    />
  );
}

function Hair({dancer}: {dancer: (typeof dancers)[number]}) {
  const style = Math.floor(seeded(dancer.id + 3600) * 4);

  if (style === 0) {
    return (
      <div
        style={{
          position: "absolute",
          left: 9,
          top: 0,
          width: 36,
          height: 20,
          borderRadius: "22px 22px 8px 8px",
          background: dancer.hair,
          ...lineStyle(2),
        }}
      />
    );
  }

  if (style === 1) {
    return (
      <div
        style={{
          position: "absolute",
          left: 9,
          top: 0,
          width: 36,
          height: 15,
          background: `repeating-linear-gradient(90deg, ${dancer.hair} 0 7px, ${PALETTE.ink} 7px 9px)`,
          borderRadius: "18px 18px 5px 5px",
          ...lineStyle(2),
        }}
      />
    );
  }

  return (
    <>
      {Array.from({length: 4}).map((_, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: 9 + index * 8,
            top: index % 2 ? -1 : 2,
            width: 12,
            height: 16,
            borderRadius: "50%",
            background: dancer.hair,
            ...lineStyle(2),
          }}
        />
      ))}
    </>
  );
}

function Hair3D({dancer}: {dancer: (typeof dancers)[number]}) {
  const style = Math.floor(seeded(dancer.id + 3600) * 4);
  const hairFill = `radial-gradient(circle at 30% 18%, rgba(255,255,255,0.3), transparent 18%), linear-gradient(135deg, rgba(255,255,255,0.12), transparent 40%, rgba(0,0,0,0.42)), ${dancer.hair}`;

  if (style === 0) {
    return (
      <div
        style={{
          position: "absolute",
          left: 9,
          top: -1,
          width: 44,
          height: 22,
          borderRadius: "24px 24px 10px 10px",
          background: hairFill,
          boxShadow: "inset -5px -5px 0 rgba(0,0,0,0.22)",
          ...lineStyle(2),
        }}
      />
    );
  }

  if (style === 1) {
    return (
      <div
        style={{
          position: "absolute",
          left: 9,
          top: -1,
          width: 44,
          height: 18,
          background: `radial-gradient(circle at 30% 18%, rgba(255,255,255,0.28), transparent 18%), repeating-linear-gradient(90deg, ${dancer.hair} 0 8px, ${PALETTE.ink} 8px 10px)`,
          borderRadius: "22px 22px 8px 8px",
          boxShadow: "inset -5px -5px 0 rgba(0,0,0,0.18)",
          ...lineStyle(2),
        }}
      />
    );
  }

  return (
    <>
      {Array.from({length: 4}).map((_, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: 9 + index * 9,
            top: index % 2 ? -3 : 1,
            width: 15,
            height: 18,
            borderRadius: "50%",
            background: hairFill,
            boxShadow:
              "inset -4px -4px 0 rgba(0,0,0,0.2), inset 2px 2px 0 rgba(255,255,255,0.22)",
            ...lineStyle(2),
          }}
        />
      ))}
    </>
  );
}

function PartyHat({color}: {color: string}) {
  return (
    <div
      style={{
        position: "absolute",
        left: 18,
        top: -18,
        width: 20,
        height: 24,
        background: color,
        clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
        ...lineStyle(2),
      }}
    />
  );
}

function PartyHat3D({color}: {color: string}) {
  return (
    <div
      style={{
        position: "absolute",
        left: 20,
        top: -22,
        width: 23,
        height: 29,
        background: `radial-gradient(circle at 32% 18%, rgba(255,255,255,0.8), transparent 20%), linear-gradient(135deg, rgba(255,255,255,0.24), transparent 42%, rgba(0,0,0,0.28)), ${color}`,
        clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
        filter: `drop-shadow(0 4px 0 rgba(22,16,24,0.22)) drop-shadow(0 0 9px ${color})`,
        ...lineStyle(2),
      }}
    />
  );
}

function Glasses() {
  return (
    <div
      style={{
        position: "absolute",
        left: 12,
        top: 16,
        width: 30,
        height: 9,
      }}
    >
      {[0, 1].map((index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: index * 17,
            top: 0,
            width: 12,
            height: 8,
            borderRadius: 6,
            background: PALETTE.oceanLight,
            ...lineStyle(2),
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: 12,
          top: 3,
          width: 8,
          height: 2,
          background: PALETTE.ink,
        }}
      />
    </div>
  );
}

function Glasses3D() {
  return (
    <div
      style={{
        position: "absolute",
        left: 13,
        top: 18,
        width: 36,
        height: 11,
      }}
    >
      {[0, 1].map((index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: index * 20,
            top: 0,
            width: 15,
            height: 10,
            borderRadius: 7,
            background: `radial-gradient(circle at 30% 20%, #ffffff, ${PALETTE.oceanLight} 46%, ${PALETTE.blue} 100%)`,
            boxShadow: `0 0 9px ${PALETTE.oceanLight}, inset -3px -2px 0 rgba(0,0,0,0.2)`,
            ...lineStyle(2),
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: 15,
          top: 4,
          width: 8,
          height: 3,
          background: PALETTE.ink,
        }}
      />
    </div>
  );
}

function HandFlag({color, wave}: {color: string; wave: number}) {
  return (
    <div
      style={{
        position: "absolute",
        left: 42,
        top: -18,
        width: 56,
        height: 54,
        transform: `rotate(${wave * 0.35}deg)`,
        transformOrigin: "0 100%",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 4,
          top: 8,
          width: 5,
          height: 52,
          borderRadius: 8,
          background: PALETTE.ink,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 8,
          top: 4,
          width: 44,
          height: 28,
          borderRadius: "4px 12px 12px 4px",
          background: `linear-gradient(135deg, ${color}, ${PALETTE.yellow})`,
          clipPath: "polygon(0 0, 100% 8%, 88% 50%, 100% 92%, 0 100%)",
          ...lineStyle(2),
        }}
      />
    </div>
  );
}

function FloatingBalloons() {
  const frame = useCurrentFrame();
  return (
    <>
      {balloons.map((balloon) => {
        const y = ((balloon.y - frame * balloon.speed + 900) % 900) - 110;
        const x = balloon.x + Math.sin(frame / 30 + balloon.phase) * 24;
        return (
          <div
            key={balloon.id}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: balloon.size,
              height: balloon.size * 1.22,
              zIndex: 70,
              transform: `rotate(${Math.sin(frame / 20 + balloon.phase) * 7}deg)`,
            }}
          >
            <div
              style={{
                width: balloon.size,
                height: balloon.size * 1.05,
                borderRadius: "50% 50% 45% 45%",
                background: balloon.color,
                boxShadow: `0 0 18px ${balloon.color}`,
                ...lineStyle(3),
              }}
            />
            <div
              style={{
                position: "absolute",
                left: balloon.size / 2 - 1,
                top: balloon.size,
                width: 2,
                height: 58,
                background: "rgba(22,16,24,0.55)",
              }}
            />
          </div>
        );
      })}
    </>
  );
}

function ConfettiOverlay() {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const blast = interpolate(
    Math.sin((frame / fps) * Math.PI * 0.95),
    [-1, 1],
    [0.82, 1.35],
  );

  return (
    <AbsoluteFill style={{overflow: "hidden", pointerEvents: "none", zIndex: 90}}>
      {confetti.map((piece) => {
        const y = (piece.y + (frame + piece.delay) * piece.speed * blast) % 1280;
        const x = piece.x + Math.sin((frame + piece.delay) / 18) * piece.drift;
        const rotate = (frame * (1.6 + piece.speed) + piece.id * 23) % 360;
        return (
          <div
            key={piece.id}
            style={{
              position: "absolute",
              left: x,
              top: y - 170,
              width: piece.shape === "circle" ? piece.size : piece.size * 0.65,
              height: piece.shape === "circle" ? piece.size : piece.size * 1.45,
              borderRadius: piece.shape === "circle" ? "50%" : 3,
              background: piece.color,
              opacity: 0.86,
              transform: `rotate(${rotate}deg)`,
              boxShadow: `0 0 7px ${piece.color}`,
            }}
          />
        );
      })}
      <FloatingBalloons />
    </AbsoluteFill>
  );
}

function FinalGlow() {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const final = interpolate(
    frame,
    [durationInFrames - seconds(4, fps), durationInFrames - seconds(1.2, fps)],
    [0, 1],
    clamp,
  );

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        opacity: final,
        background:
          "radial-gradient(circle at 50% 38%, rgba(255,233,74,0.18), transparent 30%), radial-gradient(circle at 50% 72%, rgba(255,57,191,0.2), transparent 45%)",
        zIndex: 80,
      }}
    />
  );
}

function SceneShimmer() {
  const frame = useCurrentFrame();
  const shine = interpolate(Math.sin(frame / 12), [-1, 1], [0.04, 0.1]);

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        opacity: shine,
        background:
          "linear-gradient(115deg, transparent 0%, white 42%, transparent 55%)",
        transform: `translateX(${interpolate(frame % 220, [0, 219], [-1200, 1700], clamp)}px)`,
        zIndex: 82,
      }}
    />
  );
}

function FestivalScene({characterStyle}: {characterStyle: CharacterStyle}) {
  return (
    <AbsoluteFill
      style={{
        background: "#74ddff",
        overflow: "hidden",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <Sky />
      <CameraWorld>
        <SandAndBeach />
        <Stage />
        <VipAreas characterStyle={characterStyle} />
        <FestivalFlags />
        <Crowd characterStyle={characterStyle} />
        <Ocean />
      </CameraWorld>
      <ConfettiOverlay />
      <FinalGlow />
      <SceneShimmer />
    </AbsoluteFill>
  );
}

export const BedouinCartoonFestival = () => {
  return <FestivalScene characterStyle="2d" />;
};

export const BedouinCartoonFestival3D = () => {
  return <FestivalScene characterStyle="3d" />;
};
