---
name: portfolio
description: Operational runbook for mcgale.dev (chrismcgale.github.io) — how to run, edit, and deploy the portfolio site.
---

# mcgale.dev runbook

## Run

Static site, no build step. Preview locally:

```sh
python -m http.server 8000 --directory /home/archriso/github/chrismcgale.github.io
```

Deploy = push to `main`. GitHub Pages serves the repo root; `CNAME` binds `mcgale.dev` (DNS at Porkbun: CNAME + apex A-records).

## Debug / common errors

- **Custom domain drops after push** — GitHub Pages resets the domain if `CNAME` is deleted. Never remove `CNAME` from the repo root.
- **Unstyled flash / wrong theme on load** — `main.js` must load in `<head>` *without* `defer` so `data-theme` is set before first paint.
- **Broken styles on project pages** — pages under `projects/` use `../styles.css`, `../main.js`, `../assets/`; root pages use bare relative paths; `404.html` uses absolute (`/styles.css`) paths since it renders at arbitrary URLs.

## Architecture (brief)

Plain hand-written HTML/CSS/JS — deliberately no framework or generator.

- `styles.css` — the whole design system. Engineering-notebook aesthetic: warm e-paper palette, near-black ink, single amber accent (`--amber` / `--amber-deep`), mono headers (DejaVu Sans Mono → JetBrains Mono), IBM Plex Sans body. Light theme is primary; dark via `[data-theme="dark"]` CSS vars.
- `main.js` — theme toggle only (localStorage + `prefers-color-scheme`).
- `index.html` — hero, project card grid (feature cards for 01/02), upcoming-coursework TODO cards, footer.
- `projects/*.html` — one page per project; shared header/footer markup is duplicated per page (no templating — edit all pages when changing chrome).
- Motifs are inline SVGs using CSS vars (`var(--amber)` etc.) so they theme correctly.
- Placeholder figures use `figure.fig.fig--todo` with an "ASSET PENDING" stamp — intentional notebook-style TODO, to be replaced in the asset pass.

## Gotchas

- **Project order is deliberate**: 01 Submersivity (flagship — real hardware, IEEE ICMA published), 02 Rinnegan, 03 gate navigation, 04 quadrotor control, 05 kickbox pod, 06 Voron. Chris ranks shipped hardware + publications above in-dev software. Numbering appears in card indices, crumbs, and prev/next nav — keep all three in sync.
- Coursework cards (AER1513, ECE1647, ECE1756, ECE1521, AER1516) are placeholders by mandate — **do not invent results, metrics, or screenshots** for them.
- Physical-asset photos (submarine, pods, Voron, quad) can't be sourced from disk — ask Chris to shoot them.
- Old site (expander.html, random_walk.html, script.js) was deliberately discarded 2026-07-01; don't resurrect.

## Changelog / Decisions

- **2026-07-08** — New project **03: Rook** (custom STM32H743 flight controller), promoted from the "Next up" 08 TODO to a top-tier `card--feature` (Chris's call). This renumbered every project after it: gate-nav 03→04, quadrotor 04→05, kickbox 05→06, voron 06→07, fixed-wing 07→08 (crumb + card-index + prev/next nav + index cards all synced; entries count 07→08). The Next-up "Custom flight controller" card was removed (now realized); the 7-inch quad build stays as next-up 09 and links to the Rook page. Assets generated from `~/kicad_projects/kestrel` via `kicad-cli 10.0.3`: 3D renders (`kicad-cli pcb render`, iso `--rotate '-30,0,25' --perspective`, plus top/bottom, `--quality high --floor`) → `rook-pcb-{iso,top,bottom}.png`; schematic PDF (`sch export pdf`) + a cropped 2400px PNG (pdftoppm `-W 7100 -H 4500` at 200 DPI, PIL downscale); netlist (`sch export netlist`) → `assets/docs/rook.net`. Board name is **Rook only** (dir is still `kestrel/`, older names retired) — never surface a prior name. Verified DRC/parity live (0/0/0) and quoted 89 components / 109 nets from the netlist.
  - **Render recipe (final):** renders are silk-free, **black soldermask + gold ENIG** (the classic black+gold look). Colors were iterated a lot: green→black→yellow→red/blue→**black+gold**. Note: Chris asked for "black board, yellow routes" — **not renderable**: traces sit under the soldermask, so on a black board they render dim gold-bronze no matter the copper color (tested yellow + gold copper, both stay dark under black mask). Bright routes need a light mask (yellow board) instead. Final = black mask, no copper recolor (ENIG gold pads/branding are the brightest attainable). Chris wanted no silkscreen (auto-placed refs were overlapping junk) and a colored board. Tool: `~/kicad_projects/kestrel/scripts/strip_silk.py IN OUT [MASK_COLOR] [fillvias]` — S-expression surgery (pcbnew's Python bindings segfault on mutation in this KiCad build; token-lossless parse/serialize proven, so copper is never touched). It drops all `F/B.SilkS` graphics, hides silk `property` refs, injects `(color ...)` on the stackup mask layers, and flips `(covering (front/back yes))` so vias render covered instead of as open drill holes. `MASK_COLOR` is one color for both sides (`Yellow`) or per-side `Front/Back` (`Red/Blue`). The gold "RK V1" text + corvid mark are **copper (ENIG), not silk**, so they stay. Final render cmd: `kicad-cli pcb render OUT ... -D KIPRJMOD=/home/archriso/kicad_projects/kestrel`.
  - **Two render gotchas (cost real time):** (1) render the stripped copy with `kicad-cli pcb render -D KIPRJMOD=/home/archriso/kicad_projects/kestrel ...` — the easyeda/LCSC parts (MCU, gyro, baro, buck, FET, inductor, µSD) use `${KIPRJMOD}`-relative STEP paths, so rendering a `/tmp` copy silently drops those 3D bodies (the MCU vanishes). KiCad-stdlib parts (`${KICAD10_3DMODEL_DIR}`) are unaffected. (2) DRC on any re-saved/serialized copy throws phantom `clearance`/`copper_edge_clearance` errors from stale zone fill — nondeterministic, irrelevant to rendering; `--refill-zones` on the *original* is the only meaningful baseline.

- **2026-07-02 (d)** — Full media integration from `~/Downloads/WhatsApp Unknown 2026-07-02 at 4.33.48 PM.zip` (24 photos + 3 videos; mapping is alphabetical glob order of the extracted jpegs). Submersivity now has 11 real figures (group/poster hero, basin debris, internals, ESP-DIVE PCB, ArUco-at-dock, through-lens HUD, goggles selfie). Voron: Z-drive, toolhead wiring, finished machine, walkaround video; ASSET PENDING block removed. Gate nav: flight-arena course video restored as FIG 3. Kickbox: SWIM light-painting demo photo. Unused from batch: MATLAB/laptop screen photos (inferior to real plots already on pages), portrait MATLAB screen video. Remaining TODOs: Rinnegan quad bench photo, ICMA DOI, cleaner fixed-wing MATLAB export.

- **2026-07-02 (c)** — New project 07: fixed-wing UAV (AER1216) from wing CAD render + MATLAB flight animation (phone capture in `~/Downloads`, WhatsApp files) + fixed-wing Simulink diagrams from `~/Pictures` (these are the ones NOT to use on the quadrotor page) + assignment PDFs. Next-up cards renumbered to 08/09. Voron got a mid-print photo (FIG 2). Kickbox roadmap got the motorized SWIM rig photo (`IMG_1920.JPG`, lab device, caption kept neutral). Aside: banner-shaped "user images" in chat are the harness echoing wide images back after Read; not user uploads.

- **2026-07-02 (b)** — Style rules from Chris: **no em dashes anywhere** in site copy (use colons/commas/parens/·) and **light theme is the default** (main.js ignores prefers-color-scheme; dark only via toggle). Content: gate-nav flight video removed by request; project 04 expanded with Lab 3 target detection/localization (figs from `~/aer1217-project/lab3_vision/debug/`, report in assets/docs); kickbox page shows bottom-side PCB render (sensors + power chain live on the bottom).

- **2026-07-02** — Asset pass 1: real figures integrated from disk into `assets/img|video|docs`. Sources: `~/rinnegan` (results/, design_brief/), `~/aer1217-project/aer-course-project/`, `~/kickbox_coach/hardware/strikepod/` (KiCad renders via `kicad-cli pcb render`), ICMA paper figures extracted from `~/Downloads/Garbage_Detection_Submarine.pdf` (pdfimages/pdftoppm). Content corrections: Rinnegan page rewritten to match the real project (GPS-denied cooperative perception, relay-utility metric, measured numbers from its README); Submersivity wording aligned to the published paper (ESP-DIVE-based platform, XIAO ESP32-S3 Sense, topside YOLOv8s inference — not "custom PCB / onboard"); kickbox status downgraded to "PCB designed, awaiting fab, no field data" per Chris. The `~/Pictures` Simulink diagrams are FIXED-WING (delta_e) — do not use them on the quadrotor page. `~/Downloads/IMG_1545.jpg` is Chris's driver's licence — never touch it. Quadrotor page (04) assets live in `~/aer1217-project` **branch `lab2`** (PD sweep figs + Lab 2 report with LQR/MPC) and `~/Documents/AERLab4/` (stereo VO on KITTI, RANSAC — vo_*.png + report). Pending user-shot assets land in `~/Pictures/portfolio-drop/` (see final figure slots in each page's fig--todo blocks).

- **2026-07-01** — Full from-scratch rebuild: plain HTML/CSS/JS, engineering-notebook visual system, 6 project pages + 5 coursework stubs, `CNAME` for mcgale.dev added. Submersivity promoted to flagship over Rinnegan (user decision: physical + published > theory/software). Assets deferred to a second pass; all figures are labeled placeholders.
