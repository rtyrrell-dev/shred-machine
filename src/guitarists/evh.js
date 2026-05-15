/**
 * Eddie Van Halen — Van Halen (1978–1984 era)
 *
 * Dual-purpose profile:
 *   1. `aiPrompt`  — injected into Claude prompts for AI tab generation
 *   2. All other exports — raw data consumed by hardcoded generator functions
 */

// ─── Identity ─────────────────────────────────────────────────────────────────

export const id   = 'evh';
export const name = 'Eddie Van Halen';
export const band = 'Van Halen';
export const era  = '1978–1984';
export const color = '#ff9933';

// ─── Tuning ───────────────────────────────────────────────────────────────────

/**
 * EVH recorded most of the classic era in Eb (half-step down), but gigged in
 * E standard and many iconic riffs are taught/tabbed in standard.  The
 * generator uses E standard MIDI open-string values; pitch-correct if needed.
 *
 * MIDI open strings, index 0 = low E, 5 = high e:
 *   E2=40  A2=45  D3=50  G3=55  B3=59  e4=64
 */
export const open       = [40, 45, 50, 55, 59, 64]; // E standard
export const tuningName = 'E standard (recorded Eb; tabbed at E)';
export const strings    = ['e', 'B', 'G', 'D', 'A', 'E']; // high→low display

// ─── Tempo ranges ─────────────────────────────────────────────────────────────

export const bpmLead   = [110, 192]; // Eruption-level ceiling; slower blues allowed
export const bpmRhythm = [85,  152];

// ─── Scale / mode palette ─────────────────────────────────────────────────────

/**
 * Intervals in semitones from the root.
 *
 * EVH's primary harmonic vocabulary in rough order of preference:
 *  1. Minor pentatonic / blues  — all lead playing
 *  2. Mixolydian (major + b7)   — "Panama", "Runnin' With the Devil", "Hot for Teacher"
 *  3. Natural minor / Aeolian   — slower melodic passages
 *  4. "EVH octatonic" symmetrical — moveable 3-note-per-string shapes, creates
 *     intentional harmonic dissonance; used in "I'm the One", "On Fire"
 *  5. Dorian                    — "Ain't Talkin' 'Bout Love", "Hot for Teacher" backdrop
 *  6. Harmonic minor            — "Eruption" modal-interchange section
 */
export const scales = {
  pentatonicMinor:  [0, 3, 5, 7, 10],
  blues:            [0, 3, 5, 6, 7, 10],
  mixolydian:       [0, 2, 4, 5, 7, 9, 10],
  aeolian:          [0, 2, 3, 5, 7, 8, 10],
  dorian:           [0, 2, 3, 5, 7, 9, 10],
  harmonicMinor:    [0, 2, 3, 5, 7, 8, 11],
  /**
   * The "EVH Scale" — symmetrical octatonic (H-W alternating, H=half W=whole).
   * Three-notes-per-string shapes repeat identically on every string, creating
   * the characteristic cascading-arpeggio runs heard in "I'm the One" and "On Fire".
   */
  evhOctatonic:     [0, 1, 3, 4, 6, 7, 9, 10],
};

// ─── Two-handed tapping ───────────────────────────────────────────────────────

/**
 * Core unit: [tapFret, pullFret, hammerFret]
 *
 * All three are absolute fret numbers (not intervals).  The tap is performed
 * by the picking-hand finger; pull-off and hammer-on by the fretting hand.
 * Patterns are played as triplets or 16th-note groups (3 notes per beat sub).
 *
 * Sources:
 *  - Eruption: tap 12, pull 5, hammer 8  (on B and high-e strings)
 *  - Hot for Teacher intro: tap 12, pull 4/7
 *  - General moveable shapes at 12th fret tap, various pull/hammer combos
 */
export const tapPatterns = [
  // [tap, pull, hammer]  — classic Eruption-era shapes
  [12,  5,  8],   // E minor pentatonic on B or e string (Eruption core)
  [12,  5,  7],   // E minor pentatonic on G, D, A strings
  [12,  5,  9],   // Dorian color (adds major 6th)
  [12,  4,  7],   // Hot for Teacher opening riff feel
  [12,  4,  8],   // Augmented-flavor tap
  [15,  5,  8],   // Shifted up: tap on 15th, same pull/hammer
  [15,  7,  10],  // Position 7 fretting + 15th tap
  [17,  5,  8],   // High tap for dramatic range
  [17,  7,  10],
  [17,  9,  12],  // High-register: both hands above 9th fret
  [9,   2,  5],   // Lower-register Eruption feel (9-2-5 on B string)
  [9,   2,  6],   // With major 3rd hammer (creates E major arp feel)
  [14,  7,  10],  // Mid-neck tap
  [14,  5,  9],
];

/**
 * Preferred strings for tapping (index 0=low E, 5=high e).
 * EVH most often tapped on B (4) and G (3) strings; occasionally D (2).
 * Multi-string runs swept from e down to A.
 */
export const tapStrings = [4, 3, 4, 5, 3, 4]; // weighted toward B and G

/**
 * Rhythmic grouping options for tapping measures.
 * Number = 16th-note columns per full tap unit (tap→pull→hammer = 1 unit).
 * 6 = triplet feel (6 sixteenth-note columns = dotted quarter per group)
 * 4 = straight 16ths
 * 8 = slower, spacing for whammy / harmonic flourishes
 */
export const tapGroupSizes = [6, 6, 4, 8, 6]; // 6 dominates (triplet feel)

// ─── Natural harmonics ────────────────────────────────────────────────────────

/**
 * Fret positions producing natural harmonics.
 * EVH used 5th, 7th, and 12th fret harmonics extensively (dive-bomb squeal,
 * chime intros).  "Mean Street" opening is all tapped harmonics at 12th fret.
 */
export const harmonicFrets = [5, 7, 12];

// ─── Lead fret-position windows ──────────────────────────────────────────────

/**
 * Four-fret boxes EVH most commonly soloed from.
 * Listed in rough frequency order; generator should pick randomly weighted.
 */
export const leadPositions = [5, 7, 9, 12, 3, 15];

// ─── Rhythm: chord progressions ──────────────────────────────────────────────

/**
 * Characteristic harmonic moves, expressed as semitone offsets from the root
 * (which maps to a fret on the A or low-E string).
 *
 * EVH favours Mixolydian bVII→I and bVI→bVII→I.  He rarely resolves to V.
 * Values are added to the root fret; clamp to [0, 22].
 *
 * Format: array of 4 entries, one per measure.  Each entry is [a-string-offset,
 * or 'E' meaning use low-E root instead].
 */
export const rhythmProgressions = {
  /**
   * I – bVII – bVII – I  (Mixolydian)
   * "Runnin' With the Devil" / "Panama" feel.
   * Roots: e.g. E→D→D→E  or  A→G→G→A
   */
  mixolydianPower: [
    [0, -2, -2,  0],  // I  bVII bVII  I
    [0, -2,  0, -4],  // I  bVII  I  bVI
    [0,  5,  7,  5],  // I  IV  V  IV  (borrowed)
    [0, -2, -4, -2],  // I  bVII  bVI  bVII
  ],

  /**
   * Pedal + triad inversions on upper strings, low-E open pedal.
   * "Unchained" / "Panama" mid section.
   * Triad shapes on G-B-e over droning low string.
   * Each entry is [G-string fret, B-string fret, e-string fret].
   */
  triadPedal: [
    [9, 9,  10],   // G  B  e  → D major inversion
    [7, 8,  7],    // C  major
    [9, 10, 9],    // D  major inversion
    [5, 5,  5],    // Am / G triad
    [7, 7,  8],    // Em shape
    [10, 10, 10],  // E major barre
  ],

  /**
   * "Ain't Talkin' 'Bout Love" arpeggiated chord sequence (Am–F–G).
   * Absolute fret numbers for the D–G–B–e arpeggio sweep; played with
   * palm-muted downstrokes.
   */
  aintTalkin: {
    chords: [
      // Am shape: [D-fret, G-fret, B-fret, e-fret]
      [0, 2, 1, 0],  // Am open
      [3, 2, 1, 1],  // F (barre 1st)
      [5, 4, 3, 3],  // G (barre 3rd)
    ],
    bpm: 136,
  },

  /**
   * Unchained / Eruption chug feel: single low string power-chord chugging
   * with accent movement up the neck on beats 3 and "and-of-4".
   * Offsets from root fret on low-E string.
   */
  chugAccents: [5, 7, 3, 10, 5, 8, 0, 7],
};

// ─── Rhythm: strumming / picking patterns ─────────────────────────────────────

/**
 * Preferred rhythmic attack patterns within a 16-column measure.
 * Column indices (0–15) where chord strikes occur.
 *
 * EVH characteristics:
 *  - Syncopated upbeat accents (hits on "and" of 2 or 4)
 *  - Gallop (8th + 16th + 16th) for boogie/I'm-the-One feel
 *  - Heavy beat-3 accent (unusual emphasis)
 *  - Occasional straight 8ths for grinding chug
 */
export const rhythmPatterns = [
  [0, 4, 8, 12],           // straight quarters
  [0, 4, 6, 8, 12, 14],    // gallop feel
  [0, 2, 4, 8, 10, 12],    // syncopated
  [0, 6, 8, 14],            // upbeat anticipation
  [0, 4, 8, 10, 14],        // beat-3 accent
  [0, 2, 8, 10, 12],        // "Unchained" chug
  [0, 4, 6, 10, 12],        // Panama/Runnin mixed
  [0, 2, 4, 6, 8, 10, 12, 14], // straight 8ths
];

// ─── Song reference library ───────────────────────────────────────────────────

/**
 * Key musical facts about landmark EVH songs.
 * Used to label generated exercises and guide style selection.
 */
export const songs = {
  eruption: {
    album: 'Van Halen (1978)',
    key: 'E minor',
    bpm: 102,
    tuning: 'Eb (half-step down)',
    techniques: ['tapping', 'whammy-dive', 'natural-harmonics', 'tremolo-picking'],
    notes: [
      'Tapping section on B string: tap 12, pull 5, hammer 8',
      'Opens with E minor pentatonic intro before tapping section',
      'Closes with whammy bar dive bomb on harmonic',
      'Modal interchange: moves through harmonic minor in middle section',
      'Full track is ~1:42 — the original shred showcase',
    ],
  },
  ainttalkingboutlove: {
    album: 'Van Halen (1978)',
    key: 'A minor',
    bpm: 136,
    tuning: 'Eb',
    techniques: ['arpeggio', 'palm-mute', 'dorian'],
    notes: [
      'Am–F–G chord pattern in Dorian mode',
      'Arpeggiated with pick and palm muting — no strumming',
      'Frets: open Am (x02210), F (133211), G (355433)',
      'Iconic delay-drenched lead break mid-song',
    ],
  },
  runninwiththedevil: {
    album: 'Van Halen (1978)',
    key: 'A',
    bpm: 95,
    tuning: 'Eb',
    techniques: ['power-chords', 'mixolydian', 'syncopation'],
    notes: [
      'Intro: muted strings raked between bridge and tailpiece for car-horn effect',
      'Main riff: bVII–I Mixolydian (G–A power chord move on A string)',
      'A5 to G5 (fret 7→5 on A string) is the signature move',
      'Rhythm stays on 8th-note pulse with syncopated accents',
    ],
  },
  unchained: {
    album: 'Fair Warning (1981)',
    key: 'E',
    bpm: 134,
    tuning: 'Drop C# (half-step down + Drop D structure)',
    techniques: ['flanger', 'power-chords', 'chromatic'],
    notes: [
      'Drop tuning; root 0 on low string = C# in recording',
      'Main riff: 0-0-0 chug on low string → fret 3 → back → fret 10 barre',
      'MXR M-117 Flanger on main riff',
      'Second half of riff moves up neck to 10th fret C major triad',
      'Power chords use chromatic passing (half-step approach notes)',
    ],
  },
  panama: {
    album: '1984 (1984)',
    key: 'Eb',
    bpm: 144,
    tuning: 'Eb',
    techniques: ['power-chords', 'mixolydian', 'syncopation', 'triad-pedal'],
    notes: [
      'Signature riff: E5→D5 (I→bVII Mixolydian), on A string frets 7→5',
      'Interleaved with open low-E pedal between each chord',
      'Solo uses triad inversions on G–B–e over drone',
      'Fast alternate-picked pentatonic descents in solo',
    ],
  },
  hotforteacher: {
    album: '1984 (1984)',
    key: 'D',
    bpm: 228,
    tuning: 'Eb',
    techniques: ['tapping', 'dorian', 'mixolydian', 'alternate-picking'],
    notes: [
      'Intro arpeggio tapping riff: tap 12 on each string, pull 4, hammer 7',
      'Riff cycles through strings sweeping downward',
      'Rhythm: Dorian/Mixolydian blend over fast boogie-rock pulse',
      'Solo: fast Dorian alternate-picked runs + tapped harmonics',
    ],
  },
  meanstreet: {
    album: 'Fair Warning (1981)',
    key: 'F# minor',
    bpm: 138,
    tuning: 'Eb',
    techniques: ['tapped-harmonics', 'paradiddle', 'pick-scrape'],
    notes: [
      'Entire fade-in intro is tapped harmonics — no regular notes',
      'Harmonic at 12th fret produced by tapping with thumb/pick',
      'Rhythm is a guitar paradiddle (RLRR LRLL pattern)',
      'Body of song features dark Aeolian single-note riff on A string',
    ],
  },
  jumpSolo: {
    album: '1984 (1984)',
    key: 'C major',
    bpm: 131,
    tuning: 'Eb',
    techniques: ['tapping', 'legato', 'arpeggios', 'whammy'],
    notes: [
      'Solo uses 4-note-per-string tapping patterns',
      'Opens with open-string octave melody riff',
      'Combines legato hammer-on cascades with whammy swells',
      'Major/Mixolydian tonality throughout — one of his brightest solos',
    ],
  },
  imtheone: {
    album: 'Van Halen (1978)',
    key: 'E',
    bpm: 194, // boogie section
    tuning: 'E standard',
    techniques: ['boogie-gallop', 'blues', 'hybrid-picking', 'speed'],
    notes: [
      'Unrelenting blues-boogie gallop at ~194 BPM in the fast section',
      'Recorded without overdubs — live feel',
      'Right-hand rhythmic swing is as important as the notes',
      'Final chord: E9 voicing (E–G#–B–D–F#)',
      'Boundary between rhythm and lead completely dissolved',
    ],
  },
};

// ─── AI prompt string ─────────────────────────────────────────────────────────

/**
 * Injected into Claude prompts verbatim.  Written to give the model maximal
 * context about technique, theory, feel, and concrete fret-level specifics so
 * generated tabs are authentic rather than generic.
 */
export const aiPrompt = `GUITARIST: Eddie Van Halen (Van Halen, 1978–1984 classic era)
TUNING: E standard (recorded Eb half-step down; tab in E standard)
STRING INDEX: 0=E(low) 1=A 2=D 3=G 4=B 5=e(high)

━━ LEAD / SOLO STYLE ━━
PRIMARY TECHNIQUE — Two-handed tapping (invented the modern approach):
  • Three-note-per-string units: picking-hand TAPS a high fret → fret-hand PULL-OFF → fret-hand HAMMER-ON
  • Most common tap fret: 12th. Pull destinations: 5, 7, 4. Hammer destinations: 8, 7, 9, 10.
  • Eruption core: tap 12, pull 5, hammer 8 — on B string (str4), repeated as triplets
  • Hot for Teacher intro: tap 12, pull 4, hammer 7 — swept string-by-string downward
  • Mean Street: all TAPPED HARMONICS at 12th fret (thumb/pick taps node; sounds harmonic)
  • Group sizes: prefer triplet groupings (6 sixteenth-note columns per unit)

SCALE / HARMONY CHOICES:
  • Primary: minor pentatonic [0,3,5,7,10] and blues scale [0,3,5,6,7,10]
  • Mixolydian [0,2,4,5,7,9,10] for major-feel riff-based soloing
  • Dorian [0,2,3,5,7,9,10] for "Ain't Talkin' 'Bout Love" and HFT blues feel
  • EVH Octatonic (symmetrical) [0,1,3,4,6,7,9,10] — same 3-note shape on every string
  • Harmonic minor [0,2,3,5,7,8,11] — Eruption modal-interchange section only
  • Favorite lead positions: 5th, 7th, 9th, 12th fret boxes

LEGATO & PHRASING:
  • Long cascading hammer-on / pull-off runs without re-picking
  • Alternates between slow blues-feel bends (1–2 note phrases with vibrato) and lightning-fast 16th bursts
  • Vibrato: wide, expressive — a "feeling not an effect"; applied at phrase endings
  • Natural harmonics at frets 5, 7, 12 used as chime accents and dive-bomb targets

WHAMMY BAR:
  • Dive bombs on harmonics (push bar past pitch, release back)
  • Flutter: rapid tapping of bar up/down for tremolo intensity
  • Subtle pitch shading on sustaining notes — not always extreme

━━ RHYTHM / RIFF STYLE ━━
HARMONIC LANGUAGE — Mixolydian rock (avoids traditional V chord):
  • Signature move: bVII → I  (e.g. D5 → E5, G5 → A5 on A string)
  • Also uses bVI → bVII → I progressions
  • Triad inversions on G–B–e strings over open low-E pedal tone ("Panama" mid section)
  • Palm-muted single-note lines on A or low-E string between chord hits

SYNCOPATION & FEEL:
  • Hits on upbeats and "and-of" subdivisions — avoids mechanical downbeat-only rhythm
  • Gallop pattern (8th + 16th + 16th) for high-energy boogie sections ("I'm the One")
  • Heavy beat-3 accent is characteristic
  • 3+3+2 subdivision within measures creates rhythmic push-pull "magic pocket"
  • Strategic silence / micro-pauses prevent repetition from feeling robotic

RIFF EXAMPLES (fret numbers on string indices):
  • Runnin' With the Devil: A-string power chord A5(7) → G5(5) → A5(7), 8th-note chug, bVII→I
  • Unchained: low-string 0-0-0 palm chug → fret-3 dyad → back → fret-10 barre; chromatic passing
  • Ain't Talkin' 'Bout Love: Am(x02210) → F(133211) → G(355433) arpeggiated, palm muted
  • Hot for Teacher rhythm: fast driving 8ths on A string, D5 power chord stabs on beats 2 & 4

━━ FEEL & PHILOSOPHY ━━
"Every note serves the phrase." Technique exists to express melody and feel, not to show off.
Aggressive, forward-leaning attack but always melodic — you can sing every lick.
The rhythm and lead guitar voices are never rigidly separated; they blur into each other.
Inject human imperfection: vary rhythmic placement slightly, let phrases breathe, use dynamics.`;

// ─── Convenience re-export for generator functions ────────────────────────────

export default {
  id,
  name,
  band,
  era,
  color,
  open,
  tuningName,
  strings,
  bpmLead,
  bpmRhythm,
  scales,
  tapPatterns,
  tapStrings,
  tapGroupSizes,
  harmonicFrets,
  leadPositions,
  rhythmProgressions,
  rhythmPatterns,
  songs,
  aiPrompt,
};
