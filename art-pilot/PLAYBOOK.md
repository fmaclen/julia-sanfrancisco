# Witness scenes

Each place (market, museum, ...) gets one pixel-art painting per **theme**, with its witness painted in. A theme is
a region of the world: one storyboard, re-dressed for the region (witness, goods, materials, vehicles), shared by
that region's cities (`kit/themes.json`). Mediterranean, East Asia and Africa come first; cities in a theme not
made yet use the closest one that is.

The painting fills the window's height at natural size, centred on the witness. `kit/frame.py` holds the size, the
camera and the **safe box**; `scenes/market/` is the worked example of every file a scene needs.

Winston QAs every picture. Each generation or edit is one image, and runs only within a count he has agreed.
Publish pictures to his report (html-plan skill): pictures with short labels, no prose.

## Making a scene

1. **Storyboard.** Copy `scenes/market/` to `scenes/<place>/` and rewrite `layout.py` with parts from
   `kit/blender_kit.py`, following the storyboard rules below. Render with `python3 art-pilot/kit/storyboard.py <place>`.
   Done when every storyboard rule holds in `storyboard.png`.
2. **Approval.** Publish the storyboard. Done when Winston approves it.
3. **Generate**, once per theme. Write `prompt-generate.txt` (shared) and `theme-<theme>.txt` (the region's
   witness and dressing) from the market's, following the prompt rules below, then run
   `python3 art-pilot/kit/imagegen.py <place> generate <theme>` (writes `painting-<theme>-new.png`, snapped onto
   the 2 x 2 pixel grid by `kit/snap.py`). A timeout returns
   nothing and costs nothing; run it again.
4. **Check**, per theme. `python3 art-pilot/kit/checks.py <place> <theme>` must PASS. Under `paintings.<theme>` in
   `scene.json`, set `seat` to the witness's x in the painting; promote `painting-<theme>-new.png` to
   `painting-<theme>.png`, then `node art-pilot/kit/shoot.mjs <place> <theme>`. Done when every painting rule holds
   on all three shots, or each failure is written down.
5. **Fix.** Local problems get an **edit** of the painting (below); a wrong layout gets a new storyboard and step 3
   again. Back to step 4.
6. **Final generation.** Every edit softens the whole picture: four edits left the market with half the pixel detail
   of its fresh generation. So once the edits have settled every detail, carry each one back into `layout.py` and
   `prompt-generate.txt`, and generate the shipping painting fresh (step 3, then step 4). Done when the fresh
   painting passes step 4 with no edits on it.
7. **Publish** the shots and the painting.

## Storyboard rules

- Camera: `Cam()` as it stands, level and turned 35 degrees, so tables, shelves and counters run diagonally away.
- Witness: `mannequin()` at `CAM.ahead(5.0)`, head to hands inside the safe box, hands low (around y 600) so the
  phone subtitles sit just under them. Its pose and gaze come from the theme's **acting beat** in `scene.json`
  (`pose`: lean, arms-crossed; `look`: aside, camera); `storyboard.py <place> <theme>` renders one per theme.
- The place is generic: backed by a wall, with no sky, street view or landmark in frame, present day.
- Nothing written anywhere, so a painting can later be shown mirrored.
- The subtitle band (below y 587) stays low and plain: pavement, the foot of the table. Big things close to the
  camera there tempt the model into depth-of-field blur.
- Every roof or canopy stands on all its legs, one at each corner, planted on the ground. What it shelters (a table,
  a counter) fits fully inside its footprint, so every leg stands clear of it, never in front of its middle.
  Neighbouring stalls stand side by side on their own legs. Front legs stand clear of the safe box and of every
  **phone strip** edge (`checks.py` prints the strips).
- Nothing straddles a phone strip edge: each prop is fully inside a strip or fully outside it.
- Dressing varies in size, colour and spacing, with gaps, in uneven, asymmetric clusters. A small prop the story
  needs (a card reader, a ticket) gets its own bare patch (`clear()`).
- Seed `rnd` once in `start()`. Things added later draw from their own `random.Random`, so the rest stays put.

## Prompt rules

`scenes/market/prompt-generate.txt` is the worked example; reuse its wording.

- References: `kit/style-reference-daylight.png` (the Paris pilot: how daylight exteriors are shaded), then the
  storyboard, and nothing else. The storyboard is the only layout guide, so an earlier painting never goes in: the
  model copies its layout. A picture of a person copies too: a close-up of the Tokyo merchant brought his wall, his
  framing and his size into every theme, and the same man cut out on a plain card shrank every witness. The witness's
  look is set in words instead (the people paragraph of the market prompt).
- One light and one shading recipe, word for word from the market prompt: warm early-afternoon sun from the upper
  left, a few flat shade steps per surface, no grain, noise, dithering or grime. Theme files describe materials and
  colours only; words like weathered, faded, dusty or battered turn into texture noise and each theme drifts apart.
- Name the camera turn ("tables run diagonally away to the right").
- Everything equally sharp, near and far; the foreground sits back by being darker, since pixel art has no depth of field.
- The mannequin marks the witness's place, size and pose; the witness is drawn as a real person instead of it.
- The witness is a new, ordinary person from the theme's region: age, build, plain everyday clothes, plain looks.
  No smile, eyes clearly drawn. Name the region, never a city. Mix women and men across themes and places.
- Each theme file ends with the witness's acting beat, matching its pose in the storyboard, and the beats vary
  across themes and places: wary glance aside, cagey stare at the viewer, tired, irritated, nervous, distracted by
  a task. Some look at the viewer, some away. A prop gives the hands a job: a glass of tea, a phone, a cigarette.
- Present day, generic within the region, no readable text.
- Dressing in uneven clusters; one of each small prop.
- Structures spelled out: how many legs, where each stands relative to the table, "no other poles". The model adds
  and misplaces supports unless the count and footing are stated.
- Each theme file pins the materials and colours (canopy colour and pattern, table covering, containers, vehicle),
  so a reroll stays the same place, and names the theme's version of any story prop (payment: a card reader, a
  phone for mobile money, a printed code stand).

## Edits

- Reference `painting-{theme}.png` alone. Open with "Keep everything else exactly as it is", then list only the changes,
  placing things relative to the witness ("one head-width left of his head").
- Geometry (a table's perspective, a wall's slope): draw the correct edges as coloured lines on a copy of the
  painting and pass it as a second image, naming each line and asking for the lines themselves to stay undrawn.
- Edits are for trying out details, never for the shipping painting (step 6). `checks.py` fails a painting that has
  gone soft.
- `kit/imagegen.py` sends every request with references as an edit; all scenes so far were made that way.

## Open decisions

- Each place has three witness roles (the market: hawker, street merchant, urchin), but one painted witness.
- Whether the three remaining themes (Latin America, Northern Europe, South Asia) are made, or their cities keep
  borrowing the closest theme.

Character swaps and parallax come later, on top of this.
