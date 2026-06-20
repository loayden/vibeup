import subprocess
from pathlib import Path


ROOT = Path("/Users/shereenmagdy/Documents/GitHub/vibeup")
FFMPEG = ROOT / ".codex_video_work/node_modules/ffmpeg-static/ffmpeg"
OUTDIR = ROOT / "output"
OUTDIR.mkdir(exist_ok=True)

CLIP_DIR = ROOT / ".codex_video_work/hedra_webgen"
INPUTS = [
    CLIP_DIR / "01-main-stage.webm",
    CLIP_DIR / "02-arrival.webm",
    CLIP_DIR / "03-luxury-venue.webm",
    CLIP_DIR / "04-sunset-crowd.webm",
    ROOT / "public/luxury-ambient.mp3",
]

OUTPUT = OUTDIR / "bedouin-white-party-hedra-free-webgen-ad.mp4"

segments = []
for i in range(4):
    segments.append(
        f"[{i}:v]fps=30,scale=1080:1920:force_original_aspect_ratio=increase,"
        f"crop=1080:1920,boxblur=22:1,eq=contrast=1.05:saturation=1.08:brightness=-0.015[bg{i}];"
        f"[{i}:v]fps=30,scale=1080:1920:force_original_aspect_ratio=decrease[fg{i}];"
        f"[bg{i}][fg{i}]overlay=(W-w)/2:(H-h)/2,setsar=1,"
        f"eq=contrast=1.07:saturation=1.10:brightness=0.003,"
        f"vignette=PI/5,format=yuv420p[s{i}]"
    )

transition = 0.35
durations = [5.99, 5.99, 6.00, 6.00]
xfades = []
current = durations[0]
last = "s0"
for idx, name in enumerate(["s1", "s2", "s3"], 1):
    offset = current - transition
    out = f"x{idx}" if idx < 3 else "pretext"
    xfades.append(f"[{last}][{name}]xfade=transition=fade:duration={transition}:offset={offset:.2f}[{out}]")
    current = current + durations[idx] - transition
    last = out

total_duration = current
font_title = "/System/Library/Fonts/NewYork.ttf"
font_sans = "/System/Library/Fonts/HelveticaNeue.ttc"
gold = "0xD6B16A"
cream = "0xF8F2DF"
white = "0xFFFFFF"


def dt(font, text, size, y, start, end, color=cream, x="(w-text_w)/2"):
    safe = text.replace(":", "\\:").replace("'", "\\'")
    return (
        f"drawtext=fontfile={font}:text='{safe}':fontcolor={color}:fontsize={size}:"
        f"x={x}:y={y}:shadowcolor=black@0.62:shadowx=0:shadowy=5:"
        f"enable='between(t,{start},{end})'"
    )


text_chain = [
    "[pretext]fade=t=in:st=0:d=0.45,fade=t=out:st=21.7:d=1.3,",
    "drawbox=x=0:y=0:w=iw:h=220:color=black@0.10:t=fill,",
    "drawbox=x=0:y=1510:w=iw:h=410:color=black@0.18:t=fill,",
    dt(font_sans, "A LUXURY BEACHFRONT EXPERIENCE", 39, 1505, 0.7, 5.75, white) + ",",
    dt(font_sans, "ARRIVE IN WHITE", 56, 1450, 5.85, 11.5, white) + ",",
    dt(font_sans, "WHITE DRESS CODE  /  GOLDEN SUNSET", 29, 1528, 5.85, 11.5, gold) + ",",
    dt(font_sans, "WHITE OUTFIT REQUIRED", 52, 1436, 11.3, 17.2, white) + ",",
    dt(font_sans, "LIVE DJ PERFORMANCE  /  PREMIUM HOSPITALITY", 29, 1515, 11.3, 17.2, gold) + ",",
    dt(font_title, "THE BIGGEST", 64, 1340, 16.75, 22.35, cream) + ",",
    dt(font_title, "WHITE PARTY", 82, 1412, 16.75, 22.35, cream) + ",",
    dt(font_sans, "OF THE YEAR", 38, 1514, 16.75, 22.35, gold) + ",",
    dt(font_sans, "COMING SOON", 46, 1602, 18.6, total_duration, white) + ",",
    "format=yuv420p[v]",
]

audio = (
    f"[4:a]atrim=0:{total_duration:.2f},asetpts=PTS-STARTPTS,"
    f"afade=t=in:st=0:d=0.6,afade=t=out:st={total_duration - 1.5:.2f}:d=1.5,"
    "volume=0.9[a]"
)

filter_complex = ";".join(segments + xfades + ["".join(text_chain), audio])

cmd = [str(FFMPEG), "-hide_banner", "-y"]
for item in INPUTS:
    cmd.extend(["-i", str(item)])

cmd.extend(
    [
        "-filter_complex",
        filter_complex,
        "-map",
        "[v]",
        "-map",
        "[a]",
        "-c:v",
        "libx264",
        "-preset",
        "slow",
        "-crf",
        "18",
        "-pix_fmt",
        "yuv420p",
        "-profile:v",
        "high",
        "-level",
        "4.1",
        "-r",
        "30",
        "-movflags",
        "+faststart",
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        "-ar",
        "48000",
        "-t",
        f"{total_duration:.2f}",
        str(OUTPUT),
    ]
)

print(f"Rendering {OUTPUT}")
print(f"Duration {total_duration:.2f}s")
subprocess.run(cmd, check=True)
print(OUTPUT)
