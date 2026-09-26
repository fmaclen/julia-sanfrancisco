"""The frame every witness scene is painted for: its size, the camera, and the safe area each screen can see.

The painting is 1768 x 890 and fills the window's height at its natural size, centred on the witness. Measured from
real screens:
  - modern phones (iPhone 15 and up) see a strip about 410 px wide round the witness; an iPhone SE about 500 px
  - the top bar covers down to y 117; subtitles start at y 587 on desktop; the nav starts at y 770
So the witness and whatever says what the place is must sit in the safe box, x 689-1079, y 125-580, with the
witness centred on x 884.

World coordinates: x to the right, y up, z away from the camera, in metres.
"""
import math

W, H = 1768, 890
SAFE = (689, 125, 1079, 580)
PHONE = (679, 1089)           # iPhone 15 and up
SE = (634, 1134)              # iPhone SE
DESK = (93, 1675)             # 1080p desktop
TOPBAR, SUBS = 117, 587


class Cam:
    """A level camera turned `yaw` degrees to the right, focal length `f` in pixels, horizon at y `cy`.

    The horizon is moved with a lens shift rather than a tilt, so verticals stay vertical.
    """

    def __init__(self, pos=(0, 1.6, 0), yaw=35, f=1300, cy=431):
        self.pos, self.f, self.cy = pos, f, cy
        self.yaw = math.radians(yaw)

    def p2(self, x, y, z):
        """World point to picture pixel."""
        x, y, z = x - self.pos[0], y - self.pos[1], z - self.pos[2]
        c, s = math.cos(self.yaw), math.sin(self.yaw)
        x, z = x * c - z * s, x * s + z * c
        z = max(z, 0.05)
        return W / 2 + self.f * x / z, self.cy - self.f * y / z

    def ahead(self, distance):
        """The world (x, z) straight ahead of the camera at `distance`: where to stand the witness."""
        return math.sin(self.yaw) * distance, math.cos(self.yaw) * distance


def _fonts():
    # PIL is imported here, not at the top, so Blender's Python can import this module for the frame and camera
    from PIL import ImageFont
    return (ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf', 22),
            ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf', 18))


def zones(im):
    """Draw the no-go bands, what each screen sees, and the safe box over a storyboard render."""
    from PIL import ImageDraw
    _font, _small = _fonts()
    d = ImageDraw.Draw(im, 'RGBA')
    red = (220, 40, 40, 255)
    d.rectangle([0, 0, W, TOPBAR], fill=(220, 40, 40, 40))
    d.rectangle([0, SUBS, W, H], fill=(220, 40, 40, 40))
    d.text((12, 8), 'TOP BAR: nothing important up here', fill=red, font=_font)
    d.text((12, SUBS + 8), 'SUBTITLES AND NAV: floor only, dark, low detail', fill=red, font=_font)
    for x in DESK:
        d.line([x, 0, x, H], fill=(120, 120, 120, 255), width=2)
    d.text((DESK[0] + 8, TOPBAR + 8), 'desktop edge', fill=(90, 90, 90), font=_small)
    for x in SE:
        d.line([x, TOPBAR, x, SUBS], fill=(200, 150, 0, 255), width=2)
    d.rectangle(SAFE, outline=(0, 160, 60, 255), width=5)
    d.text((SAFE[0] + 8, SAFE[1] + 8), 'SAFE AREA: the witness and', fill=(0, 130, 50), font=_small)
    d.text((SAFE[0] + 8, SAFE[1] + 30), 'what the place is, on every screen', fill=(0, 130, 50), font=_small)
    return im


def overlay(render, labels, cam, out):
    """The storyboard the image model sees: the Blender render, the zones, and labels at world points."""
    from PIL import Image, ImageDraw
    _, _small = _fonts()
    im = Image.open(render).convert('RGB')
    zones(im)
    d = ImageDraw.Draw(im)
    for xyz, text in labels:
        d.text(cam.p2(*xyz), text, fill=(15, 15, 15), font=_small, stroke_width=3, stroke_fill=(255, 255, 255))
    im.save(out)
