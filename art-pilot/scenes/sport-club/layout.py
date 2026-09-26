"""Sport club: a waitress in the clubhouse lounge of a tennis club, as in the game's atlas (bar, booth, set tables).

Camera turned 30 degrees to the left, from a little above head height with the horizon high in the frame, so the
room runs away to the left, the floor shows and the ceiling stays out of the picture; she is in full, head to feet.
Behind her a row of tall windows looks out onto a red clay court right outside (white lines, the net running away
from the glass, a green windscreen fence and a hedge beyond), so the place reads as a tennis club and no sky shows.
The bar stands against the far end wall on the left, a booth beside it. Tables in two loose rows parallel to the
windows, chairs squared up to them. She stands beside her table, order pad at her chest, a hand on a chair back.

Rendered per theme by ../../kit/storyboard.py, like the market.
"""
import json
import math
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'kit'))
import blender_kit as k  # noqa: E402
from blender_kit import box, cyl, rnd  # noqa: E402
from frame import Cam  # noqa: E402

CAM = Cam(pos=(0, 2.1, 0), yaw=-30, f=1150, cy=107)
k.start(8)

wx, wz = CAM.ahead(5.0)                       # the waitress, centred in the frame
wall = wz + 2.6                               # the window wall behind her
E = wx - 7.0                                  # the far end wall, on the left
H = 3.3                                       # ceiling

# floor, ceiling, end wall; the window wall: sill, header, mullions
box(E - 0.3, 40, -0.05, 0, -4, wall + 0.3, '9a6b45')
box(E - 0.3, 40, H, H + 0.1, -4, wall + 0.3, 'e8e2d6')
box(E - 0.3, E, 0, H, -4, wall + 0.3, 'd9cfbd')
box(E, 40, 0, 0.3, wall, wall + 0.3, 'd9cfbd')
box(E, 40, 2.9, H, wall, wall + 0.3, 'd9cfbd')
x = E
while x < 40:
    box(x, x + 0.14, 0.3, 2.9, wall, wall + 0.3, '3a3a3a')
    x += 1.6

# outside: the clay court alongside the building, its lines, the net running away from the glass, fence, hedge
box(E - 40, 60, -0.02, 0, wall + 0.3, wall + 16, 'b8603a')
for z in (wall + 1.5, wall + 2.9, wall + 11.1, wall + 12.5):
    box(E - 40, 60, 0, 0.01, z, z + 0.08, 'f4f4f4')
for x in (wx - 9.0, wx - 3.5, wx + 8.5):
    box(x, x + 0.08, 0, 0.01, wall + 1.5, wall + 12.5, 'f4f4f4')
nx = wx + 2.5
box(nx, nx + 0.02, 0, 0.9, wall + 1.2, wall + 12.8, '4a4a4a')
box(nx - 0.02, nx + 0.04, 0.9, 1.0, wall + 1.2, wall + 12.8, 'f4f4f4')
for z in (wall + 1.2, wall + 12.8):
    cyl(nx, z, 0.04, 0, 1.07, '3a3a3a', seg=8)
box(E - 40, 60, 0, 3.5, wall + 14, wall + 14.05, '2f5a3e')
box(E - 40, 60, 3.5, 20, wall + 15, wall + 16, '3d6b35')

# the bar against the end wall: shelves of bottles, the counter in front of them, stools
z0, z1 = wz - 1.5, wall - 1.3
for y in (1.3, 1.75):
    box(E, E + 0.3, y, y + 0.03, z0, z1, '6b4a2e')
    z = z0 + 0.1
    while z < z1 - 0.1:
        if rnd.random() > 0.2:
            cyl(E + 0.15, z, 0.04, y + 0.03, y + rnd.uniform(0.22, 0.34), rnd.choice(['2f6a3a', 'e8e2c0', '7a3a2a', 'c9a24a', 'dfe9ee']), seg=8)
        z += rnd.uniform(0.1, 0.22)
box(E + 0.9, E + 1.5, 0, 1.1, z0, z1, '6b4a2e')
box(E + 0.85, E + 1.55, 1.1, 1.15, z0 - 0.05, z1 + 0.05, '3a2a1c')
z = z0 + 0.4
while z < z1 - 0.2:
    cyl(E + 1.8, z, 0.03, 0, 0.75, '3a3a3a', seg=8)
    cyl(E + 1.8, z, 0.18, 0.75, 0.8, 'a8452f')
    z += 0.75

# a booth in the corner by the bar, against the windows
box(E + 0.3, E + 2.3, 0, 0.45, wall - 0.6, wall - 0.05, '8a2f2a')
box(E + 0.3, E + 2.3, 0.45, 1.05, wall - 0.2, wall - 0.05, '8a2f2a')


def table(x, z, r=0.4, set_=True):
    cyl(x, z, 0.03, 0, 0.75, '3a3a3a', seg=8)
    cyl(x, z, r, 0.72, 0.75, 'f2f0ea')
    if set_:
        for dz in (-0.2, 0.2):
            cyl(x, z + dz, 0.11, 0.75, 0.76, 'ffffff')
            cyl(x + 0.14, z + dz, 0.03, 0.75, 0.9, 'dfe9ee')


def chair(tx, tz, side, out=0.0):
    """A chair drawn up to the table at (tx, tz) on `side` ('front', 'back', 'left' or 'right'), pulled out by `out`."""
    dx, dz = {'front': (0, -1), 'back': (0, 1), 'left': (-1, 0), 'right': (1, 0)}[side]
    d = 0.5 + out
    x, z = tx + dx * d, tz + dz * d
    box(x - 0.21, x + 0.21, 0.44, 0.48, z - 0.21, z + 0.21, '6b4a2e')
    for ox, oz in ((-0.18, -0.18), (0.18, -0.18), (-0.18, 0.18), (0.18, 0.18)):
        cyl(x + ox, z + oz, 0.02, 0, 0.44, '3a2a1c', seg=6)
    bx, bz = x + dx * 0.2, z + dz * 0.2                                    # the back, on the side away from the table
    if dx:
        box(bx - 0.02, bx + 0.02, 0.48, 0.92, bz - 0.21, bz + 0.21, '6b4a2e')
    else:
        box(bx - 0.21, bx + 0.21, 0.48, 0.92, bz - 0.02, bz + 0.02, '6b4a2e')


table(E + 1.3, wall - 1.0)                                                  # the booth's table

# tables in two loose rows parallel to the windows, chairs squared up to them, one or two pulled out a little
for x, z, sides in ((wx - 4.4, wz + 1.2, ('left', 'right')), (wx - 1.9, wz + 1.2, ('back', 'front', 'left', 'right')),
                    (wx + 0.9, wz + 1.3, ('left', 'right')), (wx + 3.4, wz + 1.2, ('back', 'left')),
                    (wx - 3.6, wz - 0.6, ('back', 'front', 'right')), (wx - 1.3, wz - 1.1, ('left', 'right'))):
    table(x, z, set_=rnd.random() < 0.7)
    for side in sides:
        chair(x, z, side, out=0.15 if rnd.random() < 0.2 else 0.0)

# her table, set for two, to her right; she rests a hand on the back of the chair on its near side
tx, tz = wx + 0.95, wz - 0.1
table(tx, tz)
chair(tx, tz, 'left')
chair(tx, tz, 'right')

THEME = os.environ['THEME']
beat = json.loads((Path(__file__).parent / 'scene.json').read_text())['paintings'][THEME]
d = math.hypot(wx, wz)
look = {'aside': (0.087, 0, -0.996), 'camera': (-wx / d, 0, -wz / d)}[beat.get('look', 'aside')]
k.mannequin(wx, wz, look=look, table_z=wz - 0.05, pose=beat.get('pose', 'lean'))

LABELS = [((wx + 0.3, 1.6, wz), 'the waitress, head to feet'),
          ((tx - 0.7, 1.0, tz), 'chair back, her hand on it'),
          ((tx, 0.8, tz), 'her table, set for two'),
          ((E + 0.2, 2.1, z0 + 1.0), 'back bar, bottles'), ((E + 1.2, 1.2, z0 + 0.5), 'bar counter, stools'),
          ((E + 1.3, 1.1, wall - 0.3), 'booth'),
          ((wx - 1.0, 1.4, wall + 6), 'clay court through the windows')]
k.render(CAM, Path(__file__).parent / f'render-{THEME}.png', LABELS)
