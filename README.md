# Shred Machine

An interactive guitar practice generator that creates randomized lead and rhythm exercises in the styles of iconic rock and metal guitarists. Generate ASCII tablature and hear it played back through a synthesizer.

**Live:** [shred-machine.vercel.app](https://shred-machine.vercel.app)

---

## What It Does

Shred Machine procedurally generates guitar tab from hardcoded patterns, scale data, and music theory rules for each guitarist. Each generated exercise displays as ASCII tablature (6 strings × 64 columns = 4 measures of 16th notes), plays back through the Web Audio API using a sawtooth oscillator, and can be printed as a PDF.

---

## Guitarists

| ID | Name | Band | Style Focus |
|----|------|------|-------------|
| EVH | Eddie Van Halen | Van Halen | Two-hand tapping, pentatonic runs, whammy phrasing |
| DEM | Warren DeMartini | Ratt | Diatonic harmony, burst phases, melodic legato |
| LNCH | George Lynch | Dokken | Phrygian/harmonic minor, chromatic approach, tap arpeggios |
| JADE | Jade Puget | AFI | Neapolitan bII, open-string technique, Aeolian/Phrygian |
| IAN | Ian D'Sa | Billy Talent | Drop D, D-string bounce, syncopated riffs |
| RND | Random | — | Picks randomly from any of the above |

Up to 3 guitarists can be selected simultaneously. When multiple are active, the generator picks one randomly per exercise.

---

## Exercise Types

**Lead / Solo**
Tapping sequences, scale runs, triads, harmonized lines, Phrygian runs, arpeggios, and melodic phrases — each guitarist uses their characteristic scale vocabulary and position patterns.

**Rhythm / Riff**
Power chords, pedal tones, syncopated stabs, chugging patterns, double-stops, and gallop patterns — shaped around the progressions and rhythmic feels each guitarist is known for.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Build | Vite 8 |
| Styling | Inline CSS-in-JS (`STYLES` constant), Google Fonts (Orbitron, Share Tech Mono) |
| Audio | Web Audio API — sawtooth oscillator, gain envelope, procedural click track |
| MCP Server | `@modelcontextprotocol/sdk` — exposes guitarist knowledge as tools for LLM integration |
| Deployment | Vercel |

No CSS framework, no audio library, no state management library. The project is a single React component (`src/App.jsx`) and five guitarist profile files.

---

## Project Structure

```
shred-machine/
├── src/
│   ├── App.jsx              # Main component: all generators, UI, audio, playback logic
│   ├── main.jsx             # React entry point
│   └── guitarists/
│       ├── evh.js           # Eddie Van Halen profile
│       ├── demartini.js     # Warren DeMartini profile
│       ├── george-lynch.js  # George Lynch profile
│       ├── puget.js         # Jade Puget profile
│       └── ian-dsa.js       # Ian D'Sa profile
├── mcp/
│   ├── index.js             # MCP server — three knowledge tools for LLM integration
│   └── package.json         # Separate package: @modelcontextprotocol/sdk, zod
├── index.html
├── vite.config.js
├── vercel.json
└── package.json
```

Each guitarist file exports a profile object containing:
- Metadata: `name`, `band`, `color`
- Music data: scales, positions, tap patterns, rhythm progressions, BPM ranges, open-string MIDI values
- `aiPrompt`: a detailed style prompt consumed by the MCP server's `generate_tab` tool

---

## MCP Server

Shred Machine ships an [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server that exposes guitarist knowledge as tools any MCP-compatible client can call. The server imports the same guitarist profiles used by the web app and serves them as structured data. It makes no external API calls — it only provides knowledge. The LLM does the tab generation.

### Tools

| Tool | Input | Returns |
|------|-------|---------|
| `list_guitarists` | _(none)_ | All five guitarist IDs with name, band, era, tuning, and style summary |
| `get_guitarist_profile` | `guitarist_id` | Deep profile: MIDI tuning, scale interval arrays, BPM ranges, technique lists, song references |
| `generate_tab` | `guitarist_id`, `type` (`lead`\|`rhythm`) | Full style prompt with fret-level technique specifics, prioritized technique list for the requested type, BPM range, and the complete ASCII tab format specification |

### Setup

```bash
cd mcp
npm install
node index.js   # communicates over stdio
```

### Client Configuration

The server uses the MCP stdio transport. Add it to any MCP-compatible client using the standard server configuration format:

```json
{
  "mcpServers": {
    "shred-machine": {
      "command": "node",
      "args": ["/absolute/path/to/shred-machine/mcp/index.js"]
    }
  }
}
```

### Intended Workflow

1. Call `list_guitarists` to see available styles.
2. Optionally call `get_guitarist_profile` to inspect a guitarist's harmonic vocabulary and techniques.
3. Call `generate_tab` with a guitarist ID and type. The response contains everything an LLM needs to produce an authentic 4-measure ASCII tab exercise. The expected output format from the LLM is:

```json
{"tab": "<6-line ASCII tab>", "bpm": <integer>, "label": "<short label>"}
```

---

## Getting Started

### Prerequisites

- Node.js 16+

### Install and Run

```bash
npm install
npm run dev
# → http://localhost:5173
```

### Other Scripts

```bash
npm run build    # Production build → dist/
npm run preview  # Serve the production build locally
npm run lint     # ESLint check
```

---

## Deployment

The project deploys to Vercel as a static SPA.

To deploy your own instance:

1. Push the repo to GitHub.
2. Import it in the Vercel dashboard.
3. Deploy.

---

## How Generation Works

### Tab Building

All exercises are represented as a list of note events:

```js
{ col: Number, str: Number, fret: Number, d?: String }
// col  — 16th-note position (0–63)
// str  — string index 0–5 (low E to high e)
// fret — fret number 0–22
// d    — optional decoration: 'h' (hammer-on), 'p' (pull-off), '~' (vibrato), '/' (slide)
```

`buildTab(events, open)` converts the event list into a 6-string ASCII grid split into four 16-column measures.

### Audio Playback

`toAudio(events, bpm, open)` converts fret positions to MIDI values using the guitarist's open-string tuning array, then to Hz via `440 * 2^((midi-69)/12)`. The scheduler creates one `AudioContext`, pre-schedules all oscillators up front, and fires a beat callback every quarter note to drive the UI progress bar and beat dots.

The click track uses short noise bursts — 70 ms on beat 1, 40 ms on beats 2–4.

### Position Windows

Scale notes are resolved within a 4-fret "position window" on the neck (e.g., position 7 = frets 7–11). This keeps phrases physically playable and forces the style-appropriate areas of the neck each guitarist favors.

### Tunings

Open-string arrays are defined as MIDI values:

```js
const STD   = [40,45,50,55,59,64]; // E A D G B e
const DROPD = [38,45,50,55,59,64]; // D A D G B e
```

All interval arithmetic operates in semitones, making alternate tunings transparent to the generators. Ian D'Sa uses Drop D; all others use E Standard (Jade Puget uses Eb in some contexts, defined in his profile).

---

## Adding a New Guitarist

1. Create `src/guitarists/yourname.js` following the structure of an existing profile.
2. Define `name`, `band`, `color`, `open` (MIDI array), `bpmLead`, `bpmRhythm`, scales, positions, and patterns.
3. Import it in `src/App.jsx` and add it to the `GUITARISTS` array.
4. Write `yourname_lead()` and `yourname_rhythm()` generator functions in `App.jsx`.
