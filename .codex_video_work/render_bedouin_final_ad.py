import glob
import subprocess
from pathlib import Path


ROOT = Path("/Users/shereenmagdy/Documents/GitHub/vibeup")
FFMPEG = ROOT / ".codex_video_work/node_modules/ffmpeg-static/ffmpeg"
OUTDIR = ROOT / "output"
OUTDIR.mkdir(exist_ok=True)

multishot = glob.glob(
    "/Users/shereenmagdy/Downloads/Multi-Shot_Video_-_*ULTRA_CINEMATIC_BEACH_FESTIVAL_DRONE_VIDEO*.mp4"
)[0]

INPUTS = [
    multishot,
    "/Users/shereenmagdy/Downloads/WhatsApp Image 2026-06-04 at 03.25.23.jpeg",
    "/Users/shereenmagdy/Downloads/fd28542c-ee9b-42db-bcf2-fea1d60b078e.png",
    "/Users/shereenmagdy/Downloads/Gemini_Generated_Image_lxmspmlxmspmlxms.png",
    "/Users/shereenmagdy/Downloads/ChatGPT Image Jun 6, 2026, 06_25_12 AM.png",
    "/Users/shereenmagdy/Downloads/ChatGPT Image Jun 6, 2026, 06_24_10 AM.png",
    str(ROOT / "public/luxury-ambient.mp3"),
]

OUTPUT = OUTDIR / "bedouin-white-party-cinematic-ai-style-ad-final.mp4"


def drawtext(font, text, size, y, start, end, color, shadow="black@0.62"):
    safe_text = text.replace(":", "\\:").replace("'", "\\'")
    return (
        f"drawtext=fontfile={font}:text='{safe_text}':fontcolor={color}:fontsize={size}:"
        f"x=(w-text_w)/2:y={y}:shadowcolor={shadow}:shadowx=0:shadowy=5:"
        f"enable='between(t,{start},{end})'"
    )


segments = [
    "color=c=0x050403:s=1080x1920:r=30:d=4.5,format=yuv420p[s0]",
]

image_specs = {
    "s1": (1, 5.5, "min(zoom+0.00055,1.07)", "iw/2-(iw/zoom/2)", "ih/2-(ih/zoom/2)+8"),
    "s3": (5, 6, "min(zoom+0.00060,1.08)", "iw/2-(iw/zoom/2)", "ih/2-(ih/zoom/2)-12"),
    "s4": (2, 7, "min(zoom+0.00055,1.08)", "iw/2-(iw/zoom/2)", "ih/2-(ih/zoom/2)+10"),
    "s6": (1, 6, "min(zoom+0.00050,1.065)", "iw/2-(iw/zoom/2)", "ih/2-(ih/zoom/2)+8"),
    "s7": (4, 6, "min(zoom+0.00035,1.045)", "iw/2-(iw/zoom/2)", "ih/2-(ih/zoom/2)-8"),
}

for name, (idx, duration, zoom, x_pos, y_pos) in image_specs.items():
    frames = int(duration * 30)
    segments.append(
        f"[{idx}:v]scale=1080:1920:force_original_aspect_ratio=increase,"
        f"crop=1080:1920,setsar=1,"
        f"zoompan=z='{zoom}':x='{x_pos}':y='{y_pos}':d={frames}:s=1080x1920:fps=30,"
        f"trim=duration={duration},setpts=PTS-STARTPTS,"
        f"eq=contrast=1.06:saturation=1.10:brightness=0.005,"
        f"vignette=PI/5,format=yuv420p[{name}]"
    )

for name, idx, start, end in [
    ("s2", 0, 0, 7),
    ("s5", 0, 7, 15),
]:
    segments.append(
        f"[{idx}:v]trim=start={start}:end={end},setpts=PTS-STARTPTS,fps=30,"
        f"scale=-2:1920,crop=1080:1920:(iw-ow)/2:0,setsar=1,"
        f"eq=contrast=1.08:saturation=1.14:brightness=0.006,"
        f"vignette=PI/5,format=yuv420p[{name}]"
    )

order = ["s0", "s1", "s2", "s3", "s4", "s5", "s6", "s7"]
durations = [4.5, 5.5, 7, 6, 7, 8, 6, 6]
transition = 0.45
xfades = []
current = durations[0]
last = order[0]
for i, name in enumerate(order[1:], 1):
    offset = current - transition
    out = f"x{i}" if i < len(order) - 1 else "pretext"
    xfades.append(f"[{last}][{name}]xfade=transition=fade:duration={transition}:offset={offset:.2f}[{out}]")
    current = current + durations[i] - transition
    last = out

total_duration = current
font_title = "/System/Library/Fonts/NewYork.ttf"
font_sans = "/System/Library/Fonts/HelveticaNeue.ttc"
gold = "0xD6B16A"
cream = "0xF8F2DF"
white = "0xFFFFFF"

text_filters = [
    "[pretext]fade=t=in:st=0:d=0.65,fade=t=out:st=44.85:d=2,",
    "drawbox=x=0:y=0:w=iw:h=240:color=black@0.10:t=fill,",
    "drawbox=x=0:y=1510:w=iw:h=410:color=black@0.18:t=fill,",
    f"drawbox=x=(w-500)/2:y=585:w=500:h=3:color={gold}@0.95:t=fill:enable='between(t,0.35,4.45)',",
    drawtext(font_title, "BEDOUIN", 108, 360, 0.4, 4.45, cream) + ",",
    drawtext(font_title, "WHITE PARTY", 76, 478, 0.4, 4.45, cream) + ",",
    drawtext(font_sans, "SEPTEMBER 19 & 20", 38, 618, 0.9, 4.45, gold) + ",",
    drawtext(font_sans, "COMING SOON", 34, 671, 1.15, 4.45, white) + ",",
    drawtext(font_sans, "A LUXURY BEACHFRONT EXPERIENCE", 39, 1518, 4.65, 9.75, white) + ",",
    drawtext(font_sans, "WHITE DRESS CODE  /  GOLDEN SUNSET", 28, 1578, 4.65, 9.75, gold) + ",",
    drawtext(font_title, "WHERE LUXURY", 62, 1410, 9.65, 16.6, cream) + ",",
    drawtext(font_title, "MEETS THE SEA", 62, 1484, 9.65, 16.6, cream) + ",",
    drawtext(font_sans, "ARRIVE IN WHITE", 54, 1428, 16.1, 22.0, white) + ",",
    drawtext(font_sans, "SEPTEMBER 19 & 20", 35, 1504, 16.1, 22.0, gold) + ",",
    drawtext(font_sans, "WHITE OUTFIT REQUIRED", 53, 1436, 21.75, 28.6, white) + ",",
    drawtext(font_sans, "BEACHFRONT EVENT  /  PREMIUM HOSPITALITY", 29, 1515, 21.75, 28.6, gold) + ",",
    drawtext(font_sans, "LIVE DJ PERFORMANCE", 55, 1415, 28.25, 36.1, white) + ",",
    drawtext(font_sans, "LANTERNS  /  PALMS  /  STAGE LIGHTS", 30, 1494, 28.25, 36.1, gold) + ",",
    drawtext(font_title, "THE BIGGEST", 66, 1352, 35.75, 41.55, cream) + ",",
    drawtext(font_title, "WHITE PARTY", 82, 1428, 35.75, 41.55, cream) + ",",
    drawtext(font_sans, "OF THE YEAR", 38, 1528, 35.75, 41.55, gold) + ",",
    drawtext(font_sans, "COMING SOON", 48, 1490, 41.55, total_duration, white) + ",",
    "format=yuv420p[v]",
]

audio = (
    f"[6:a]atrim=0:{total_duration:.2f},asetpts=PTS-STARTPTS,"
    f"afade=t=in:st=0:d=1.2,afade=t=out:st={total_duration - 2.2:.2f}:d=2.2,"
    "volume=0.86[a]"
)

filter_complex = ";".join(segments + xfades + ["".join(text_filters), audio])

cmd = [str(FFMPEG), "-hide_banner", "-y"]
for path in INPUTS:
    cmd.extend(["-i", path])
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

print(f"Rendering: {OUTPUT}")
print(f"Target duration: {total_duration:.2f} seconds")
subprocess.run(cmd, check=True)
print(OUTPUT)
