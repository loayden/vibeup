import { Audio, Video } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const GOLD = "#d4a853";
const SAND = "#f0d89a";
const INK = "#03020a";

const clips = [
  { src: "media/arab.mp4", start: 0, duration: 8, trim: 1 },
  { src: "media/VIBEUP9.mp4", start: 7, duration: 8, trim: 2 },
  { src: "media/VIBEUP.mp4", start: 14, duration: 10, trim: 0 },
] as const;

const scenes = [
  {
    start: 0,
    end: 5,
    kicker: "VIBEUP PRESENTS",
    title: "BEACHFRONT FESTIVAL",
    sub: "Egypt Mediterranean coast",
  },
  {
    start: 5,
    end: 10,
    kicker: "SEA TO STAGE",
    title: "2,700 GUESTS",
    sub: "General admission, VIP tents, food courts, bars",
  },
  {
    start: 10,
    end: 15,
    kicker: "VIP AFTER DARK",
    title: "BEDOUIN LUXURY",
    sub: "Gold pavilions, majlis lounges, bottle service",
  },
  {
    start: 15,
    end: 20,
    kicker: "THE FLOOR OPENS",
    title: "LASERS. FIRE. MUSIC.",
    sub: "A cinematic night built for the coast",
  },
  {
    start: 20,
    end: 24,
    kicker: "THIS IS THE NIGHT",
    title: "JOIN THE PARTY",
    sub: "Arrive early. Dress luxury. Stay late.",
  },
] as const;

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const seconds = (value: number, fps: number) => value * fps;

const fitCover: React.CSSProperties = {
  width: "100%",
  height: "100%",
};

function SceneCopy() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;
  const scene =
    scenes.find((item) => time >= item.start && time < item.end) ?? scenes[0];
  const local = frame - seconds(scene.start, fps);
  const sceneDuration = seconds(scene.end - scene.start, fps);
  const enter = interpolate(local, [0, 0.9 * fps], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const exit = interpolate(
    local,
    [sceneDuration - 0.85 * fps, sceneDuration],
    [1, 0],
    {
      ...clamp,
      easing: Easing.in(Easing.cubic),
    },
  );
  const visibility = enter * exit;
  const y = interpolate(enter, [0, 1], [82, 0], clamp);
  const tracking = interpolate(enter, [0, 1], [18, 5], clamp);

  return (
    <div
      style={{
        position: "absolute",
        left: 72,
        right: 72,
        bottom: 210,
        color: "white",
        opacity: visibility,
        transform: `translateY(${y}px)`,
      }}
    >
      <div
        style={{
          color: GOLD,
          fontFamily: "Arial, sans-serif",
          fontSize: 28,
          letterSpacing: 7,
          fontWeight: 700,
          textTransform: "uppercase",
        }}
      >
        {scene.kicker}
      </div>
      <div
        style={{
          marginTop: 24,
          color: SAND,
          fontFamily: "Georgia, serif",
          fontSize: 108,
          lineHeight: 0.9,
          letterSpacing: tracking,
          textTransform: "uppercase",
          textShadow: "0 0 70px rgba(212,168,83,0.5)",
        }}
      >
        {scene.title}
      </div>
      <div
        style={{
          width: 210,
          height: 2,
          marginTop: 30,
          background: `linear-gradient(90deg, ${GOLD}, transparent)`,
        }}
      />
      <div
        style={{
          marginTop: 28,
          maxWidth: 760,
          color: "rgba(255,255,255,0.82)",
          fontFamily: "Arial, sans-serif",
          fontSize: 34,
          lineHeight: 1.25,
          letterSpacing: 2,
        }}
      >
        {scene.sub}
      </div>
    </div>
  );
}

function ClipLayer({ src, start, duration, trim }: (typeof clips)[number]) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const from = seconds(start, fps);
  const dur = seconds(duration, fps);
  const local = frame - from;
  const fadeIn = interpolate(local, [0, 0.8 * fps], [0, 1], clamp);
  const fadeOut = interpolate(local, [dur - 0.8 * fps, dur], [1, 0], clamp);
  const opacity = Math.min(fadeIn, fadeOut);
  const scale = interpolate(local, [0, dur], [1.12, 1.02], clamp);
  const x = interpolate(local, [0, dur], [-34, 24], clamp);

  return (
    <Video
      src={staticFile(src)}
      from={from}
      durationInFrames={dur}
      trimBefore={seconds(trim, fps)}
      loop
      muted
      objectFit="cover"
      style={{
        ...fitCover,
        opacity,
        transform: `scale(${scale}) translateX(${x}px)`,
        filter: "contrast(1.15) saturate(1.12) brightness(0.82)",
      }}
    />
  );
}

function LightGrid() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = interpolate(
    Math.sin((frame / fps) * Math.PI * 2),
    [-1, 1],
    [0.28, 0.75],
  );

  return (
    <AbsoluteFill>
      {Array.from({ length: 22 }).map((_, index) => {
        const x = 70 + index * 45;
        const height = 180 + random(`bar-${index}`) * 280;
        const delay = random(`delay-${index}`) * 35;
        const wave = interpolate(
          Math.sin((frame + delay) / 12),
          [-1, 1],
          [0.35, 1],
        );

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: x,
              bottom: 64,
              width: 3,
              height,
              opacity: 0.12 * wave,
              background: `linear-gradient(180deg, transparent, ${GOLD})`,
              boxShadow: `0 0 ${28 * pulse}px rgba(212,168,83,0.9)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
}

function Hud() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], clamp);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 74,
          left: 72,
          right: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "rgba(255,255,255,0.65)",
          fontFamily: "Arial, sans-serif",
          fontSize: 20,
          letterSpacing: 5,
        }}
      >
        <span>VIBEUP</span>
        <span>24 SEC PARTY FILM</span>
      </div>
      <div
        style={{
          position: "absolute",
          top: 124,
          left: 72,
          right: 72,
          height: 2,
          background: "rgba(255,255,255,0.14)",
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            background: GOLD,
            boxShadow: "0 0 24px rgba(212,168,83,0.8)",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          bottom: 70,
          display: "flex",
          justifyContent: "space-between",
          color: "rgba(255,255,255,0.48)",
          fontFamily: "Arial, sans-serif",
          fontSize: 18,
          letterSpacing: 4,
          textTransform: "uppercase",
        }}
      >
        <span>Sea front</span>
        <span>VIP</span>
        <span>Main stage</span>
      </div>
    </AbsoluteFill>
  );
}

export const PartyFilm = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const flash = interpolate(Math.sin(frame / 2), [-1, 1], [0, 1]);
  const endFade = interpolate(
    frame,
    [durationInFrames - 1.5 * fps, durationInFrames],
    [0, 1],
    clamp,
  );

  return (
    <AbsoluteFill style={{ backgroundColor: INK }}>
      {clips.map((clip) => (
        <ClipLayer key={clip.src} {...clip} />
      ))}

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(3,2,10,0.5) 0%, rgba(3,2,10,0.08) 38%, rgba(3,2,10,0.78) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 44%, transparent 0%, rgba(3,2,10,0.05) 36%, rgba(3,2,10,0.78) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.06 + flash * 0.04,
          background:
            "linear-gradient(115deg, transparent 0%, rgba(212,168,83,0.65) 45%, transparent 58%)",
          transform: `translateX(${interpolate(frame, [0, durationInFrames], [-800, 900], clamp)}px)`,
        }}
      />
      <LightGrid />
      <SceneCopy />
      <Hud />
      <Audio
        src={staticFile("media/luxury-ambient.mp3")}
        loop
        volume={(f) => {
          const fadeIn = interpolate(f, [0, 1.5 * fps], [0, 0.86], clamp);
          const fadeOut = interpolate(
            f,
            [durationInFrames - 2 * fps, durationInFrames],
            [0.86, 0],
            clamp,
          );
          return Math.min(fadeIn, fadeOut);
        }}
      />
      <AbsoluteFill style={{ backgroundColor: INK, opacity: endFade }} />
    </AbsoluteFill>
  );
};
