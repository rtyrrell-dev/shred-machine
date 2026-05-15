#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import EVH  from "../src/guitarists/evh.js";
import DEM  from "../src/guitarists/demartini.js";
import LNCH from "../src/guitarists/george-lynch.js";
import JADE from "../src/guitarists/puget.js";
import IAN  from "../src/guitarists/ian-dsa.js";

// ── Profile registry ──────────────────────────────────────────────────────────

const PROFILES = { evh: EVH, dem: DEM, lnch: LNCH, jade: JADE, ian: IAN };

const GUITARIST_ID = z.enum(["evh", "dem", "lnch", "jade", "ian"]);

// ── One-sentence style summaries (for list_guitarists) ────────────────────────

const STYLE_SUMMARIES = {
  evh:
    "Pioneer of two-handed tapping. Pentatonic/blues vocabulary; EVH octatonic symmetrical scale; " +
    "Mixolydian bVII→I rhythm work; gallop and syncopated patterns. Wide, expressive vibrato. " +
    "The defining shred benchmark of the 1980s.",
  dem:
    "Melodic restraint above technical display. Signature slow→fast 'burst' phrasing arc. " +
    "Diatonic 3rd/6th twin-guitar harmony. Blues b5 'slippery' passing tone. " +
    "Sustained singing bends with violinist-style vibrato. Aeolian minor rock rhythms.",
  lnch:
    "Most harmonically exotic LA metal player. Phrygian and harmonic minor primary. " +
    "'Gray area' chromatic approach: outside passing tones that resolve in-key. " +
    "Tritone/b5 in virtually every composition. Wide 'jackoff' vibrato applied immediately on note onset. " +
    "Dark Middle Eastern / Spanish flavor.",
  jade:
    "Post-punk intelligence in a heavy context. Eb standard tuning. Neapolitan bII chord dissonance. " +
    "Open-string pedal + fretted melody dual-voice technique. Syncopated stabs (never straight 8ths in mid/late era). " +
    "Atmospheric over aggressive; melodic counterpoint over brute force.",
  ian:
    "Drop D as a complete guitar language. D-string bounce riff formula: str0 open-D pedal alternating " +
    "with str2 fretted melody. Gallop rhythm from Iron Maiden DNA. Aeolian D minor with Bb (flat-6) color note. " +
    "Vocal, singable leads — every phrase should be humm-able.",
};

// ── Characteristic techniques per guitarist per type ─────────────────────────

const TECHNIQUES = {
  evh: {
    lead: [
      "Two-handed tapping: tap–pull–hammer triplet units. Eruption core: tap 12, pull 5, hammer 8 on B string.",
      "EVH octatonic scale [0,1,3,4,6,7,9,10] — symmetrical 3-note-per-string cascading runs.",
      "Minor pentatonic and blues scale primary vocabulary; Mixolydian for major-feel passages.",
      "Wide, expressive vibrato at phrase endings — 'a feeling not an effect'; applied after sustain.",
      "Natural harmonics at frets 5, 7, 12 for chime accents and whammy dive-bomb targets.",
      "Long cascading hammer-on/pull-off legato runs; alternate picking only for burst sections.",
      "Whammy bar: dive bombs on harmonics, flutter, subtle pitch shading on sustaining notes.",
    ],
    rhythm: [
      "Mixolydian bVII→I signature (e.g. D5→E5, G5→A5 on A string — 'Runnin' With the Devil').",
      "Triad inversions on G–B–e strings over open low-E pedal tone ('Panama' mid-section).",
      "Gallop pattern (8th+16th+16th) for boogie sections ('I'm the One').",
      "Syncopated upbeat accents — hits on 'and-of' subdivisions, heavy beat-3 emphasis.",
      "Palm-muted single-note lines on low-E or A string alternating with power chord stabs.",
      "Straight 8th-note chug with one syncopated accent stab per bar for grinding sections.",
    ],
  },
  dem: {
    lead: [
      "Burst phrasing: slow/mid blues bends in measures 1–2, tight 16th pentatonic run in measures 3–4.",
      "Diatonic harmony leads in parallel 3rds and 6ths — 'Round and Round' twin-guitar texture.",
      "Blues b5 passing tone: flat-5 between scale tones on D string — the 'slippery' DeMartini fingerprint.",
      "Wide vibrato applied AFTER note is fully bent and held; violinist-style along string length.",
      "Full-step bends targeting minor 3rd and perfect 4th above root; B-string fret 7 signature bend.",
      "Aeolian [0,2,3,5,7,8,10] for longer melodic passages; Dorian for brighter-minor moments.",
      "Smooth legato for phrases; alternate picking only for speed bursts.",
    ],
    rhythm: [
      "Open low-E pedal tone sustaining beneath A-string chord stabs — Ratt rhythmic DNA.",
      "Aeolian i→bVII→bVI backbone: E5→D5→C5→D5 in E minor.",
      "'Round and Round' riff: open E drone + A-string stabs at 7(A5) and 5(G5).",
      "Anticipates beat 1 of next measure — chord hits on and-of-4 of previous bar.",
      "Double-stop dyads (minor 3rds or perfect 4ths on D+G strings) as textural device.",
      "Both guitars double in unison on driving 8th-note riffs; harmonic split only on harmony leads.",
    ],
  },
  lnch: {
    lead: [
      "Phrygian [0,1,3,5,7,8,10] primary — the b2 (half-step above root) is the defining Lynch note.",
      "Harmonic minor [0,2,3,5,7,8,11] for exotic sweep arpeggios; Phrygian dominant for Arabic color.",
      "'Gray area' chromatic approach: insert passing tones outside scale, always resolve to in-key target.",
      "Tritone/b5 appears in almost every composition as sudden darkness before resolution.",
      "Jackoff vibrato: hand moves parallel to neck (side-to-side), wide, applied immediately on note onset.",
      "Tap arpeggios: [tap=lo+12, pull=lo, hammer=lo+3] minor triad; 8 cols per unit, mid-register strings.",
      "Gothic Octave / Hirajoshi [0,2,3,7,8] for pure oriental color.",
    ],
    rhythm: [
      "Fast A-string machine-gun: palm-muted alternate-pick 16ths with chromatic passing tones between positions.",
      "i→bVII→bVI with chromatic connectors — half-step approach note on off-16th before each chord change.",
      "bII Phrygian lurch: i→bII(rootFret+1)→i — Spanish dissonance lasting ≤2 beats before resolution.",
      "Chromatic passing chord (rootFret+1) on the off-16th is structurally different from all other LA metal players.",
    ],
  },
  jade: {
    lead: [
      "Multi-string always: almost never single-string; frets two strings or fretted + open string simultaneously.",
      "'Days of the Phoenix' formula: open Bb (str4 fret 0) pedal alternating with fretted eb melody (str5).",
      "Phrygian runs [0,1,3,5,7,8,10] at positions 5, 7, 9 — 'Leaving Song Pt. II' style.",
      "Aeolian melodic lines on upper strings (Gb/Bb/eb), 8th-note or dotted-8th spacing — never 16th density.",
      "Melodic tapping: groups of 6 columns (triplet feel); tap 12/pull 5/hammer 8 (Aeolian shape).",
      "Tremolo-picked drone on root or 5th for atmospheric texture; resolves into stab or melodic phrase.",
    ],
    rhythm: [
      "Neapolitan bII: i(0)→bII(rootFret+1)→i — sudden half-step lurch, hallmark AFI device across all eras.",
      "Syncopated stab pattern (mid/late era): NEVER straight 8ths — hits at cols [0,6,10,14] or [2,6,10,12].",
      "i→bVI→bVII Aeolian progression on Ab string in Eb standard (Ab minor typical key center).",
      "Black Sails era: fast 8th-note chug with bII neighbor stabs; Phrygian aggression; standard tuning.",
      "Verse palm-muted restraint vs. full-barre chorus explosion — dynamic contrast IS the structure.",
    ],
  },
  ian: {
    lead: [
      "D-string descending runs: frets [12,10,8,7,5,3,2,0] on str2 with open-D pedal (str0) every 4 notes.",
      "Alternate-picked Aeolian runs on str2–str5 at positions 5, 7, 12.",
      "8th-note melodic spacing with vibrato — not constant 16th-note shred; phrases are vocal and restrained.",
      "Open-D drone (str0 or str2 fret 0) sustaining beneath upper-string melody on str4 or str5.",
      "Bb (fret 8 on str2) is the defining color note — flat-6 of Aeolian D minor, the 'sinister' sound.",
    ],
    rhythm: [
      "D-string bounce: str0 open-D pedal alternating with str2 fretted notes at 8th-note spacing.",
      "Reference frets on str2 (D natural minor): 0=D 2=E 3=F 5=G 7=A 8=Bb 10=C 12=D(oct).",
      "Drop D barre power chords: fret 0=D5, 3=F5, 5=G5, 7=A5, 8=Bb5, 10=C5 — one-finger across str0–str2.",
      "Gallop pattern: col offsets [0,4,6,8,12,14] in a 16-col measure — 'Red Flag' urgency.",
      "March pattern: chug [0,2,4,6,8,10,12,14], locked to kick; accents on beats 1+3 — 'Viking Death March'.",
      "Call-and-response: Drop D power chord on even cols, single str2 melody note on odd cols.",
    ],
  },
};

// ── ASCII tab format specification ────────────────────────────────────────────

const TAB_FORMAT_SPEC = `
━━ ASCII TAB FORMAT SPECIFICATION ━━

GRID: 6 strings × 64 columns = 4 measures of 16 sixteenth-note columns each.

LINE STRUCTURE:
  [string_name]|[16 chars]|[16 chars]|[16 chars]|[16 chars]|
  Each row is exactly: 2-char name+pipe, then four 16-char measure blocks each ending with pipe.

COLUMNS:
  • 64 columns = 64 sixteenth notes across four 4/4 measures.
  • Column 0  = beat 1, measure 1.  Column 16 = beat 1, measure 2.
  • Column 32 = beat 1, measure 3.  Column 48 = beat 1, measure 4.
  • Frets 0–9: occupy 1 column.  Frets 10–22: occupy 2 consecutive columns.
  • Empty positions: dash character '-'.

DECORATIONS (placed immediately after the last fret digit, before next dash):
  h  hammer-on      p  pull-off      ~  vibrato
  /  slide up       \\  slide down    t  picking-hand tap

STRING ORDER (top line = highest pitch, bottom line = lowest):
  E standard:   e | B | G | D | A | E
  Eb standard:  eb| Bb| Gb| Db| Ab| Eb
  Drop D:       e | B | G | D | A | D

EXAMPLE — EVH tapping pattern on B string (E standard, 120 BPM):
e|----------------|----------------|----------------|----------------|
B|12p5h8-12p5h8--|12p5h8-12p5h8--|12p5h8-12p5h8--|12p5h8-12p5h8--|
G|----------------|----------------|----------------|----------------|
D|----------------|----------------|----------------|----------------|
A|----------------|----------------|----------------|----------------|
E|----------------|----------------|----------------|----------------|

EXAMPLE — Drop D power chord on str0+str1+str2 (all three strings, same fret):
e|----------------|----------------|----------------|----------------|
B|----------------|----------------|----------------|----------------|
G|----------------|----------------|----------------|----------------|
D|0---------------|5---------------|7---------------|0---------------|
A|0---------------|5---------------|7---------------|0---------------|
D|0---------------|5---------------|7---------------|0---------------|

REQUIRED OUTPUT FORMAT — return ONLY this JSON object, no surrounding text:
{"tab":"<the 6-line tab with lines joined by \\n>","bpm":<integer>,"label":"<short descriptive label>"}
`.trim();

// ── Server setup ──────────────────────────────────────────────────────────────

const server = new McpServer({ name: "shred-machine", version: "1.0.0" });

// ─────────────────────────────────────────────────────────────────────────────
// Tool 1: list_guitarists
// ─────────────────────────────────────────────────────────────────────────────

server.tool(
  "list_guitarists",
  "Returns all available guitarist IDs with names, bands, eras, tunings, and style summaries. " +
  "Call this first to see who is available before calling get_guitarist_profile or generate_tab.",
  {},
  async () => {
    const list = Object.values(PROFILES).map(p => ({
      id: p.id,
      name: p.name,
      band: p.band,
      era: p.era,
      tuning: p.tuningName,
      style_summary: STYLE_SUMMARIES[p.id],
    }));

    return {
      content: [{ type: "text", text: JSON.stringify(list, null, 2) }],
    };
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// Tool 2: get_guitarist_profile
// ─────────────────────────────────────────────────────────────────────────────

server.tool(
  "get_guitarist_profile",
  "Returns deep profile data for a specific guitarist: tuning (with open-string MIDI values and string names), " +
  "full scale vocabulary with interval arrays, BPM ranges for lead and rhythm, characteristic lead and rhythm " +
  "techniques, preferred fret-position windows, landmark song references (key, BPM, techniques, annotations), " +
  "and a feel/philosophy summary.",
  { guitarist_id: GUITARIST_ID },
  async ({ guitarist_id }) => {
    const p = PROFILES[guitarist_id];

    // Include up to 6 songs, preserving the full structure
    const songKeys = Object.keys(p.songs ?? {}).slice(0, 6);
    const songs = Object.fromEntries(
      songKeys.map(k => {
        const s = p.songs[k];
        return [k, {
          album:      s.album,
          key:        s.key,
          bpm:        s.bpm,
          tuning:     s.tuning,
          techniques: s.techniques,
          notes:      s.notes,
        }];
      })
    );

    const profile = {
      identity: {
        id:   p.id,
        name: p.name,
        band: p.band,
        era:  p.era,
      },
      tuning: {
        name:                   p.tuningName,
        open_strings_midi:      p.open,       // index 0 = low string, 5 = high string
        string_names_high_low:  p.strings,    // display order: high→low
      },
      bpm_ranges: {
        lead:   { min: p.bpmLead[0],   max: p.bpmLead[1] },
        rhythm: { min: p.bpmRhythm[0], max: p.bpmRhythm[1] },
      },
      scale_vocabulary:  p.scales,            // { scaleName: [semitone intervals from root] }
      lead_positions:    p.leadPositions,     // preferred 4-fret window starting frets
      techniques: {
        lead:   TECHNIQUES[guitarist_id].lead,
        rhythm: TECHNIQUES[guitarist_id].rhythm,
      },
      song_references:   songs,
      feel_and_philosophy: STYLE_SUMMARIES[guitarist_id],
    };

    return {
      content: [{ type: "text", text: JSON.stringify(profile, null, 2) }],
    };
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// Tool 3: generate_tab
// ─────────────────────────────────────────────────────────────────────────────

server.tool(
  "generate_tab",
  "Returns everything Claude needs to generate an authentic 4-measure ASCII guitar tab exercise for " +
  "the specified guitarist and type (lead or rhythm). The response includes: the complete guitarist style " +
  "prompt with technique mechanics, theory, and fret-level specifics; a prioritized list of techniques " +
  "to use for the requested type; the BPM range; and the exact ASCII tab format specification with examples. " +
  "This tool does NOT call any external API — it only provides knowledge. Claude does the generation.",
  {
    guitarist_id: GUITARIST_ID,
    type: z.enum(["lead", "rhythm"]),
  },
  async ({ guitarist_id, type }) => {
    const p    = PROFILES[guitarist_id];
    const techs = TECHNIQUES[guitarist_id][type];
    const bpmRange = type === "lead" ? p.bpmLead : p.bpmRhythm;

    const output = [
      // Full style prompt verbatim from the profile
      p.aiPrompt,

      "",
      "━━ GENERATION TASK ━━",
      `Generate a ${type === "lead" ? "LEAD / SOLO" : "RHYTHM / RIFF"} exercise in the style above.`,
      "",
      `BPM range for ${type}: ${bpmRange[0]}–${bpmRange[1]} (choose a specific value within this range)`,
      `Tuning: ${p.tuningName}`,
      `String names (high→low): ${p.strings.join(" ")}`,
      "",
      `KEY TECHNIQUES TO APPLY (${type.toUpperCase()}):`,
      ...techs.map((t, i) => `  ${i + 1}. ${t}`),
      "",
      TAB_FORMAT_SPEC,
    ].join("\n");

    return {
      content: [{ type: "text", text: output }],
    };
  }
);

// ── Start server ──────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
