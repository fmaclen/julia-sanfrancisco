"""Crude parts for storyboard scenes, built and rendered in Blender (imported by a scene's layout.py).

Shapes stay crude on purpose; what matters to the image model is that depth is right and that nothing repeats:
vary sizes, colours and spacing, leave gaps, and cluster things unevenly. Colours are hex sRGB strings.

World coordinates as in frame.py (x right, y up, z away from the camera), mapped to Blender as (x, z, y).
`rnd` drives every random choice in a scene; seed it once at the top of layout.py so the layout is repeatable.
"""
import json
import math
import random
import sys
from pathlib import Path

import bmesh
import bpy
from mathutils import Matrix, Vector

sys.path.insert(0, str(Path(__file__).parent))
from frame import H, W  # noqa: E402

rnd = random.Random(0)
scene = None

PRODUCE = ['d8402c', 'f2c230', 'f08a1c', '8cc43c', '2f7a36', '6b2f6e', 'e87a8a', 'a8744a', 'efe6cf', 'c23a3a', 'b8d86a']
CRATES = ['3f6fa8', '2f7a4a', 'b8452f', '3a3a3a', '8a8d93', 'c79a5a']
FLOWERS = ['f4d03f', 'e84a5f', 'f7f2e8', 'b784d8', 'f39c12', 'ff8fb1', 'c0392b', '9b59b6']
WOOD, JOINT = 'e0a96d', '6b4a2e'


def start(seed):
    """An empty scene and a seeded random sequence."""
    global scene
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    rnd.seed(seed)


def rgb(h):
    """A hex sRGB colour as the linear RGBA Blender stores in object colours."""
    lin = [(c / 12.92) if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in (int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))]
    return tuple(lin) + (1,)


def obj(bm, col, name='o'):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    o = bpy.data.objects.new(name, me)
    o.color = rgb(col)
    scene.collection.objects.link(o)
    return o


def box(x0, x1, y0, y1, z0, z1, col, turn=0):
    """An axis-aligned box, optionally turned about its vertical axis (degrees)."""
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1)
    bmesh.ops.scale(bm, vec=(x1 - x0, z1 - z0, y1 - y0), verts=bm.verts)
    if turn:
        bmesh.ops.rotate(bm, verts=bm.verts, cent=(0, 0, 0), matrix=Matrix.Rotation(math.radians(turn), 3, 'Z'))
    bmesh.ops.translate(bm, vec=((x0 + x1) / 2, (z0 + z1) / 2, (y0 + y1) / 2), verts=bm.verts)
    return obj(bm, col)


def cyl(x, z, r, y0, y1, col, r2=None, seg=16):
    """An upright cylinder, or a tapered bucket when r2 gives the top radius."""
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=seg, radius1=r, radius2=r2 or r, depth=y1 - y0)
    bmesh.ops.translate(bm, vec=(x, z, (y0 + y1) / 2), verts=bm.verts)
    return obj(bm, col)


def rod(a, b, r, col, r2=None, seg=12):
    """A cylinder from world point a to world point b: a limb, a pipe, a pole at an angle."""
    va, vb = Vector((a[0], a[2], a[1])), Vector((b[0], b[2], b[1]))
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=seg, radius1=r, radius2=r2 or r, depth=(vb - va).length)
    bmesh.ops.rotate(bm, verts=bm.verts, cent=(0, 0, 0), matrix=Vector((0, 0, 1)).rotation_difference(vb - va).to_matrix())
    bmesh.ops.translate(bm, vec=(va + vb) / 2, verts=bm.verts)
    return obj(bm, col)


def wheel(x, z, r, width, col='242424'):
    """A wheel standing on the ground, its axle along z."""
    return rod((x, r, z - width / 2), (x, r, z + width / 2), r, col, seg=20)


def blob(x, y, z, rx, ry, rz, col):
    """A squashed sphere: a heap of produce, a bunch of flowers, a sack, a head."""
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=14, v_segments=8, radius=1)
    bmesh.ops.scale(bm, vec=(rx, rz, ry), verts=bm.verts)
    bmesh.ops.translate(bm, vec=(x, z, y), verts=bm.verts)
    return obj(bm, col)


def canopy(x0, x1, z0, z1, col, height=2.4):
    """A pop-up canopy roof: a low pyramid on a frame, with a valance round the edge. Add its legs() too."""
    bm = bmesh.new()
    c = [bm.verts.new(v) for v in ((x0, z0, height), (x1, z0, height), (x1, z1, height), (x0, z1, height))]
    apex = bm.verts.new(((x0 + x1) / 2, (z0 + z1) / 2, height + 0.45))
    for i in range(4):
        bm.faces.new((c[i], c[(i + 1) % 4], apex))
    bm.faces.new(c[::-1])
    obj(bm, col)
    for a, b in (((x0, x1), (z0 - 0.01, z0 + 0.01)), ((x0, x1), (z1 - 0.01, z1 + 0.01)),
                 ((x0 - 0.01, x0 + 0.01), (z0, z1)), ((x1 - 0.01, x1 + 0.01), (z0, z1))):
        box(a[0], a[1], height - 0.2, height, b[0], b[1], col)


def legs(x0, x1, z0, z1, height=2.4):
    """The four legs under a canopy. Always all four: a roof with missing legs reads as floating."""
    for x, z in ((x0, z0), (x1, z0), (x0, z1), (x1, z1)):
        cyl(x, z, 0.025, 0, height, '8a8d93', seg=8)


def heap(x, w, z, d, y, col):
    """Produce in a crate or tray: a smooth heap, loose round fruit, leafy greens or upright bunches, at random."""
    kind = rnd.random()
    if kind < 0.3:
        blob(x + w / 2, y, z + d / 2, w * 0.45, 0.05 + rnd.random() * 0.07, d * 0.42, col)
    elif kind < 0.6:
        r = rnd.uniform(0.035, 0.06)
        for _ in range(int(w * d / (r * r) * 0.5)):
            blob(x + rnd.uniform(r, w - r), y + rnd.uniform(0, r), z + rnd.uniform(r, d - r), r, r, r, col)
    elif kind < 0.85:
        for _ in range(rnd.randint(2, 4)):
            blob(x + rnd.uniform(0.2, 0.8) * w, y + 0.03, z + rnd.uniform(0.3, 0.7) * d, w * rnd.uniform(0.25, 0.4),
                 rnd.uniform(0.05, 0.1), d * rnd.uniform(0.3, 0.45), rnd.choice(['2f7a36', '4f9a3a', '8cc43c']))
    else:
        for _ in range(rnd.randint(3, 6)):
            bx, bz, t = x + rnd.uniform(0.15, 0.85) * w, z + rnd.uniform(0.25, 0.75) * d, rnd.uniform(0.15, 0.3)
            cyl(bx, bz, 0.02, y, y + t, 'efe6cf', seg=6)
            blob(bx, y + t, bz, 0.05, 0.07, 0.05, '4f9a3a')


def crate(x, z, w, d, h, col, y0=0.0, turn=0, fill=None):
    """A crate or tray from (x, z), w wide and d deep, with a heap of `fill` colour in it."""
    box(x, x + w, y0, y0 + h, z, z + d, col, turn)
    if fill:
        heap(x, w, z, d, y0 + h, fill)


def bucket(x, z, y0):
    """A metal bucket of flowers."""
    r, h = rnd.uniform(0.1, 0.16), rnd.uniform(0.25, 0.45)
    cyl(x, z, r * 0.8, y0, y0 + h, 'a9adb3', r2=r)
    for _ in range(rnd.randint(2, 4)):
        blob(x + rnd.uniform(-r, r) * 0.6, y0 + h + rnd.uniform(0.08, 0.35), z + rnd.uniform(-r, r) * 0.6,
             rnd.uniform(0.07, 0.13), rnd.uniform(0.06, 0.12), rnd.uniform(0.07, 0.13), rnd.choice(FLOWERS))
    blob(x, y0 + h + 0.05, z, r * 1.1, 0.12, r * 1.1, '3f7a3a')


def string_of(x, z, top, n, r, col, rng=rnd):
    """A string of garlic bulbs or chillies hanging from `top`: a cord with beads down it."""
    cyl(x, z, 0.006, top - n * r * 1.7, top, 'd8cfae', seg=6)
    for i in range(n):
        blob(x + rng.uniform(-0.01, 0.01), top - 0.05 - i * r * 1.6, z, r, r * 1.1, r, col)


def net_bag(x, z, top, length, col, rng=rnd, cord=0.12):
    """A net bag of fruit on a cord from `top`: loose round fruit bunched into a teardrop."""
    cyl(x, z, 0.006, top - cord, top, 'd8cfae', seg=6)
    for i in range(int(length / 0.05)):
        t = i / (length / 0.05)
        w = 0.035 + 0.05 * math.sin(math.pi * min(1, t * 1.3))
        blob(x + rng.uniform(-w, w), top - cord - t * length, z + rng.uniform(-w, w) * 0.6, 0.04, 0.04, 0.04, col)


def clear(before, ranges):
    """Remove objects made since the set `before` that overlap any x range: a bare patch round a small prop.

    Place everything first, then clear, so the random sequence (and the rest of the layout) does not shift.
    """
    for o in set(scene.objects) - before:
        xs = [v.co.x for v in o.data.vertices]
        if any(max(xs) > a and min(xs) < b for a, b in ranges):
            bpy.data.objects.remove(o)


POSES = {                                     # pose: (arm on the viewer's left, arm on the viewer's right, forward lean)
    'lean': ('table', 'table', 0.1),          # leaning forward, both hands flat on the table edge
    'arms-crossed': ('crossed', 'crossed', 0.0),
    'tea': ('cup', 'table', 0.03),            # a small glass held at the chest, the other hand on the table
    'neck': ('table', 'neck', 0.05),          # rubbing the back of the neck, the other hand on the table
}


def mannequin(x, z, look, table_z, pose='lean'):
    """The witness stand-in: a wooden artist's mannequin with human proportions, standing at (x, z), about 1.75 m tall.

    `look` is the world direction the head faces, (dx, 0, dz); a nose and two eyes make it readable. Towards the
    camera is (-x, 0, -z) normalised; three-quarter view towards one side still shows both eyes.
    `pose` is one of POSES; a witness's acting beat picks it. `table_z` is the table's back edge, where hands rest.
    """
    def limb(a, b, r):
        rod(a, b, r, WOOD, r2=r * 0.85)
        blob(a[0], a[1], a[2], r * 1.3, r * 1.3, r * 1.3, JOINT)

    arms = POSES[pose]
    lean = arms[2]                                                          # how far the shoulders come forward
    blob(x, 1.24, z - 0.7 * lean, 0.2, 0.2, 0.12, WOOD)                     # chest
    blob(x, 1.08, z - 0.3 * lean, 0.16, 0.14, 0.11, WOOD)                   # belly
    blob(x, 0.97, z, 0.17, 0.1, 0.11, WOOD)                                 # pelvis
    for sd, arm in ((-1, arms[0]), (1, arms[1])):
        limb((x + sd * 0.1, 0.92, z), (x + sd * 0.1, 0.5, z - 0.02), 0.065)
        limb((x + sd * 0.1, 0.5, z - 0.02), (x + sd * 0.1, 0.08, z), 0.05)
        sh = (x + sd * 0.2, 1.4, z - lean)
        if arm == 'table':
            el, wr = (x + sd * 0.28, 1.15, z - lean - 0.1), (x + sd * 0.25, 0.95, table_z - min(0.1, z - table_z))
            hand = (wr[0], 0.93, wr[2] - 0.04, 0.045, 0.025, 0.07)          # flat on the table
        elif arm == 'crossed':
            el, wr = (x + sd * 0.23, 1.13, z - 0.1), (x - sd * 0.1, 1.2 + sd * 0.02, z - 0.17 - sd * 0.01)
            hand = (wr[0], wr[1], wr[2], 0.045, 0.04, 0.03)                 # tucked at the other elbow
        elif arm == 'cup':
            el, wr = (x + sd * 0.25, 1.1, z - 0.08), (x + sd * 0.1, 1.22, z - 0.26)
            hand = (wr[0], wr[1], wr[2], 0.04, 0.045, 0.04)
            cyl(wr[0], wr[2] - 0.02, 0.028, wr[1] + 0.02, wr[1] + 0.1, 'd8e4e8')   # the glass
        else:                                                               # neck
            el, wr = (x + sd * 0.3, 1.66, z - 0.08), (x + sd * 0.06, 1.56, z + 0.06)
            hand = (wr[0], wr[1], wr[2], 0.045, 0.05, 0.035)                # behind the neck
        limb(sh, el, 0.045)
        limb(el, wr, 0.038)
        blob(*hand, WOOD)
    limb((x, 1.44, z - lean), (x, 1.52, z - lean - 0.01), 0.035)           # neck
    hx, hy, hz = x, 1.62, z - lean - 0.02
    blob(hx, hy, hz, 0.075, 0.105, 0.085, WOOD)                             # head
    blob(hx + look[0] * 0.085, hy - 0.015, hz + look[2] * 0.085, 0.02, 0.028, 0.02, WOOD)   # nose
    for a in (-28, 28):                                                     # eyes, either side of the nose
        c, s = math.cos(math.radians(a)), math.sin(math.radians(a))
        ex, ez = look[0] * c - look[2] * s, look[0] * s + look[2] * c
        blob(hx + ex * 0.078, hy + 0.015, hz + ez * 0.078, 0.013, 0.013, 0.013, '2a1f16')


def render(cam, out, labels=()):
    """Render through a frame.Cam to `out` (PNG), and write the camera and labels next to it for the overlay step."""
    data = bpy.data.cameras.new('cam')
    data.sensor_fit, data.sensor_width = 'HORIZONTAL', 36
    data.lens = cam.f * 36 / W
    data.shift_y = (cam.cy - H / 2) / W                                     # horizon above centre: shift the frame down
    data.clip_start = 0.1
    o = bpy.data.objects.new('cam', data)
    o.location = (cam.pos[0], cam.pos[2], cam.pos[1])
    o.rotation_euler = (math.radians(90), 0, -cam.yaw)
    scene.collection.objects.link(o)
    scene.camera = o
    scene.render.engine = 'BLENDER_WORKBENCH'
    scene.render.resolution_x, scene.render.resolution_y, scene.render.resolution_percentage = W, H, 100
    sh = scene.display.shading
    sh.light, sh.color_type = 'STUDIO', 'OBJECT'
    sh.show_object_outline, sh.object_outline_color = True, (0.15, 0.15, 0.15)
    sh.show_shadows, sh.shadow_intensity = True, 0.2
    scene.view_settings.view_transform, scene.view_settings.exposure = 'Standard', 0.8
    scene.world = bpy.data.worlds.new('w')
    scene.world.color = (0.9, 0.9, 0.88)
    scene.render.filepath = str(out)
    bpy.ops.render.render(write_still=True)
    Path(out).with_suffix('.json').write_text(json.dumps({
        'cam': {'pos': list(cam.pos), 'yaw': math.degrees(cam.yaw), 'f': cam.f, 'cy': cam.cy},
        'labels': [[list(p), t] for p, t in labels]}))
