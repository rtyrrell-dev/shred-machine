# Shred Machine — Technical Reference

This document covers internal architecture, data flow, algorithms, and implementation decisions. For setup and usage, see [README.md](README.md).

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Component Hierarchy](#2-component-hierarchy)
3. [Core Data Structures](#3-core-data-structures)
4. [Music Theory Primitives](#4-music-theory-primitives)
5. [Tab Building Algorithm](#5-tab-building-algorithm)
6. [Generation Pipeline](#6-generation-pipeline)
7. [Guitarist Generators](#7-guitarist-generators)
8. [Audio Pipeline](#8-audio-pipeline)
9. [Guitarist Profile Schema](#9-guitarist-profile-schema)
10. [State Management](#10-state-management)
11. [Styling System](#11-styling-system)
12. [MCP Server](#12-mcp-server)

---

## 1. Architecture Overview

```
src/
├── App.jsx                ← monolith: all generators, all UI, all audio
└── guitarists/
    ├── evh.js             ← data + style prompt (shared by web app and MCP server)
    ├── demartini.js
    ├── george-lynch.js
    ├── puget.js
    └── ian-dsa.js

mcp/
├── index.js               ← MCP server: three knowledge tools, stdio transport
└── package.json           ← separate package; own node_modules
```

The entire frontend lives in `App.jsx`. There is no router, no global state library, no CSS framework, and no audio library. The file has three logical sections:

1. **Global scope** — utility functions, scale constants, generator functions, `GEN_MAP` lookup object
2. **React components** — `Panel`, `GuitaristBar`, and the root `App`
3. **`STYLES` constant** — ~650 characters of minified CSS injected via `<style>` at runtime

The generators are plain functions in module scope, not hooks or class methods. This means they can be called, tested, and reasoned about independently of React.

---

## 2. Component Hierarchy

```
App
├── GuitaristBar        ← multi-select up to 3 guitarists; "rnd" resets to Random
└── Panel (×2)          ← one instance for "lead", one for "rhythm"
    ├── Generate button  ← triggers generation
    ├── Meta bar         ← BPM badge, label badge (guitarist color), beat dots
    ├── Progress bar     ← filled via 50ms setInterval during playback
    ├── Tab box          ← monospace pre-formatted ASCII tab display
    └── Controls         ← Play/Stop, Click track toggle, PDF export
```

`Panel` is instantiated twice with `type="lead"` and `type="rhythm"`. All playback and generation state is local to each `Panel` instance — the two panels are completely independent and can play simultaneously.

---

## 3. Core Data Structures

### Note Event

The atomic unit throughout the system. All generators produce arrays of these.

```js
{
  col: number,   // 16th-note column position, 0–63
  str: number,   // string index 0=low E, 5=high e
  fret: number,  // fret number 0–22
  d?: string     // decoration: 'h' | 'p' | '~' | '/' | ''
}
```

### Audio Event

Produced by `toAudio()` from a note event array. Contains absolute playback times.

```js
{
  t: number,     // seconds from playback start
  hz: number     // frequency in Hz
}
```

### Exercise Result

Returned by `generateExercise()` and used to populate a `Panel`.

```js
{
  tab: string,          // formatted 6-line ASCII tablature string
  bpm: number,          // tempo for this exercise
  label: string,        // human-readable label, e.g. "EVH Tap (5-8-12)"
  audioEvents: Array,   // pre-computed audio events
  guitId: string        // 'evh' | 'dem' | 'lnch' | 'jade' | 'ian'
}
```

### Generator Result

The internal return type of each `*_lead()` / `*_rhythm()` function.

```js
{
  events: NoteEvent[],  // raw note events before tab building
  label: string         // human-readable label for this specific exercise
}
// or null — on failure, generator returns null and generateExercise retries
```

---

## 4. Music Theory Primitives

### Tuning Arrays

Open-string pitches expressed as MIDI note numbers (middle C = 60):

```js
const STD   = [40, 45, 50, 55, 59, 64]; // E2 A2 D3 G3 B3 e4
const DROPD = [38, 45, 50, 55, 59, 64]; // D2 A2 D3 G3 B3 e4
```

Index 0 is the low E string, index 5 is the high e. All generators receive an `open` array from the guitarist's profile, so the generation logic is tuning-agnostic.

### Scale Constants

Defined as semitone intervals from the root:

```js
const PENTA = [0, 3, 5, 7, 10];          // minor pentatonic
const BLUES = [0, 3, 5, 6, 7, 10];       // blues (adds b5 tritone)
const HARM  = [0, 2, 3, 5, 7, 8, 11];    // harmonic minor
const AEOL  = [0, 2, 3, 5, 7, 8, 10];    // natural minor / Aeolian
const PHRYG = [0, 1, 3, 5, 7, 8, 10];    // Phrygian (b2 is the key tone)
```

Each guitarist profile also defines its own extended scale palette — e.g., EVH's symmetrical octatonic `[0,1,3,4,6,7,9,10]` and DeMartini's harmony interval arrays.

### Fret Conversion

```js
const gf = (midi, string, open) => {
  const f = midi - open[string];
  return (f >= 0 && f <= 22) ? f : null;
};
```

`gf` (get fret) converts a MIDI pitch to a fret number on a given string. Returns `null` if the note is not playable on that string within the standard 22-fret range. This is the core of the tuning abstraction — generators work in MIDI intervals and call `gf` to resolve to actual fret positions.

### Position Window

```js
function posNotes(scale, root, pos, open, strs = [0,1,2,3,4,5]) {
  // returns all in-scale notes within frets [pos, pos+4] on the given strings
}
```

A "position" is a 4-fret window on the neck. `posNotes` collects every pitch in the scale (across octaves) that falls within that window on the specified strings. The result is sorted by fret, then string, giving a physically playable set of notes that fits comfortably under one hand position.

This eliminates the need for generators to reason about the full neck. Requesting `posNotes(PHRYG, root, 5, open, [2,3,4,5])` yields only notes available in the 5th-position Phrygian box on strings D–G–B–e.

### MIDI-to-Hz

```js
const midiHz = m => 440 * Math.pow(2, (m - 69) / 12);
```

Standard equal-temperament conversion. A4 = MIDI 69 = 440 Hz.

### Root Randomization

```js
const root = pick([40, 42, 43, 45, 47, 38, 41]);
// E2, F#2, G2, A2, B2, D2, Eb2
```

Exercises are generated in random keys from a pool of guitar-friendly roots. The root is an absolute MIDI value; generators add scale intervals to it and call `gf` to find playable frets.

---

## 5. Tab Building Algorithm

`buildTab(events, open)` converts a note event array into a 6-line ASCII tablature string.

### Grid Construction

```
64 columns × 6 strings → 6 rows × 4 measures × 16 columns each
```

Two 2D arrays are initialized: `rows[str][col]` (default `'-'`) and `deco[str][col]` (default `''`).

For each event:
1. Convert `fret` to string `fs` (e.g., fret 12 → `"12"`)
2. Place `fs[0]` at `rows[str][col]`
3. If fret is two digits and `col+1 < 64`, place `fs[1]` at `rows[str][col+1]`
4. If decoration `d` exists and there is space after the fret digits, place it in `deco[str][col + fs.length]`

### Output Formatting

Each string is formatted as:
```
e|<16 cols>|<16 cols>|<16 cols>|<16 cols>|
```

String names depend on tuning: E standard uses `['e','B','G','D','A','E']`, Drop D uses `['e','B','G','D','A','D']`. The array is reversed on output because `rows[0]` is the low E string but it appears at the bottom of the tab.

The final output is 6 lines joined with `\n`, ready to be displayed in a monospace `<pre>` element.

### Multi-Digit Fret Handling

Because fret 12 occupies columns `col` and `col+1`, notes cannot be placed at `col+1` by another event — they would overwrite the second digit. The generator functions are not aware of this; `buildTab` handles it by writing `fs[1]` into the adjacent cell. Collision avoidance is left to the generator (which generally spaces notes at least 2 columns apart).

---

## 6. Generation Pipeline

```
generateExercise(sel, isLead)
  → resolveIds(sel)           ← resolve 'rnd' to a concrete guitarist id
  → pick(ids)                 ← choose one guitarist if multiple selected
  → prof.lead/rhythm(root, open, dd?)
  → validate(result)          ← retry up to 12 times on null or < 6 events
  → buildTab(events, open)    ← format ASCII tab
  → toAudio(events, bpm, open)← compute audio events
  → return ExerciseResult
```

### Retry Logic

Each generator can return `null` if the random parameters yield a degenerate result (e.g., `posNotes` returns fewer than the minimum required notes). `generateExercise` retries up to 12 times with a new random root and generator type each attempt. After 12 failures, it returns a hardcoded 4-note pentatonic fallback at 120 BPM.

Validation after generation:
- `result` is not null
- `result.events.length >= 6`
- At least 6 events pass bounds checking (`fret` in `[0,22]`, `col` in `[0,63]`)

### Multi-Guitarist Selection

When multiple guitarists are selected, `resolveIds` returns all non-`rnd` IDs. `generateExercise` then calls `pick(ids)` to choose one per attempt. If the chosen guitarist's generator fails, the next attempt may pick a different guitarist. The label gets the guitarist's last name appended in brackets when more than one is active, e.g., `"EVH Scale (pos 7) [Van Halen]"`.

---

## 7. Guitarist Generators

Each guitarist has two generator functions: `*_lead(root, open)` and `*_rhythm(root, open, dd)`.

The `dd` parameter is `true` for Drop D (Ian D'Sa) — it affects power chord voicing in `pwrE`.

### Power Chord Helpers

```js
function pwrE(rf, open, dd) {
  // Drop D: low D string (str 0) can play root + power 5th + octave on same fret
  if (dd && rf <= 14) return [[0,rf],[1,rf],[2,rf]];
  // E standard: str 0 = root, str 1/2 = 5th (+2 frets)
  return [[0,rf],[1,clamp(rf+2,0,22)],[2,clamp(rf+2,0,22)]];
}

function pwrA(rf, open) {
  // A-string root: str 1 = root, str 2/3 = 5th
  return [[1,rf],[2,clamp(rf+2,0,22)],[3,clamp(rf+2,0,22)]];
}
```

`addPwr(ev, col, chord)` pushes all notes of a chord into the event array at a given column.

### EVH (`evh_lead`, `evh_rhythm`)

**Lead types:** `'tap'` | `'scale'` | `'triads_lead'`

- **tap**: Iterates columns in groups of `tapGroupSize` (defaults to triplet = 6 columns). Each group places tap → pull → hammer from `EVH.tapPatterns`. 40% chance of adding a vibrato note on the A/e string between groups.
- **scale**: Runs EVH's symmetrical octatonic scale `[0,1,3,4,6,7,9,10]` across 3 strings in a position window. Can run ascending-then-descending (coin flip). Hammer-on decoration applied between same-string consecutive notes.
- **triads_lead**: Cycles through 3-note triad intervals `[0,4,7]` (major), `[0,3,7]` (minor), `[0,4,8]` (augmented) in a position window. Direction (ascending/descending) randomized per rep. Vibrato applied at rep boundaries.

**Rhythm types:** `'mixo'` | `'pedal_triad'` | `'chug'`

- **mixo**: Mixolydian I–bVII–bVI–IV progressions using A-string power chords.
- **pedal_triad**: Alternates open low-E string pedal tone with triad shapes on strings D–G–B.
- **chug**: Constant 8th-note chugging on low-E power chord with accent chords on beats 3 and "and-of-4".

### DeMartini (`dem_lead`, `dem_rhythm`)

**Lead types:** `'burst'` | `'harmony'` | `'box_shift'` | `'blues_phrase'`

- **burst**: Slow blues-phrased notes (columns at irregular spacing) for the first 32 columns, then tight 16th-note pentatonic run for the remaining 32. Models his "slow → fast" phrasing contrast.
- **harmony**: Two voices play in parallel. The melody line is Aeolian; harmony intervals cycle through diatonic 3rds or 6ths from `DEM.harmonyIntervals` — a lookup of semitone offsets indexed to scale degrees. Both voices are written into the event array at the same column.
- **box_shift**: Begins in one pentatonic position, slides to a position 3 semitones higher at column 32. Models his mid-solo position shifts.
- **blues_phrase**: Fixed melodic contour expressed as scale degree sequences (hardcoded interval arrays). Vibrato and pull-offs applied at specific phrase positions.

**Rhythm types:** `'round_round'` | `'lay_down'` | `'back_more'` | `'slip_lip'`

Named after Ratt songs. Power chord progressions with open low-E pedaling.

### George Lynch (`lnch_lead`, `lnch_rhythm`)

**Lead types:** `'phrygian'` | `'harm_sweep'` | `'open_penta'` | `'mr_scary_tap'`

- **phrygian**: Opens with a hammer-on + vibrato unit on the b2 (flat second) — the defining Phrygian interval. Followed by a legato run from `posNotes(PHRYG, ...)`. The unit repeats, filling 64 columns.
- **harm_sweep**: Collects 2–3 harmonic minor notes per string across all 6 strings, then sweeps the resulting phrase ascending then descending. Produces his arpeggio-sweep texture.
- **open_penta**: Alternates pentatonic notes with open-string notes (str 0, 1, or 2 at fret 0) every other note. Creates an open/fretted interweaving texture.
- **mr_scary_tap**: Three-note tap pattern from `LNCH.tapPatterns` with an optional chromatic half-step slide (`'/'`) after the hammer-on — Lynch's "outside" chromatic color.

**Rhythm types:** `'tooth_nail'` | `'into_fire'` | `'breaking_chains'` | `'speed_riff'`

Lynch rhythm patterns feature chromatic passing tones (e.g., fret `rootF+1` on a non-beat column) that create the half-step approach feel of his riffs.

### Jade Puget (`jade_lead`, `jade_rhythm`)

**Lead types:** `'days_phoenix'` | `'goth_tap'` | `'leaving_song'` | `'girl_grey'`

- **days_phoenix**: Alternates open B string and high-e melody notes using Aeolian scale. Irregular rhythmic placement (pre-computed column arrays with dotted-8th or triplet groupings). Models his open-string interplay.
- **goth_tap**: Slow Aeolian melody for 32 columns, then a tapping section from `JADE.tapPatterns`. Transition models his verse-to-chorus dynamic shift.
- **leaving_song**: Pure Phrygian position run, ascending then descending, with occasional hammer-ons. Atmospheric and modal.
- **girl_grey**: Aeolian melody on B/e strings with irregular rhythmic spacing and vibrato on every 5th note.

**Rhythm types:** `'days_verse'` | `'girls_grey'` | `'bleed_black'` | `'art_drowning'`

Use A-string power chords. "Bleed Black" pattern alternates full chord hits with single A-string notes between them.

### Ian D'Sa (`ian_lead`, `ian_rhythm`)

**Lead types:** `'d_string_melody'` | `'fallen_leaves_lead'` | `'river_below'`

- **d_string_melody**: All notes on the D string (str 2). Interval sequences from `IAN.dStringMelodies.ascDesc`. Hammer-on decoration when interval moves up, pull-off when it moves down.
- **river_below**: D-string melody with an open low-D note (Drop D fret 0, str 0) inserted every 4th position. The double-D reinforcement is the signature Billy Talent texture.

**Rhythm types:** `'midnight_mass'` | `'try_honesty'` | `'red_flag'` | `'viking_march'`

All use Drop D power chords (`pwrE(..., dd=true)`), meaning frets 0–14 on str 0 produce a three-string power chord with root, 5th, and octave at the same fret — the Drop D advantage.

---

## 8. Audio Pipeline

### `toAudio(events, bpm, open)`

Converts note events to timed audio events:

```js
const s16 = 60 / bpm / 4;  // duration of one 16th note in seconds
```

Each event's column maps to a start time: `t = col * s16`. Simultaneous notes on the same string are deduplicated (a Set keyed `"col-str"`) — the first occurrence wins. Frequencies below 20 Hz or non-finite values are filtered.

### `startPlay({audioEvents, bpm, clickOn, onBeat, onDone, ctxRef, nodesRef})`

Creates one `AudioContext` per playback session. All oscillators and gain nodes are created and scheduled upfront — there is no real-time synthesis loop.

**Note synthesis:**
```js
// gain envelope: attack at 0.17, exponential decay to silence over 0.22s
g.gain.setValueAtTime(0.17, now + t);
g.gain.exponentialRampToValueAtTime(0.001, now + t + 0.22);

// sawtooth oscillator stopped at 0.25s
o.type = 'sawtooth';
o.start(now + t);
o.stop(now + t + 0.25);
```

Sawtooth was chosen for its bright, harmonically rich timbre, which sits in a similar register to a distorted guitar. The 0.17 peak gain and short 0.22s decay prevents muddiness when many notes overlap.

**Click track synthesis:**
```js
// beat 1: 30ms buffer, louder
// beats 2–4: 30ms buffer, quieter
const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.03), ctx.sampleRate);
const d = buf.getChannelData(0);
for (let j = 0; j < d.length; j++) {
  d[j] = (Math.random() * 2 - 1)              // white noise
        * Math.exp(-j / (ctx.sampleRate * decay)) // exponential decay envelope
        * amplitude;
}
```

The click is white noise shaped with an exponential decay envelope — a standard snare-transient approximation using only `BufferSource`. No audio files are loaded; the click track is generated entirely in memory.

**Beat callback:**
A `setTimeout` is scheduled per beat (16 total, one per quarter note) using `(t - ctx.currentTime) * 1000` as the delay. Each callback fires `onBeat(i % 4)` which updates the four LED beat dots in the UI.

**Cleanup:**

`stopAll()` calls `.stop()` and `.disconnect()` on every node in `nodesRef.current`, then closes the `AudioContext`. Errors from already-stopped nodes are silently caught. The progress interval and all pending beat `setTimeout`s are also cleared.

### `AudioContext` Reuse

A new `AudioContext` is created each time playback starts. This avoids the browser's suspension policy (contexts created before a user gesture may be suspended), since playback is always triggered by a button click. The `0.1s` start offset (`now + 0.1`) gives the browser time to schedule audio without glitches.

---

## 9. Guitarist Profile Schema

Each file in `src/guitarists/` exports a profile object with this structure:

```js
{
  id: string,             // 'evh' | 'dem' | 'lnch' | 'jade' | 'ian'
  name: string,           // "Eddie Van Halen"
  band: string,           // "Van Halen"
  era: string,            // "1978–1984"
  color: string,          // hex, used for UI accents
  open: number[],         // MIDI values for 6 open strings, index 0 = low E
  tuningName: string,     // human-readable
  strings: string[],      // display names high→low: ['e','B','G','D','A','E']
  bpmLead: [number, number],
  bpmRhythm: [number, number],
  scales: { [name]: number[] },        // scale interval arrays
  tapPatterns: [number,number,number][],  // [tap, pull, hammer] absolute frets
  tapStrings: number[],   // weighted list of preferred strings for tapping
  tapGroupSizes: number[], // columns per tap unit (e.g. 6 = triplet, 4 = 16th)
  leadPositions: number[], // 4-fret position starting frets
  rhythmProgressions: object,
  rhythmPatterns: number[][],  // column offsets within a 16-col measure
  songs: object,           // song reference data (not used by generators directly)
}
```

### `GEN_MAP`

```js
const GEN_MAP = {
  evh:  { lead: evh_lead,  rhythm: evh_rhythm,  open: EVH.open,  dd: false, bpmL: EVH.bpmLead,  bpmR: EVH.bpmRhythm },
  dem:  { lead: dem_lead,  rhythm: dem_rhythm,  open: DEM.open,  dd: false, ... },
  lnch: { lead: lnch_lead, rhythm: lnch_rhythm, open: LNCH.open, dd: false, ... },
  jade: { lead: jade_lead, rhythm: jade_rhythm, open: JADE.open, dd: false, ... },
  ian:  { lead: ian_lead,  rhythm: ian_rhythm,  open: IAN.open,  dd: true,  ... },
};
```

Keyed by guitarist ID. `generateExercise` looks up the guitarist's generator functions, open-string tuning, Drop D flag, and BPM ranges from this map.

---

## 10. State Management

All state is `useState` inside the two `Panel` instances and the root `App`. There is no global state. The two panels are fully isolated.

### `App` State

```js
const [sel, setSel] = useState(['rnd']);  // selected guitarist IDs
```

`sel` is an array of guitarist IDs. The only special value is `'rnd'` (Random). When the user selects a real guitarist, `'rnd'` is removed. When the last real guitarist is deselected, the selection resets to `['rnd']`. Up to 3 real guitarists can be selected simultaneously.

### `Panel` State

```js
const [tab, setTab] = useState('');
const [bpm, setBpm] = useState(null);
const [label, setLabel] = useState('');
const [playing, setPlaying] = useState(false);
const [clickOn, setClickOn] = useState(true);
const [progress, setProgress] = useState(0);
const [beat, setBeat] = useState(-1);
const [guitId, setGuitId] = useState('');
const [hasAudio, setHasAudio] = useState(false);
```

### Refs

```js
const audioRef = useRef(null);    // current audio event array (not state; doesn't need renders)
const ctxRef = useRef(null);      // AudioContext reference for cleanup
const nodesRef = useRef([]);      // all scheduled audio nodes + timeout handles
const progRef = useRef(null);     // setInterval ID for progress bar
const startRef = useRef(null);    // playback start timestamp (Date.now())
const durRef = useRef(null);      // playback duration in seconds
```

`audioRef` holds the current audio events but is not state because updating it doesn't need to trigger a re-render — it's only read at playback start.

---

## 11. Styling System

All CSS is a single string constant `STYLES` at the top of `App.jsx`, injected via `<style>{STYLES}</style>` in the root render. It is not minified by any build tool — it is pre-minified by hand (or written minified). Vite does not process it further.

### Design Language

- Background: `#000000`
- Lead accent: `#ff2d78` (hot pink/magenta)
- Rhythm accent: `#00f5ff` (cyan)
- Text: `#eeeeee` / `#888888` for secondary
- Fonts: Orbitron (display, loaded from Google Fonts) + Share Tech Mono (monospace body)
- Animations: `flicker` (logo opacity flicker), `pulse-pink` / `pulse-cyan` (glow text-shadow oscillation), `spin`
- Visual effect: `.scanlines` — fixed full-viewport overlay using `repeating-linear-gradient` with alternating transparent/2px dark bands

### CSS Custom Properties

Guitarist button colors use `--gc` (guitarist color), set inline:

```jsx
style={{ '--gc': g.color }}
// .g-btn.sel { border-color: var(--gc); color: var(--gc); background: color-mix(in srgb, var(--gc) 15%, transparent); }
```

`color-mix()` is used for the selected guitarist button background. This requires a browser supporting CSS Color Level 5 (all modern browsers as of 2024).

### Responsive Layout

The two panels are in a CSS Grid with `grid-template-columns: 1fr 1fr`. A `@media(max-width:680px)` breakpoint switches to `1fr`, stacking the panels vertically.

---

## 12. MCP Server

The MCP server lives in `mcp/` as a self-contained Node.js package. It has its own `package.json` and `node_modules` — it is not bundled with the Vite frontend. Its only dependencies are `@modelcontextprotocol/sdk` and `zod`.

### Purpose and Design

The server exposes guitarist knowledge as MCP tools. It makes no external network calls. Any MCP-compatible client can connect to it; the LLM attached to that client does the actual tab generation based on what the tools return.

The guitarist profiles in `src/guitarists/` are pure ESM data modules with no browser dependencies, so the server imports them directly via relative paths (`../src/guitarists/evh.js` etc.). This means there is a single source of truth: the same profile objects that drive the web app's procedural generators also power the MCP tools.

### Module-Level Data

The server defines three lookup objects that supplement the imported profile data:

**`STYLE_SUMMARIES`** — One-sentence style description per guitarist. Used by `list_guitarists`. Kept terse so it fits comfortably in a tool response without overwhelming context.

**`TECHNIQUES`** — Curated, ordered lists of lead and rhythm techniques per guitarist. These are not directly in the profile schema — they are synthesized from knowledge embedded in the `aiPrompt` strings and the generator logic. The `generate_tab` tool includes the relevant list (lead or rhythm) in its response, giving the LLM a prioritized checklist of style-accurate techniques to apply.

**`TAB_FORMAT_SPEC`** — A multi-line string that fully specifies the ASCII tab format: grid dimensions, column semantics, fret encoding, decoration characters, string name variants for each tuning, two worked examples, and the required JSON output shape. Embedded directly in the server so it travels with every `generate_tab` call and the LLM never has to infer the format.

### Tools

#### `list_guitarists`

No input parameters. Returns a JSON array of five objects:

```json
[
  {
    "id": "evh",
    "name": "Eddie Van Halen",
    "band": "Van Halen",
    "era": "1978–1984",
    "tuning": "E standard (recorded Eb half-step down; tabbed at E)",
    "style_summary": "..."
  },
  ...
]
```

Fields are drawn directly from the imported profile (`p.id`, `p.name`, `p.band`, `p.era`, `p.tuningName`) plus the server-local `STYLE_SUMMARIES` lookup.

#### `get_guitarist_profile`

Input: `guitarist_id` (enum: `evh` | `dem` | `lnch` | `jade` | `ian`).

Returns a single JSON object:

```json
{
  "identity":          { "id", "name", "band", "era" },
  "tuning":            { "name", "open_strings_midi", "string_names_high_low" },
  "bpm_ranges":        { "lead": { "min", "max" }, "rhythm": { "min", "max" } },
  "scale_vocabulary":  { "scaleName": [semitone intervals], ... },
  "lead_positions":    [preferred 4-fret window starting frets],
  "techniques":        { "lead": [...], "rhythm": [...] },
  "song_references":   { "songKey": { "album", "key", "bpm", "tuning", "techniques", "notes" }, ... },
  "feel_and_philosophy": "..."
}
```

`open_strings_midi` is the 6-element MIDI array from the profile (index 0 = low string). This gives a client enough information to independently resolve fret positions from MIDI pitches. Up to six song references are included, drawn directly from the profile's `songs` object.

#### `generate_tab`

Input: `guitarist_id` (enum), `type` (`lead` | `rhythm`).

Returns a single text block structured as:

```
<guitarist aiPrompt verbatim>

━━ GENERATION TASK ━━
Generate a LEAD / SOLO [or RHYTHM / RIFF] exercise in the style above.

BPM range for lead: 110–192
Tuning: E standard
String names (high→low): e B G D A E

KEY TECHNIQUES TO APPLY (LEAD):
  1. Two-handed tapping: tap–pull–hammer triplet units...
  2. EVH octatonic scale [0,1,3,4,6,7,9,10]...
  ...

━━ ASCII TAB FORMAT SPECIFICATION ━━
GRID: 6 strings × 64 columns...
[full format spec with examples]
REQUIRED OUTPUT FORMAT — return ONLY this JSON object...
```

The `aiPrompt` field is included verbatim from the profile. It covers harmonic language, technique mechanics with fret-level specifics, phrasing philosophy, and concrete song-level examples. The technique list that follows is ordered by importance for the requested type. The format spec at the end provides the exact tab layout so no ambiguity remains.

### Transport

The server uses `StdioServerTransport` from `@modelcontextprotocol/sdk`. It reads JSON-RPC messages from stdin and writes responses to stdout. This makes it compatible with any MCP client that supports the stdio transport, regardless of which LLM the client is backed by.

```js
const transport = new StdioServerTransport();
await server.connect(transport);
```

### Extending the Server

To expose a new guitarist, add its profile to `src/guitarists/`, import it in `mcp/index.js`, add entries to `STYLE_SUMMARIES` and `TECHNIQUES`, and add the ID to the `GUITARIST_ID` zod enum. The three tools will automatically include it.
