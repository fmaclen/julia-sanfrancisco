"""Snap a painting onto a grid of 2 x 2 pixel blocks, each one flat colour: the model only imitates pixel art, with
blocks of uneven size and soft edges between them. No palette is forced; each block keeps its average colour.

    python3 art-pilot/kit/snap.py market east-asia   # painting-east-asia-new.png, or painting-east-asia.png, in place

imagegen.py snaps every result before writing it, so this is only needed for a painting made some other way.
Snapping a snapped painting changes nothing.
"""
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BLOCK = 2


def snap(im):
    w, h = im.size
    small = im.convert('RGB').resize((w // BLOCK, h // BLOCK), Image.BOX)
    return small.resize((w // BLOCK * BLOCK, h // BLOCK * BLOCK), Image.NEAREST)


def main(name, theme):
    scene = ROOT / 'scenes' / name
    new = scene / f'painting-{theme}-new.png'
    path = new if new.exists() else scene / f'painting-{theme}.png'
    snap(Image.open(path)).save(path)
    print(path)


if __name__ == '__main__':
    main(*sys.argv[1:3])
