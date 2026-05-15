/**
 * Warren DeMartini — Ratt (1983–1992 era)
 *
 * Dual-purpose profile:
 *   1. `aiPrompt`  — injected into Claude prompts for AI tab generation
 *   2. All other exports — raw data consumed by hardcoded generator functions
 */

// ─── Identity ─────────────────────────────────────────────────────────────────

export const id    = 'dem';
export const name  = 'Warren DeMartini';
export const band  = 'Ratt';
export const era   = '1983–1992';
export const color = '#ff2d78';

// ─── Tuning ───────────────────────────────────────────────────────────────────

/**
 * DeMartini played E standard through most of the Ratt catalog.
 * Drop D (D A D G B e) appears on "Lay It Down" and several later tracks;
 * he endorsed the EVH D-Tuna for quick E→D drops mid-set.
 *
 * MIDI open strings, index 0 = low string, 5 = high e:
 *   E standard: E2=40  A2=45  D3=50  G3=55  B3=59  e4=64
 *   Drop D:     D2=38  A2=45  D3=50  G3=55  B3=59  e4=64
 */
export const open       = [40, 45, 50, 55, 59, 64]; // E standard
export const openDropD  = [38, 45, 50, 55, 59, 64]; // Drop D
export const tuningName = 'E standard (Drop D on select songs)';
export const strings    = ['e', 'B', 'G', 'D', 'A', 'E']; // high→low display
export const stringsDropD = ['e', 'B', 'G', 'D', 'A', 'D'];

// ─── Tempo ranges ─────────────────────────────────────────────────────────────

export const bpmLead   = [115, 178]; // Blues passages bottom out ~115; bursts hit ~178
export const bpmRhythm = [88,  140];

// ─── Scale / mode palette ─────────────────────────────────────────────────────

/**
 * Intervals in semitones from the root.
 *
 * DeMartini's harmonic vocabulary in rough order of preference:
 *  1. Minor pentatonic  — primary lead vocabulary, all eras
 *  2. Blues scale       — adds b5 "slippery" passing tone between frets 4 and 5
 *                         on low D string; his single most identifiable lead color
 *  3. Aeolian / natural minor — full minor scale for more melodic passages;
 *                         combines freely with pentatonic by adding the 2nd and 6th
 *  4. Dorian            — "You're in Love" solo, adds raised 6th for brighter minor feel
 *  5. Mixolydian        — occasional major-feel riff contexts
 *  6. Harmonic minor    — sparingly, for exotic resolution on slower songs
 */
export const scales = {
  pentatonicMinor: [0, 3, 5, 7, 10],
  blues:           [0, 3, 5, 6, 7, 10],  // b5 passing tone is his signature "slippery" note
  aeolian:         [0, 2, 3, 5, 7, 8, 10],
  dorian:          [0, 2, 3, 5, 7, 9, 10],
  mixolydian:      [0, 2, 4, 5, 7, 9, 10],
  harmonicMinor:   [0, 2, 3, 5, 7, 8, 11],
};

// ─── Lead fret-position windows ──────────────────────────────────────────────

/**
 * Four-fret boxes DeMartini most commonly soloed from.
 * He favors mid-neck positions (7–12), rarely ventures to the very high
 * registers unless doing a specific extended run.
 */
export const leadPositions = [7, 9, 12, 5, 10, 15];

// ─── Diatonic harmony (3rds and 6ths) ────────────────────────────────────────

/**
 * DeMartini's most distinctive compositional signature: harmonized lead lines
 * in diatonic 3rds and 6ths played simultaneously with Robbin Crosby.
 * "Round and Round" made this approach famous in the Sunset Strip scene.
 *
 * Interval tables express the gap in semitones between the LOWER and UPPER
 * voice at each scale degree, cycling up the scale.  Apply to the lower
 * melody note's MIDI value to find the upper voice.
 *
 * Aeolian (natural minor) diatonic 3rds cycling through scale degrees:
 *   Degree:  i   ii°  bIII  iv   v   bVI  bVII
 *   Gap:     3    3    4     3    3    4    4    (semitones, repeating)
 *
 * Aeolian diatonic 6ths (lower voice moves, upper voice 6 degrees above):
 *   Gap:     8    9    8     9    8    8    9
 */
export const harmonyIntervals = {
  /**
   * Diatonic minor 3rds — the Round and Round / Wanted Man approach.
   * Index 0 = gap at root/tonic, cycling through 7 scale degrees.
   * Generator picks a starting degree, then applies these gaps in sequence.
   */
  minor3rds:  [3, 3, 4, 3, 3, 4, 4],

  /**
   * Diatonic major-context 3rds (for Dorian-flavor songs like "You're in Love").
   * Gap pattern for Dorian: same as minor except degree ii = major 3rd.
   */
  dorian3rds: [3, 4, 3, 3, 4, 3, 4],

  /**
   * Diatonic 6ths in minor — wider, sweeter sound; used in verse hooks.
   */
  minor6ths:  [8, 9, 8, 9, 8, 8, 9],

  /**
   * String pair preferences for harmonized lines (lower voice str, upper str).
   * DeMartini most often harmonizes on adjacent string pairs:
   *   [3, 4] = G + B strings  (bright, cutting through mix)
   *   [4, 5] = B + e strings  (highest, cleanest)
   *   [2, 3] = D + G strings  (warmer, mid-focused)
   */
  stringPairs: [[3, 4], [4, 5], [2, 3]],
};

// ─── Accelerating burst structure ────────────────────────────────────────────

/**
 * DeMartini's signature phrasing arc: start a phrase slowly with blues feel,
 * then accelerate into a tight 16th-note run at the phrase climax.
 * This creates tension and release without constant shredding.
 *
 * Values are 16th-note column spacings per note in each phase:
 *   slow  = 4 cols/note  → quarter-note feel (deliberate blues)
 *   mid   = 3 cols/note  → triplet feel (beginning to push)
 *   fast  = 2 cols/note  → 8th-note feel (building)
 *   blitz = 1 col/note   → full 16th-note speed (climax burst)
 *
 * Typical 2-measure arc (32 cols total):
 *   Cols 0–11:  slow (3 notes × 4 cols)
 *   Cols 12–17: mid  (2 notes × 3 cols)
 *   Cols 18–31: blitz (14 notes × 1 col)
 */
export const burstPhases = {
  slow:  4,
  mid:   3,
  fast:  2,
  blitz: 1,
  /**
   * Preset split points (16th-note column where each phase starts) for a
   * standard 2-measure (32 col) burst arc.  Generator can use or randomize.
   */
  arcPresets: [
    { slow: 0, mid: 12, fast: 18, blitz: 22 }, // late burst
    { slow: 0, mid: 8,  fast: 14, blitz: 20 }, // mid burst
    { slow: 0, mid: 6,  fast: 12, blitz: 16 }, // early burst — most aggressive
  ],
};

// ─── Double-stop dyads ────────────────────────────────────────────────────────

/**
 * DeMartini's characteristic rhythm/lead texture: two notes struck together
 * on adjacent strings, moving in parallel intervals.  Used both as rhythmic
 * stabs between power chord hits and as a lead melodic device.
 *
 * Each shape is [strLow, strHigh, intervalSemitones].
 * intervalSemitones = gap between the two notes (perfect 4th = 5, minor 3rd = 3, etc.)
 *
 * Most common: parallel minor 3rds or perfect 4ths on G+D or B+G string pairs.
 */
export const doubleStopShapes = [
  // [lowerString, upperString, semitoneInterval]
  [2, 3,  5],  // D + G strings, perfect 4th — power-chord texture
  [2, 3,  3],  // D + G strings, minor 3rd   — bluesy pull
  [2, 3,  4],  // D + G strings, major 3rd   — brighter double stop
  [3, 4,  5],  // G + B strings, perfect 4th
  [3, 4,  3],  // G + B strings, minor 3rd
  [3, 4,  4],  // G + B strings, major 3rd
  [4, 5,  3],  // B + e strings, minor 3rd   — high-register hook lines
  [4, 5,  5],  // B + e strings, perfect 4th
];

// ─── Rhythm: chord progressions ──────────────────────────────────────────────

/**
 * Characteristic harmonic moves expressed as semitone offsets from the root.
 * DeMartini favors Aeolian minor rock (i–bVII–bVI–bVII), open-string pedal
 * tones, and call-and-response between chord stabs and single-note fills.
 */
export const rhythmProgressions = {
  /**
   * Aeolian power-chord progression — i → bVII → bVI → bVII.
   * The backbone of Ratt: "Round and Round", "Back for More", "Lay It Down".
   * Offsets in semitones from root; apply to A or low-E fret position.
   * Four entries = four measures; loop as needed.
   */
  aeolianPower: [
    [0, -2, -4, -2],   // i  bVII  bVI  bVII — classic Ratt cycle
    [0, -2,  0, -4],   // i  bVII   i   bVI
    [0, -4, -2,  0],   // i   bVI  bVII   i  — reversed cadence
    [0, -2, -4, -5],   // i  bVII  bVI   bV  — darker, minor color
  ],

  /**
   * Open low-E pedal + A-string chord stabs.
   * "Round and Round" feel: open E drone sustains while chords punch above.
   * Fret offsets on A string (str1); low E (str0) plays open (fret 0) throughout.
   * Four entries = four stab positions per measure.
   */
  pedalStab: [
    [7, 5, 3, 5],    // A5 → G5 → F5 → G5  (E minor area)
    [7, 7, 5, 5],    // A5 → A5 → G5 → G5  (syncopated hold)
    [5, 7, 5, 3],    // G5 → A5 → G5 → F5
    [3, 5, 7, 5],    // F5 → G5 → A5 → G5  (ascending line)
  ],

  /**
   * Drop D chugging — "Lay It Down" style.
   * All three values are low-3-string fret positions for one-finger barre in Drop D.
   * 0 = open D5 power chord; 3 = F5; 5 = G5; 7 = A5; 10 = C5.
   * Sequence of 8 hits per measure (8th-note chug), 4 measures.
   */
  dropDChug: [
    [0, 0, 5, 5, 0, 0, 7, 7],   // D5 hold → G5 → D5 → A5
    [0, 0, 7, 0, 5, 5, 0, 0],   // syncopated A5 stab
    [0, 5, 0, 7, 0, 5, 3, 0],   // moving line under chug
    [0, 0, 3, 5, 7, 5, 3, 0],   // ascending F5–G5–A5 run back to D5
  ],

  /**
   * Double-stop rhythm stabs — DeMartini's other rhythm texture.
   * Pairs of absolute fret values [G-string, D-string] for dyad hits.
   * Used between power-chord sections for interplay and dynamics.
   */
  doubleStopStabs: [
    [[7, 9], [5, 7], [8, 10], [5,  7]],  // minor-3rd dyads descending
    [[5, 8], [7, 9], [5,  7], [8, 10]],  // alternating
    [[9,11], [7, 9], [5,  7], [7,  9]],  // from high to low
  ],
};

// ─── Rhythm: strumming / picking patterns ─────────────────────────────────────

/**
 * Preferred rhythmic attack patterns within a 16-column measure.
 * Column indices (0–15) where pick strikes occur.
 *
 * DeMartini characteristics:
 *  - Syncopated upbeat anticipations (chord hits before the beat)
 *  - Straight 8ths driving chug with accent stabs (his most common rhythm feel)
 *  - Open-string pedal alternating with chord stabs every 2 cols
 *  - Heavy beat-2 and beat-4 backbeat emphasis locking with Bobby Blotzer's kick
 */
export const rhythmPatterns = [
  [0, 4, 8, 12],              // straight quarters
  [0, 2, 4, 8, 10, 12],       // driving 8ths with open gaps
  [0, 4, 6, 8, 12, 14],       // gallop / anticipation
  [0, 2, 6, 8, 10, 14],       // syncopated upbeat hits
  [0, 4, 8, 10, 14],          // anticipating beat 4
  [0, 2, 4, 6, 8, 10, 12, 14], // straight 8ths (drop-D chug)
  [0, 6, 8, 14],              // wide-spaced stabs
  [0, 4, 6, 12, 14],          // mixed anticipation
];

// ─── Song reference library ───────────────────────────────────────────────────

/**
 * Key musical facts about landmark Ratt songs.
 * Used to label generated exercises and guide style selection.
 */
export const songs = {
  roundAndRound: {
    album: 'Out of the Cellar (1984)',
    key: 'E minor',
    bpm: 120,
    tuning: 'E standard',
    techniques: ['diatonic-harmony', 'pedal-tone', 'double-lead', 'string-bending'],
    notes: [
      'Signature dual-lead intro: DeMartini + Crosby harmonize in diatonic minor 3rds',
      'Open low-E pedal drone throughout intro riff',
      'Harmony lines on B and G strings (str4 + str3), frets ~7–10 area',
      'Solo: slow blues bend from fret 7 B string (A→B full step bend) with wide vibrato, then burst into 16th run',
      'DeMartini: originally just his part; Crosby didn\'t like his own, so DeMartini wrote the double part',
    ],
  },
  layItDown: {
    album: 'Invasion of Your Privacy (1985)',
    key: 'D minor',
    bpm: 132,
    tuning: 'Drop D',
    techniques: ['drop-d', 'palm-mute', 'chug', 'slides'],
    notes: [
      'Drop D tuning; open D5 power chord = fret 0 on all 3 low strings',
      'Main riff: open D5 chug → slide up to G5(5) → A5(7) → back',
      'Heavy palm muting on the low-string chug sections',
      'Slide decoration on ascending runs (/ between chord hits)',
      'DeMartini and Crosby play different parts here — not doubled',
    ],
  },
  backForMore: {
    album: 'Out of the Cellar (1984)',
    key: 'E minor',
    bpm: 138,
    tuning: 'E standard',
    techniques: ['power-chords', 'aeolian', 'driving-8ths', 'palm-mute'],
    notes: [
      'Driving 8th-note chug on low E string, power chord stabs on beats 2+4',
      'Both guitars double each other on rhythm parts',
      'Aeolian i–bVII–bVI chord movement: E5→D5→C5',
      'Low E pedal (open) alternating with A-string chord stabs at 5 and 7',
      'Solo: pentatonic minor box at 12th fret, full-step bends on B string',
    ],
  },
  wantedMan: {
    album: 'Out of the Cellar (1984)',
    key: 'A minor',
    bpm: 126,
    tuning: 'E standard',
    techniques: ['diatonic-harmony', 'double-guitar', 'melodic-lead'],
    notes: [
      'Both guitars double the main riff (unlike Round and Round)',
      'Harmonized lead break uses diatonic 3rds in A minor',
      'Melodic, singable solo — strong example of his song-serving approach',
    ],
  },
  youreInLove: {
    album: 'Invasion of Your Privacy (1985)',
    key: 'D major / Dorian',
    bpm: 108,
    tuning: 'E standard',
    techniques: ['dorian', 'descending-arpeggio', 'melodic-lead', 'vibrato'],
    notes: [
      'Solo opens with descending D7 arpeggio (D–A–F#–C sequence)',
      'Key alternates between D Mixolydian and D Dorian — brighter minor feel',
      'DeMartini\'s most "You\'re in Love" lick: bend on G string fret 9, hold, vibrato, resolve down',
      'Warm, vocal phrasing; the best demonstration of his restrained melodic approach',
      'Solo recorded with fatter, warmer tone than Out of the Cellar',
    ],
  },
  slipOfTheLip: {
    album: 'Invasion of Your Privacy (1985)',
    key: 'G minor',
    bpm: 134,
    tuning: 'E standard',
    techniques: ['aeolian', 'legato', 'blues-b5', 'call-response'],
    notes: [
      'Legato slippery lines featuring the b5 passing tone prominently',
      'Call-and-response interplay between the two guitar parts',
      'G minor pentatonic + blues scale: adds Gb as slippery connector between G and F on D string',
      'Solo stays in pentatonic minor box; restraint is the point',
    ],
  },
  wayCoolJr: {
    album: 'Reach for the Sky (1988)',
    key: 'E minor',
    bpm: 144,
    tuning: 'E standard',
    techniques: ['driving-8ths', 'power-chords', 'alternate-picking'],
    notes: [
      'High-energy driving riff, heavier than early Ratt material',
      'Alternate-picked single-note descending lines between power-chord sections',
      'Solo: faster, more aggressive than classic era — nods toward late 80s production style',
    ],
  },
  lackOfCommunication: {
    album: 'Out of the Cellar (1984)',
    key: 'E minor',
    bpm: 95,
    tuning: 'E standard',
    techniques: ['melodic-lead', 'sustained-bends', 'slow-build'],
    notes: [
      'Slower tempo allows DeMartini more room for wide, sustained bends',
      'Demonstrates his "land, hold, apply vibrato" approach at full expression',
      'Outro solo section DeMartini wrote later became the basis for "Big Bite" (2010)',
    ],
  },
  imInsane: {
    album: 'Out of the Cellar (1984)',
    key: 'A minor',
    bpm: 148,
    tuning: 'E standard',
    techniques: ['aggressive-rhythm', 'blues-lead', 'pentatonic'],
    notes: [
      'Hard-driving rhythm with aggressive picking attack',
      'Lead stays firmly in A minor pentatonic box positions',
      'One of the most straightforward displays of his blues-pentatonic foundation',
    ],
  },
};

// ─── AI prompt string ─────────────────────────────────────────────────────────

/**
 * Injected into Claude prompts verbatim.  Covers technique mechanics,
 * theory, feel, and fret-level specifics for authentic DeMartini tab.
 */
export const aiPrompt = `GUITARIST: Warren DeMartini (Ratt, 1983–1992 classic era)
TUNING: E standard (Drop D on "Lay It Down" and select later tracks)
STRING INDEX: 0=E(low) 1=A 2=D 3=G 4=B 5=e(high)

━━ LEAD / SOLO STYLE ━━
CORE PHILOSOPHY — Melodic, song-serving restraint:
  • "I always felt like I didn't want to play everything I know" — DeMartini on soloing
  • Less-is-more: sustained singing notes with wide vibrato trump constant 16th runs
  • Every solo has a clear arc: establish a melodic idea, develop it, then release into speed
  • You can sing every DeMartini solo — that is intentional and the primary test

SIGNATURE TECHNIQUE — Accelerating burst phrasing:
  • Opens a phrase with SLOW, deliberate blues bends (quarter-note or dotted-8th spacing)
  • Holds bent notes, gradually introduces wide vibrato — "violinist style" (along string length, not across)
  • Then BURSTS into tight 16th-note pentatonic run at phrase climax
  • Two-measure arc: measures 1–2 = slow/mid phrasing → measures 3–4 = 16th blitz
  • This acceleration from blues feel to shred speed is his most identifiable device

SCALE / HARMONY CHOICES:
  • Primary: minor pentatonic [0,3,5,7,10] — all lead playing, all eras
  • Blues scale b5 [0,3,5,6,7,10] — the "slippery" flat-5 connector is a DeMartini fingerprint
    (on D string: fret 6 passing between G fret 5 and A fret 7 in E minor)
  • Aeolian [0,2,3,5,7,8,10] — full minor for longer melodic passages; add 2nd and 6th to pentatonic
  • Dorian [0,2,3,5,7,9,10] — "You're in Love" solo; brighter raised-6th color
  • Favorite lead positions: 7th, 9th, 12th fret boxes; rarely ventures above 15th

VIBRATO & BENDS:
  • Vibrato is wide and medium-speed, applied AFTER note is fully bent and held
  • Influenced by Michael Schenker and George Lynch; fingertip rolls back and forth along string
  • Full-step bends are more common than half-step; target the minor 3rd and perfect 4th above root
  • Signature bend: B string fret 7 (A → B full step, in E minor context) held 2–3 beats then vibrated

DIATONIC HARMONY LEAD LINES:
  • Defining compositional signature: two guitars harmonize melody in diatonic minor 3rds
  • "Round and Round" introduced this to LA metal; both voices move in parallel through the scale
  • Minor 3rd gap pattern cycling through natural minor scale degrees: [3,3,4,3,3,4,4] semitones
  • Preferred string pairs: G+B (str3+str4) for cutting brightness, B+e (str4+str5) for high clarity
  • Never use chromatic harmonies — both voices always stay strictly diatonic to the key

LEGATO & PICKING:
  • Primarily legato for longer phrases: hammer-ons and pull-offs create smooth, slippery lines
  • Alternate picking used only for fast speed-burst sections
  • George Lynch influence: side-picking technique (tip of pick points toward bridge) for speed runs
  • The b5 "slippery legato line" is his most characteristic legato move

━━ RHYTHM / RIFF STYLE ━━
HARMONIC LANGUAGE — Aeolian minor rock:
  • i → bVII → bVI → bVII is the Ratt harmonic backbone (E5→D5→C5→D5 in E minor)
  • Open low-E or open low-D (drop D) pedal tone sustaining beneath A-string chord stabs
  • "Round and Round" riff: open E drone + A-string stabs at 7(A5) and 5(G5) alternating
  • Power chords on A string; single-note pedal on low-E or open D string
  • Double-stop dyads (minor 3rds or perfect 4ths on D+G strings) as textural device between chords

RIFF ANATOMY — "Lay It Down" drop-D chug:
  • Low 3-string barre at fret 0 = D5; at fret 5 = G5; fret 7 = A5; fret 3 = F5
  • 8th-note chug pattern: D5-D5-D5 → G5 stab → back to D5 → A5 stab
  • Slides (/) decorate ascending transitions between chord positions
  • Heavy palm muting on all D5 chug sections; lift for chord stabs

RIFF ANATOMY — "Back for More" / "I'm Insane" 8th-note grind:
  • Open low-E drives 8th-note pulse; A-string power chord stabs on beats 2 and 4
  • Aeolian i–bVII–bVI chord colors: E5(0) → D5(5 on A) → C5(3 on A)
  • Both guitars double the rhythm in unison — no harmonic split here, just raw power

SYNCOPATION & FEEL:
  • Rhythm locks tightly with Bobby Blotzer's kick drum — riffs literally outline the drum pattern
  • Anticipates beat 1 of the next measure (chord hits on "and-of-4" of previous bar)
  • Straight 8th-note chug is common but always with one syncopated accent stab per bar
  • The two guitars often split: one chugs the pedal, the other stabs the chords above it

━━ FEEL & PHILOSOPHY ━━
"It's so easy to play fast, play a lot, over everything — it's too easy, and certainly not challenging."
DeMartini's restraint is the technique. Silence and sustain are his primary colors.
Tone evolved album-by-album: thinner on Out of the Cellar, warmer and fatter from Invasion onward.
Heavy slapback echo at the board is intrinsic to the Ratt guitar sound — not a performance effect.
Heavily influenced by EVH (tone, whammy restraint) and George Lynch (picking, legato, b5 vocabulary).`;

// ─── Convenience re-export for generator functions ────────────────────────────

export default {
  id,
  name,
  band,
  era,
  color,
  open,
  openDropD,
  tuningName,
  strings,
  stringsDropD,
  bpmLead,
  bpmRhythm,
  scales,
  leadPositions,
  harmonyIntervals,
  burstPhases,
  doubleStopShapes,
  rhythmProgressions,
  rhythmPatterns,
  songs,
  aiPrompt,
};
