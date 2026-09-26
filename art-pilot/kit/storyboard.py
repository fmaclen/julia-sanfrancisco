"""Render a scene's storyboard for a theme: Blender builds scenes/<name>/layout.py, then the zones and labels go on top.

    python3 art-pilot/kit/storyboard.py market africa

The layout reads the theme (THEME in its environment) to pose the witness. Writes scenes/<name>/render-<theme>.png
(the clean render) and scenes/<name>/storyboard-<theme>.png (what the image model sees).
Runs Blender in the background with factory settings, so an open Blender window is never touched.
"""
import json
import os
import subprocess
import sys
from pathlib import Path

from frame import Cam, overlay

ROOT = Path(__file__).resolve().parents[1]


def main(name, theme):
    scene = ROOT / 'scenes' / name
    run = subprocess.run(['blender', '--background', '--factory-startup', '--python', str(scene / 'layout.py')],
                         capture_output=True, text=True, env={**os.environ, 'THEME': theme})
    if run.returncode or 'Traceback' in run.stdout + run.stderr:
        sys.exit(run.stdout[-2000:] + run.stderr[-2000:])
    meta = json.loads((scene / f'render-{theme}.json').read_text())
    c = meta['cam']
    cam = Cam(pos=tuple(c['pos']), yaw=c['yaw'], f=c['f'], cy=c['cy'])
    overlay(scene / f'render-{theme}.png', [(tuple(p), t) for p, t in meta['labels']], cam, scene / f'storyboard-{theme}.png')
    print(scene / f'storyboard-{theme}.png')


if __name__ == '__main__':
    main(*sys.argv[1:3])
