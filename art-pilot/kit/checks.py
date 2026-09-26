"""Automatic checks on a new scene painting, run before anyone looks at it.

    python3 art-pilot/kit/checks.py market east-asia   # painting-east-asia-new.png, or painting-east-asia.png

  - size: the painting should come back near 1768 x 890 (a wider or taller one frames differently on every screen)
  - sharpness: how much of the finest detail survives next to slightly coarser detail, so a busy band and a plain
    one score alike when both are crisp. Measured on the snap.py grid (one value per 2 x 2 block), so it reads the
    same before and after snapping. On the market: fresh generations score 0.28-0.36 in the middle band, a painting
    four edits deep 0.25, one drawn soft from a blurry reference 0.27.
  - blur: pixel art has no depth of field; the bottom band must stay above 0.6 x the middle band's sharpness
    (paintings with a blurred foreground scored 0.45-0.50, sharp ones 0.72 and up)
  - softening: every edit redraws the whole picture a little softer; the middle band must stay above 0.28
  - phone strips: prints which painting columns each screen shows round the seat, to compare against what hangs,
    stands or sits near those edges (nothing should straddle one)
The rest is judged on the screenshots from shoot.mjs.
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

from snap import BLOCK

ROOT = Path(__file__).resolve().parents[1]
SCREENS = {'iPhone SE': (375, 667), 'iPhone 15': (393, 852), '1080p desktop': (1920, 1080)}


def sharpness(a, top, bottom):
    """Finest detail (under 1 px) over slightly coarser detail (under 4 px) in a horizontal band, top/bottom as fractions."""
    band = slice(int(a.shape[0] * top), int(a.shape[0] * bottom))
    return (a - ndimage.gaussian_filter(a, 1))[band].var() / (a - ndimage.gaussian_filter(a, 4))[band].var()


def main(name, theme):
    scene = ROOT / 'scenes' / name
    new = scene / f'painting-{theme}-new.png'
    path = new if new.exists() else scene / f'painting-{theme}.png'
    im = Image.open(path)
    w, h = im.size
    info = json.loads((scene / 'scene.json').read_text())['paintings'].get(theme, {})
    seat = info.get('seat', w / 2)
    if 'seat' not in info:
        print(f'  no seat for {theme} in scene.json yet: strips below assume the witness is centred')
    ok = True
    print(path.name, f'{w} x {h}')
    if abs(w / h - 1768 / 890) > 0.05:
        ok = False
        print(f'  FAIL size: aspect {w / h:.2f}, expected {1768 / 890:.2f}')
    a = np.asarray(im.convert('L').resize((1768, 890)).resize((1768 // BLOCK, 890 // BLOCK), Image.BOX)).astype(float)
    mid, low = sharpness(a, 0.34, 0.62), sharpness(a, 0.84, 1)
    print(f'  softening: middle band sharpness {mid:.3f}', '' if mid > 0.28 else '-> FAIL, too soft (too many edits?)')
    print(f'  blur: bottom band is {low / mid:.2f} x as sharp as the middle', '' if low / mid > 0.6 else '-> FAIL, depth of field')
    ok &= mid > 0.28 and low / mid > 0.6
    for screen, (vw, vh) in SCREENS.items():
        half = vw / 2 / (vh / h)
        x0, x1 = max(0, seat - half), min(w, seat + half)
        if x0 == 0 or x1 == w:              # the painting is pinned to an edge rather than centred on the seat
            x0, x1 = (0, 2 * half) if x0 == 0 else (w - 2 * half, w)
        print(f'  {screen} sees x {x0:.0f}-{x1:.0f}')
    print('PASS' if ok else 'FAIL')


if __name__ == '__main__':
    main(*sys.argv[1:3])
