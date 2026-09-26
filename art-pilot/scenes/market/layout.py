"""Market: a street merchant behind his produce stall, set against a building wall so it could be in any city.

Level camera turned 35 degrees; the stall's table runs away to the right. Each stall's table stands fully under
its own canopy, on four legs at the canopy's corners; the flower stall on the left stands side by side with his. Between his stall and a pickup parked in the row: stacks of empty
crates, a sack, a hand truck. Produce hangs from his canopy in uneven clusters, clear of his head, and the only
pieces inside the phone strip are the cluster on his left and one bag of onions on his right.

Rendered per theme by ../../kit/storyboard.py: the theme's acting beat in scene.json picks the witness's pose and
where they look; everything else is the same for every theme.
"""
import json
import math
import os
import random
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'kit'))
import blender_kit as k  # noqa: E402
from blender_kit import box, crate, rnd  # noqa: E402
from frame import Cam  # noqa: E402

CAM = Cam(yaw=35)
k.start(21)

wx, wz = CAM.ahead(5.0)                       # the merchant, centred in the frame
cz0, cz1 = wz - 0.55, wz - 0.2                # the tables, front and back edge
wall = wz + 1.6
front, back = cz0 - 0.6, wall - 0.45          # his canopy, front and back legs
pl, pr = 1.13, 4.2                            # his left and right legs, clear of the safe box
fr = pl - 0.08                                # the flower stall's right legs, just left of his: two poles side by side
ff, fb = front, back

# ground, wall, roller shutters and the pilasters between them
box(-10, 18, -0.05, 0, -2, wall + 0.3, 'b9b2a6')
box(-10, 18, 0, 7, wall, wall + 0.3, 'c8bfae')
x = -9.0
while x < 18:
    box(x, x + 0.5, 0, 7, wall - 0.12, wall, 'b8ae9c')
    box(x + 0.5, x + 3.9, 0, 2.9, wall - 0.04, wall, '7d8088')
    x += 4.4

# stacks of crates behind him, uneven, with gaps
x = pl + 0.05
while x < pr - 0.1:
    w = rnd.uniform(0.35, 0.6)
    n = rnd.choice([2, 3, 3, 4, 5])
    y = 0
    for i in range(n):
        h = rnd.choice([0.25, 0.3, 0.4])
        col = rnd.choice(k.CRATES + ['c79a5a'])
        crate(x, wz + 0.55 + rnd.uniform(0, 0.15), w, 0.4, h, col, y0=y, turn=rnd.uniform(-6, 6),
              fill=rnd.choice(k.PRODUCE) if i == n - 1 and rnd.random() < 0.7 else None)
        y += h
    x += w + rnd.uniform(0.03, 0.12)

# the merchant: pose and gaze from the theme's acting beat
THEME = os.environ['THEME']
beat = json.loads((Path(__file__).parent / 'scene.json').read_text())['paintings'][THEME]
d = math.hypot(wx, wz)
look = {'aside': (0.087, 0, -0.996),                  # just past the camera's right shoulder
        'camera': (-wx / d, 0, -wz / d)}[beat.get('look', 'aside')]
k.mannequin(wx, wz, look=look, table_z=cz1, pose=beat.get('pose', 'lean'))

# tables: cloth to 0.3 m above the pavement, crates underneath
for x0, x1, cloth in ((-4.5, fr - 0.05, '6f5a3a'), (pl + 0.05, pr - 0.05, '2f4a36')):   # each table under its own canopy
    box(x0, x1, 0.3, 0.9, cz0, cz1, cloth)
    x = x0 + 0.1
    while x < x1 - 0.4:
        w = rnd.uniform(0.35, 0.55)
        crate(x, cz0 + 0.02, w, 0.3, rnd.choice([0.2, 0.28]), rnd.choice(k.CRATES))
        x += w + rnd.uniform(0.1, 0.5)

# his goods: trays and crates of different sizes and heights, some gaps; bare patches for the scales and the payment prop
before = set(k.scene.objects)
x = pl + 0.08
while x < pr - 0.2:
    kind = rnd.random()
    w = rnd.uniform(0.25, 0.55)
    if kind < 0.12:
        x += rnd.uniform(0.1, 0.25)
        continue
    if kind < 0.6:
        crate(x, cz0 + 0.04, w, rnd.uniform(0.22, 0.3), 0.06, 'c79a5a', y0=0.9, fill=rnd.choice(k.PRODUCE))
    else:
        crate(x, cz0 + 0.04, w, 0.28, rnd.uniform(0.12, 0.2), rnd.choice(k.CRATES), y0=0.9, fill=rnd.choice(k.PRODUCE))
    x += w + rnd.uniform(0.02, 0.08)
k.clear(before, ((wx - 0.8, wx - 0.3), (wx + 0.3, wx + 0.8)))
k.cyl(wx - 0.55, cz0 + 0.18, 0.1, 0.9, 1.0, 'e6e6e6')                                     # scales
k.cyl(wx - 0.55, cz0 + 0.18, 0.16, 1.02, 1.08, 'c8c8c8', r2=0.2)
box(wx + 0.47, wx + 0.64, 0.9, 1.0, cz0 + 0.06, cz0 + 0.16, '2a2a2a', turn=-20)          # card reader, on its own
box(wx + 0.5, wx + 0.61, 1.0, 1.005, cz0 + 0.08, cz0 + 0.14, '7fd07f', turn=-20)

# the flower stall: a stepped stand of buckets at the back, buckets on its table and on the pavement
for zz, yy in ((wz + 0.35, 0.0), (wz + 0.05, 0.45)):
    if yy:
        box(-4.5, fr - 0.1, 0, yy + 0.02, zz - 0.15, zz + 0.15, '6b5a45')
    x = -4.4
    while x < fr - 0.25:
        if rnd.random() > 0.15:
            k.bucket(x, zz, yy + 0.02)
        x += rnd.uniform(0.25, 0.45)
x = -4.3
while x < pl - 0.2:
    if rnd.random() > 0.25:
        if rnd.random() < 0.6:
            k.bucket(x, cz0 + 0.17, 0.9)
        else:
            k.blob(x, 0.96, cz0 + 0.17, 0.18, 0.06, 0.1, rnd.choice(k.FLOWERS))
    x += rnd.uniform(0.25, 0.4)
x = -4.5
while x < pl - 0.3:
    if rnd.random() > 0.3:
        k.bucket(x, cz0 - 0.3 + rnd.uniform(-0.1, 0.1), 0)
    x += rnd.uniform(0.3, 0.55)

# crates of produce on the pavement, tucked just under the front of his table: mixed sizes, some stacked, turned a
# little, gaps. Anything nearer the camera sits in the subtitle band and tempts the model into depth-of-field blur.
x = pl + 0.1
while x < pr - 0.1:
    w, d = rnd.uniform(0.35, 0.6), rnd.uniform(0.3, 0.45)
    if rnd.random() < 0.2:
        x += rnd.uniform(0.2, 0.4)
        continue
    z = cz0 - d - 0.05 + rnd.uniform(-0.15, 0.1) * 0.2
    h = rnd.choice([0.2, 0.28, 0.35])
    crate(x, z, w, d, h, rnd.choice(k.CRATES), turn=rnd.uniform(-10, 10), fill=None if rnd.random() < 0.3 else rnd.choice(k.PRODUCE))
    if rnd.random() < 0.35:
        crate(x + 0.03, z + 0.02, w * 0.9, d * 0.9, 0.25, rnd.choice(k.CRATES), y0=h, turn=rnd.uniform(-8, 8), fill=rnd.choice(k.PRODUCE))
    x += w + rnd.uniform(0.03, 0.3)

# between his stall and the pickup: empty crates stacked unevenly, a sack, a hand truck
for x, z, n in ((4.45, 4.3, 6), (4.95, 4.6, 4), (4.7, 3.85, 2)):
    for i in range(n):
        box(x + rnd.uniform(-0.03, 0.03), x + 0.5, i * 0.28, i * 0.28 + 0.27, z, z + 0.38, rnd.choice(k.CRATES), turn=rnd.uniform(-8, 8))
k.blob(5.45, 0.2, 4.0, 0.22, 0.2, 0.18, 'b9a27a')
box(5.7, 5.74, 0, 1.3, 4.6, 4.64, '4a4a4a')
box(5.7, 6.0, 0, 0.04, 4.45, 4.8, '4a4a4a')

# the pickup, parked parallel to the row with its tail towards the stall
red = 'a8413a'
for xw in (6.9, 10.4):
    for zw in (3.45, 5.25):
        k.wheel(xw, zw, 0.36, 0.22)
box(6.2, 9.7, 0.45, 0.62, 3.45, 5.25, red)                                                # bed floor
box(6.2, 9.7, 0.62, 1.05, 3.45, 3.52, red)                                                # bed sides
box(6.2, 9.7, 0.62, 1.05, 5.18, 5.25, red)
box(6.2, 6.27, 0.62, 1.05, 3.45, 5.25, red)                                               # tailgate
box(9.7, 12.2, 0.45, 1.1, 3.45, 5.25, red)                                                # cab and bonnet
box(9.7, 11.3, 1.1, 1.85, 3.5, 5.2, red)
box(6.12, 6.2, 0.35, 0.47, 3.4, 5.3, '3a3a3a')                                            # bumper
box(6.17, 6.2, 0.7, 0.9, 3.5, 3.62, 'e04030')                                             # tail lights
box(6.17, 6.2, 0.7, 0.9, 5.08, 5.2, 'e04030')
box(6.16, 6.2, 0.5, 0.62, 4.2, 4.5, 'e6e6e6')                                             # blank plate
k.rod((6.05, 0.3, 3.75), (6.35, 0.3, 3.75), 0.035, '1a1a1a', seg=10)                      # exhaust pipe
x = 6.35
while x < 9.5:
    w = rnd.uniform(0.4, 0.6)
    n = rnd.choice([1, 1, 2])
    for i in range(n):
        crate(x, 3.6 + rnd.uniform(0, 0.8), w, 0.45, 0.28, rnd.choice(k.CRATES), y0=0.62 + i * 0.28, turn=rnd.uniform(-8, 8),
              fill=rnd.choice(k.PRODUCE) if i == n - 1 else None)
    x += w + rnd.uniform(0.05, 0.3)

# canopies, each on four legs
k.canopy(fr - 3.0, fr, ff, fb, '3f6b4a')
k.legs(fr - 3.0, fr, ff, fb)
k.canopy(pl, pr, front, back, 'efeae0')
k.legs(pl, pr, front, back)

# produce hung from his canopy in uneven clusters: a tight bunch on his left, one low bag of onions on his right,
# a smaller bunch by the right leg for desktop, nothing by the left leg; the space above his head stays clear.
# The model hangs things further out than drawn, so the two inside the phone strip sit close to his head.
rh = random.Random(5)                                                                     # its own sequence
hz = front + 0.08
for x, dz, kind, size in ((1.72, 0.0, 'garlic', 8), (1.78, 0.05, 'chillies', 5), (1.84, -0.03, 'oranges', 0.3),
                          (1.9, 0.04, 'garlic', 5), (2.4, 0.0, 'onions', 0.28),
                          (3.92, 0.02, 'chillies', 6), (3.98, -0.03, 'chillies', 4), (4.05, 0.03, 'garlic', 6)):
    if kind == 'garlic':
        k.string_of(x, hz + dz, 2.33, size, 0.035, 'efe6cf', rng=rh)
    elif kind == 'chillies':
        k.string_of(x, hz + dz, 2.33, size, 0.03, 'c0392b', rng=rh)
    else:
        k.net_bag(x, hz + dz, 2.33, size, 'f08a1c' if kind == 'oranges' else 'b06a3a', rng=rh,
                  cord=0.3 if kind == 'onions' else 0.12)

LABELS = [((wx + 0.3, 1.6, wz), 'the merchant, head to hands'),
          ((-2.5, 2.0, cz0), 'flower stall'),
          ((wx - 1.2, 1.25, cz0), 'produce in crates and trays'),
          ((pl, 2.0, front), 'canopy leg'), ((pr, 2.0, front), 'canopy leg'),
          ((1.3, 2.0, front), 'produce hung in clusters'),
          ((wx + 0.5, 0.7, cz0 - 0.05), 'payment, on its own'),
          ((4.45, 1.3, 4.3), 'empty crates'),
          ((6.6, 1.5, 3.45), 'pickup, bed of crates'), ((5.6, 0.12, 3.75), 'exhaust')]
k.render(CAM, Path(__file__).parent / f'render-{THEME}.png', LABELS)
