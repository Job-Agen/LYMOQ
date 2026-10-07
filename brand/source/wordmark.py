"""Outline a word in Plus Jakarta Sans to a single SVG path (no font needed at render time)."""
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen


def outline(text: str, font_path: str, size: float, tracking: float = 0.0):
    """Return (path_d, width, ascent_px, descent_px) with the baseline at y=0."""
    font = TTFont(font_path)
    upm = font["head"].unitsPerEm
    scale = size / upm
    glyphs = font.getGlyphSet()
    cmap = font.getBestCmap()
    hmtx = font["hmtx"]
    pen = SVGPathPen(glyphs)
    x = 0.0
    for i, ch in enumerate(text):
        name = cmap[ord(ch)]
        # Flip Y (font units are y-up) and scale to px.
        glyphs[name].draw(TransformPen(pen, (scale, 0, 0, -scale, x, 0)))
        x += hmtx[name][0] * scale
        if i < len(text) - 1:
            x += tracking
    os2 = font["OS/2"]
    return pen.getCommands(), x, os2.sTypoAscender * scale, -os2.sTypoDescender * scale


if __name__ == "__main__":
    d, w, a, de = outline(sys.argv[1], sys.argv[2], float(sys.argv[3]))
    print(w, a, de)
    print(d[:200])
