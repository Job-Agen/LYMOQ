"""Generate the Mesura brand kit (SVG masters) and HTML render jobs for every PNG.

Usage: python brand/source/build.py <repo_root> <jobs_dir>   (needs: pip install fonttools)
Writes SVGs to <repo>/brand/ and one HTML page per PNG to <jobs_dir>, plus jobs.json
listing (html, png_path, width, height, transparent).
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from wordmark import outline  # noqa: E402

FOREST = "#073D31"
CREAM = "#F6F4EE"
ACCENT = "#0AA17F"
MINT = "#7FD8B8"
FONT = Path(__file__).parent / "fonts/PlusJakartaSans-ExtraBold.woff"

repo = Path(sys.argv[1])
jobs_dir = Path(sys.argv[2])
brand = repo / "brand"
assets = repo / "apps/mobile/assets"
for d in (brand, brand / "png", jobs_dir, assets / "brand"):
    d.mkdir(parents=True, exist_ok=True)

# --- Symbol: an M standing on a measuring line ("your money, within your limit").
# Glyph bbox on the 1024 canvas: x 252..772, y 262..842 (centre y = 552).
M_D = "M312 712 V322 L512 552 L712 322 V712"


def glyph(ink=CREAM, line=MINT):
    return (f'<path d="{M_D}" fill="none" stroke="{ink}" stroke-width="112" '
            f'stroke-linecap="round" stroke-linejoin="round"/>'
            f'<line x1="312" y1="818" x2="712" y2="818" stroke="{line}" stroke-width="48" stroke-linecap="round"/>')


def centred(inner, scale):
    """Scale the glyph about its own centre and centre it on the canvas."""
    return f'<g transform="translate(512 512) scale({scale}) translate(-512 -552)">{inner}</g>'


def svg(w, h, body, view=None):
    vb = view or f"0 0 {w} {h}"
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" width="{w}" height="{h}">{body}</svg>'


TILE_GLYPH = centred(glyph(), 0.96)
symbol_rounded = svg(1024, 1024, f'<rect width="1024" height="1024" rx="232" fill="{FOREST}"/>{TILE_GLYPH}')
symbol_square = svg(1024, 1024, f'<rect width="1024" height="1024" fill="{FOREST}"/>{TILE_GLYPH}')
# Android adaptive icon: visible safe zone is a 66/108 circle (~625px) → shrink the glyph.
adaptive_fg = svg(1024, 1024, centred(glyph(), 0.66))
adaptive_bg = svg(1024, 1024, f'<rect width="1024" height="1024" fill="{FOREST}"/>')
adaptive_mono = svg(1024, 1024, centred(glyph("#FFFFFF", "#FFFFFF"), 0.66))
splash = svg(1024, 1024, centred(glyph(), 1.0))

# --- Lockup: badge + outlined wordmark. Height 200, badge 200, gap 56.
word_d, word_w, _, _ = outline("mesura", str(FONT), 200, tracking=-4)
BADGE, GAP, H = 200, 56, 200
LOCK_W = BADGE + GAP + word_w
# x-height of the face is ~0.56em: put the baseline so the word sits optically centred on the badge.
BASELINE = 156


def lockup(word_ink, badge_bg, badge_ink, badge_line):
    badge = (f'<rect width="{BADGE}" height="{BADGE}" rx="46" fill="{badge_bg}"/>'
             f'<g transform="scale({BADGE / 1024})">{centred(glyph(badge_ink, badge_line), 0.96)}</g>')
    word = f'<g transform="translate({BADGE + GAP} {BASELINE})"><path d="{word_d}" fill="{word_ink}"/></g>'
    return svg(round(LOCK_W), H, badge + word)


logo = lockup(FOREST, FOREST, CREAM, MINT)
logo_white = lockup(CREAM, CREAM, FOREST, ACCENT)
wordmark = svg(round(word_w), 210, f'<g transform="translate(0 156)"><path d="{word_d}" fill="{FOREST}"/></g>')
wordmark_white = svg(round(word_w), 210, f'<g transform="translate(0 156)"><path d="{word_d}" fill="{CREAM}"/></g>')

masters = {
    "mesura-symbol.svg": symbol_rounded,
    "mesura-logo.svg": logo,
    "mesura-logo-white.svg": logo_white,
    "mesura-wordmark.svg": wordmark,
    "mesura-wordmark-white.svg": wordmark_white,
}
for name, content in masters.items():
    (brand / name).write_text(content + "\n")

jobs = []


def job(name, content, out, w, h, transparent=True):
    html = jobs_dir / f"{name}.html"
    html.write_text(f'<!doctype html><meta charset="utf-8"><style>html,body{{margin:0;background:transparent}}'
                    f'svg{{display:block;width:{w}px;height:{h}px}}</style>{content}')
    jobs.append({"html": str(html), "png": str(out), "w": w, "h": h, "transparent": transparent})


# App assets (Expo / Android).
job("icon", symbol_square, assets / "icon.png", 1024, 1024, transparent=False)
job("fg", adaptive_fg, assets / "android-icon-foreground.png", 1024, 1024)
job("bg", adaptive_bg, assets / "android-icon-background.png", 1024, 1024, transparent=False)
job("mono", adaptive_mono, assets / "android-icon-monochrome.png", 1024, 1024)
job("splash", splash, assets / "splash-icon.png", 1024, 1024)
job("favicon", symbol_rounded, assets / "favicon.png", 48, 48)
# In-app logo images (@3x of a 40pt-high lockup).
lw = round(LOCK_W * 120 / H)
job("logo-app", logo, assets / "brand/logo.png", lw, 120)
job("logo-app-white", logo_white, assets / "brand/logo-white.png", lw, 120)
job("wordmark-app-white", wordmark_white, assets / "brand/wordmark-white.png", round(word_w * 0.4), 84)
# Brand kit PNGs.
job("k-symbol", symbol_rounded, brand / "png/mesura-symbol-1024.png", 1024, 1024)
job("k-logo", logo, brand / "png/mesura-logo-1600.png", 1600, round(1600 * H / LOCK_W))
job("k-logo-white", logo_white, brand / "png/mesura-logo-white-1600.png", 1600, round(1600 * H / LOCK_W))

(jobs_dir / "jobs.json").write_text(json.dumps(jobs, indent=1))
print(len(masters), "SVG masters,", len(jobs), "PNG jobs; lockup width", round(LOCK_W))
