"""Generate or edit a scene painting with the fleet's image model (CLIProxy Responses endpoint).

    python3 art-pilot/kit/imagegen.py market generate east-asia
    python3 art-pilot/kit/imagegen.py market edit-hanging east-asia

Reads scenes/<scene>/prompt-<job>.txt. Its first lines name the reference images, one per line as
`ref: <path relative to the scene>`, in the order the prompt describes them; the rest is the prompt. `{theme}` in a
ref line becomes the theme's name; `{theme}` in the prompt becomes the text of theme-<theme>.txt. The result goes to
painting-<theme>-new.png, snapped to the pixel grid (snap.py), so the current painting is only replaced once the
result has passed the checks.

Every request with reference images is sent as an edit (action "edit"). That is how all the scenes so far were made,
including fresh ones from a storyboard, so keep it unless a test shows "generate" does better.
The client key comes from the fleet repo's helper and never leaves this process.
"""
import base64
import sys
from pathlib import Path

import httpx
from PIL import Image

from snap import snap

sys.path.insert(0, str(Path.home() / 'projects/fleet/scripts'))
from cliproxy_image_mcp import MODEL, RESPONSES_URL, client_key  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]


def generate(prompt, refs, out, size='1536x1024', background='auto', action='edit'):
    """One image from `prompt` and reference image paths `refs`, written to `out`. background: 'auto' | 'transparent'."""
    content = [{'type': 'input_text', 'text': prompt}]
    for r in refs:
        content.append({'type': 'input_image', 'image_url': 'data:image/png;base64,' + base64.b64encode(Path(r).read_bytes()).decode()})
    tool = {'type': 'image_generation', 'size': size, 'background': background, 'output_format': 'png'}
    if refs:
        tool['action'] = action
    payload = {'model': MODEL, 'input': [{'role': 'user', 'content': content}], 'tools': [tool],
               'tool_choice': {'type': 'image_generation'}, 'stream': False}
    key = client_key()
    # the model can take several minutes; a timeout returns nothing and costs nothing, so just run it again
    with httpx.Client(timeout=600, trust_env=False) as c:
        r = c.post(RESPONSES_URL, headers={'Authorization': f'Bearer {key}'}, json=payload)
    if r.is_error:
        raise RuntimeError(f'HTTP {r.status_code}: ' + r.text[:300].replace(key, '[redacted]'))
    enc = next(i['result'] for i in r.json()['output'] if i.get('type') == 'image_generation_call' and i.get('result'))
    Path(out).write_bytes(base64.b64decode(enc))
    return out


def main(name, job, theme):
    scene = ROOT / 'scenes' / name
    lines = (scene / f'prompt-{job}.txt').read_text().splitlines()
    refs = [(scene / ln[4:].strip().replace('{theme}', theme)).resolve() for ln in lines if ln.startswith('ref:')]
    prompt = '\n'.join(ln for ln in lines if not ln.startswith('ref:')).strip()
    prompt = prompt.replace('{theme}', (scene / f'theme-{theme}.txt').read_text().strip())
    out = generate(prompt, refs, scene / f'painting-{theme}-new.png')
    snap(Image.open(out)).save(out)
    print(out)


if __name__ == '__main__':
    main(*sys.argv[1:4])
