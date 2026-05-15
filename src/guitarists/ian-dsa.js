/**
 * Ian D'Sa — Billy Talent (2003–present)
 *
 * Dual-purpose profile:
 *   1. `aiPrompt`  — injected into Claude prompts for AI tab generation
 *   2. All other exports — raw data consumed by hardcoded generator functions
 *
 * NOTE ON TUNING: D'Sa has "essentially made a career" in Drop D.  Almost
 * the entire catalog lives in Drop D (D A D G B e), making it his defining
 * tonal framework rather than a technique choice.  The generator uses Drop D
 * MIDI open strings throughout.
 */

// ─── Identity ─────────────────────────────────────────────────────────────────

export const id    = 'ian';
export const name  = "Ian D'Sa";
export const band  = 'Billy Talent';
export const era   = '2003–present';
export const color = '#44ff88';

// ─── Tuning ───────────────────────────────────────────────────────────────────

/**
 * Drop D: low string dropped one whole step from E to D.
 * This single change defines D'Sa's entire compositional approach:
 *  - Low D string (str0) becomes a bass pedal / anchor at fret 0
 *  - One-finger barre across the 3 lowest strings = instant power chord
 *  - The 4th string (str2, D) and low string (str0) share the same pitch class,
 *    enabling the characteristic "D-string bounce" riff formula
 *  - Majority of Billy Talent songs are rooted on D
 *
 * MIDI open strings, index 0 = low string, 5 = high e:
 *   Drop D: D2=38  A2=45  D3=50  G3=55  B3=59  e4=64
 *
 * A small number of tracks use E standard or Eb standard (e.g. "Worker Bees"),
 * but Drop D is the canonical Ian D'Sa tuning.
 */
export const open       = [38, 45, 50, 55, 59, 64]; // Drop D
export const tuningName = 'Drop D (D A D G B e)';
export const strings    = ['e', 'B', 'G', 'D', 'A', 'D']; // high→low display

// ─── Tempo ranges ─────────────────────────────────────────────────────────────

export const bpmLead   = [128, 190]; // "Red Flag" ceiling; "Fallen Leaves" melodic floor
export const bpmRhythm = [98,  165];

// ─── Scale / mode palette ─────────────────────────────────────────────────────

/**
 * Intervals in semitones from the root.
 *
 * D'Sa's harmonic vocabulary is deliberately simple — the power comes from
 * rhythmic feel and melodic clarity, not harmonic complexity.
 *
 *  1. Aeolian / natural minor — primary; the entire catalog leans heavily minor
 *  2. Minor pentatonic        — subset of Aeolian used for most lead phrases
 *  3. Blues scale             — occasional b5 passing color on fast runs
 *  4. Dorian                  — rare brighter-minor moments in later albums
 *
 * Influences confirm this: Soundgarden, Alice In Chains, Rage Against the
 * Machine, Iron Maiden — all deeply Aeolian/minor pentatonic players.
 */
export const scales = {
  aeolian:         [0, 2, 3, 5, 7, 8, 10],
  pentatonicMinor: [0, 3, 5, 7, 10],
  blues:           [0, 3, 5, 6, 7, 10],
  dorian:          [0, 2, 3, 5, 7, 9, 10],
};

// ─── Lead fret-position windows ──────────────────────────────────────────────

/**
 * D'Sa solos from mid-neck positions on the upper strings.
 * He rarely range-hunts across the whole neck; phrases are compact and vocal.
 * The D string (str2) is his most-used lead string at any position.
 */
export const leadPositions = [5, 7, 9, 12, 3];

// ─── The D-string riff formula ────────────────────────────────────────────────

/**
 * Ian D'Sa's single most distinctive compositional device.
 *
 * The formula: use the open low-D string (str0, fret 0) as a bass pedal/anchor,
 * alternating with fretted notes on the middle D string (str2) to carry the melody.
 * Both strings share the same pitch class (D), so the open bass note reinforces
 * the melody regardless of which fret is being played above.
 *
 * Visual pattern (str0 = bottom, str2 = melody):
 *   str0: 0  -  0  -  0  -  0  -   (open D, consistent pedal)
 *   str2: -  8  -  7  -  5  -  3   (melody moving above)
 *
 * Sequences below are INTERVAL arrays (semitones above root) used to derive
 * frets on str2 via gf(root+iv, 2, open).  Root is selected from the pool in
 * the generator; intervals that produce out-of-range frets are silently skipped.
 *
 * The melodic intervals follow D natural minor (Aeolian): 0 2 3 5 7 8 10 12
 */
export const dStringMelodies = {
  /**
   * Ascending + descending minor runs — "Try Honesty" / "Fallen Leaves" feel.
   * Each array covers 2 measures (16 notes × 2 cols each = 32 cols).
   */
  ascDesc: [
    [0, 2, 3, 5, 7, 5, 3, 2,  0, 3, 5, 7, 8, 7, 5, 3],
    [0, 3, 5, 7, 5, 3, 0, 2,  3, 5, 8, 7, 5, 3, 2, 0],
    [5, 7, 8, 7, 5, 3, 2, 0,  3, 5, 7, 5, 3, 2, 0, 3],
    [0, 2, 3, 2, 0, 3, 5, 3,  0, 2, 7, 5, 3, 2, 0, 3],
  ],

  /**
   * Descending runs — "River Below" feel.
   * Starts from a high note and cascades down; open-D pedal interspersed
   * every 4 notes (see `river_below` generator pattern).
   */
  descending: [
    [12, 10, 8, 7, 5, 3, 2, 0],
    [7,  5,  3, 2, 0, 2, 3, 5],
    [8,  7,  5, 3, 2, 0, 3, 5],
    [10, 8,  7, 5, 3, 2, 0, 3],
  ],

  /**
   * D-string bounce — "Devil in a Midnight Mass" feel.
   * Even indices = open D (str2 fret 0), odd indices = melodic fret on str2.
   * (Or implemented as str0 pedal + str2 melody in alternating events.)
   * Fret values here are ABSOLUTE on str2 when root = D (MIDI 38 / open[0]).
   * Generator uses interval form; these are provided as reference for root=D.
   *
   * Reference fret → note mapping (str2 in Drop D, root = D2):
   *   fret 0=D  2=E  3=F  5=G  7=A  8=Bb  10=C  12=D(oct)
   */
  bounce: [
    [0, 8, 0, 7, 0, 8, 0, 5],   // D–Bb–D–A–D–Bb–D–G  (sinister, "Midnight Mass")
    [0, 7, 0, 5, 0, 3, 0, 2],   // D–A–D–G–D–F–D–E     (descending)
    [0, 10, 0, 7, 0, 5, 0, 7],  // D–C–D–A–D–G–D–A     (wider interval bounce)
    [0, 5, 0, 7, 0, 8, 7, 5],   // D–G–D–A–D–Bb–A–G    (ascending then fall)
    [0, 7, 0, 8, 0, 5, 0, 3],   // D–A–D–Bb–D–G–D–F
    [0, 12, 0, 10, 0, 7, 0, 5], // D–D(oct)–D–C–D–A–D–G (octave drop drama)
  ],
};

// ─── Drop D power chord positions ────────────────────────────────────────────

/**
 * In Drop D, a one-finger barre across the 3 lowest strings (str0, str1, str2)
 * at any fret produces a root-5th-octave power chord.  This is D'Sa's primary
 * harmonic tool — he can shift entire chord progressions with a single finger.
 *
 * Fret → chord name → MIDI root:
 *   0  = D5   (MIDI 38)
 *   3  = F5   (MIDI 41)
 *   5  = G5   (MIDI 43)
 *   7  = A5   (MIDI 45)
 *   8  = Bb5  (MIDI 46)
 *   10 = C5   (MIDI 48)
 *   12 = D5   (MIDI 50, octave)
 *
 * The generator's pwrE(fret, open, dd=true) function creates these automatically.
 */
export const dropDChordFrets = [0, 3, 5, 7, 8, 10];

/**
 * Characteristic D minor Aeolian power-chord sequences in Drop D.
 * Each inner array is 4 fret positions (one per measure, or 2 per measure split).
 * Apply with pwrE on str0 at each fret.
 */
export const dropDProgressions = [
  [0, 10,  8, 10],   // D5 C5 Bb5 C5 — i bVII bVI bVII  (most common Ratt/BT move)
  [0,  8, 10,  0],   // D5 Bb5 C5 D5 — i bVI bVII i
  [0,  5,  7,  5],   // D5 G5 A5 G5  — i iv v iv
  [0,  3,  5,  3],   // D5 F5 G5 F5  — i bIII iv bIII
  [0,  7,  5,  0],   // D5 A5 G5 D5  — i v iv i  (descending)
  [0, 10,  7,  5],   // D5 C5 A5 G5  — longer Aeolian descent
  [0,  3, 10,  8],   // D5 F5 C5 Bb5 — dark chromatic flavor
  [0,  5,  3,  0],   // D5 G5 F5 D5  — short cadence
];

// ─── Rhythm: riff types ───────────────────────────────────────────────────────

/**
 * D'Sa's rhythm riffs fall into four distinct types used across the catalog.
 * Documented here for generator labeling and type-selection logic.
 */
export const riffTypes = {
  /**
   * D-string bounce riff ("Devil in a Midnight Mass", "The River Below").
   * Low D open (str0) alternates with melody on str2 in 8th-note pulse.
   * Creates the characteristic Billy Talent "sinister bounce" sound.
   */
  dStringBounce: {
    primaryString: 0,   // str0 = low D pedal
    melodyString:  2,   // str2 = D-string melody
    spacing: 2,         // 2 16th-note columns per note = 8th-note feel
    pedalFret: 0,       // always open D
  },

  /**
   * Power-chord + single-note call-and-response ("Try Honesty", "Fallen Leaves").
   * Alternates: power chord hit → single melodic note → power chord → melody.
   * The single notes double the vocal melody or answer the chord stab.
   */
  chordMelodyAlt: {
    chordString: 0,   // power chord on low 3 strings
    melodyString: 2,  // answering melody on D string
    spacing: 2,       // 8th-note alternation
  },

  /**
   * Gallop rhythm ("Red Flag", "Worker Bees").
   * 8th note + 16th + 16th pattern: in a 16-col measure, hits at [0,4,6] per beat.
   * Full measure: [0,4,6, 8,12,14] — creates forward momentum / urgency.
   */
  gallop: {
    colPattern: [0, 4, 6, 8, 12, 14],  // 16th-col positions in a 16-col measure
    chordString: 0,
  },

  /**
   * March / stomp ("Viking Death March", "Try Honesty" chorus).
   * Heavy downbeat power chords with 8th-note inner pulse.
   * Locked to kick drum; feels like boots on pavement.
   * Hits at every 8th note: [0,2,4,6,8,10,12,14] with accented beats 1+3.
   */
  march: {
    colPattern: [0, 2, 4, 6, 8, 10, 12, 14], // every 8th
    accentCols:  [0, 8],                        // beat 1 and 3 = full power chord
    innerCols:   [2, 4, 6, 10, 12, 14],         // off-beats = muted/palm-muted stabs
  },
};

// ─── Rhythm: strumming / picking patterns ─────────────────────────────────────

/**
 * Column-offset attack patterns within a 16-column measure.
 *
 * D'Sa characteristics:
 *  - Gallop is the signature high-energy pattern: [0,4,6,8,12,14]
 *  - March drives heavy passages: even 8ths with accented downbeats
 *  - Syncopated anticipation on beat 4-and (col 14) is common
 *  - Rarely uses straight quarters alone — always some subdivision energy
 */
export const rhythmPatterns = [
  [0, 4, 6, 8, 12, 14],          // gallop — signature "Red Flag" feel
  [0, 2, 4, 6, 8, 10, 12, 14],   // straight 8ths / march chug
  [0, 4, 8, 12],                  // straight quarters (breakdown / intro)
  [0, 2, 4, 8, 10, 12],           // syncopated — skip beats
  [0, 6, 8, 14],                  // wide-space stabs — sparse anthem feel
  [0, 4, 6, 12, 14],              // condensed gallop
  [0, 2, 8, 10, 12, 14],          // front-loaded then back-loaded
  [0, 4, 8, 10, 14],              // anticipating beat 4
];

// ─── Open-string drone textures ──────────────────────────────────────────────

/**
 * D'Sa frequently uses the open D strings (str0 fret 0 AND str2 fret 0) as
 * drone anchors beneath fretted upper-string melody.  This is distinct from
 * the D-string bounce riff — here the drone is sustained while a melodic line
 * plays on B (str4) or e (str5), creating an open, ringing texture.
 *
 * String combinations used for drone + melody:
 *  [droneStr, droneFret, melodyStr]
 */
export const droneTextures = [
  [0, 0, 4],  // low D open + melody on B string  — wide-interval shimmer
  [0, 0, 5],  // low D open + melody on e string   — highest, brightest
  [2, 0, 4],  // D-string open + melody on B string
  [2, 0, 5],  // D-string open + melody on e string
];

// ─── Vocal melody doubling ────────────────────────────────────────────────────

/**
 * D'Sa's lead playing frequently doubles or anticipates Ben Kowalewicz's vocal
 * melody.  This creates the "guitar as second voice" texture.
 *
 * Structural pattern (expressed as 16th-col plan for a 2-measure phrase):
 *  - Lead note hits 1–2 cols BEFORE or exactly ON the vocal syllable
 *  - Sustain with vibrato through the note duration
 *  - Next melodic step lands on the next syllable change
 *  - No note runs unless the vocal does a melisma
 *
 * In generator terms: use 8th-note (col spacing 4) or dotted-8th (col spacing 6)
 * for most notes, not 16th-note density.  Restraint = authenticity.
 */
export const vocalDoubling = {
  noteSpacing: [4, 4, 6, 4, 6, 4, 4, 8],  // 16th-col gaps between melodic notes
  vibratoOnLongNotes: true,                 // any note lasting ≥ 6 cols gets '~' decoration
};

// ─── Song reference library ───────────────────────────────────────────────────

export const songs = {
  tryHonesty: {
    album: 'Billy Talent (2003)',
    key: 'D minor',
    bpm: 165,
    tuning: 'Drop D',
    techniques: ['d-string-bounce', 'power-chords', 'vocal-doubling', 'alternate-picking'],
    notes: [
      'Opening riff: D-string (str2) melodic line alternating with low-D open pedal (str0)',
      'Drop D allows fast one-finger chord shifts between D5(0), Bb5(8), A5(7), G5(5)',
      'Chorus: power chord hits on downbeats, single-note melody on off-beats answering',
      'Lead break doubles the vocal hook — stays in D natural minor / pentatonic box',
      "D'Sa wrote the riff first; Ben built the vocal melody around it",
    ],
  },
  devilInAMidnightMass: {
    album: 'Billy Talent II (2006)',
    key: 'D minor',
    bpm: 155,
    tuning: 'Drop D',
    techniques: ['d-string-bounce', 'sinister-minor', 'open-pedal'],
    notes: [
      '"Sinister-sounding riff" D\'Sa played in rehearsal that sparked the entire song concept',
      'Core riff: low-D open (str0 fret 0) alternating with fretted str2 notes [0,8,0,7,0,8,0,5]',
      'Fret sequence on str2: open-D(0)–Bb(8)–open-D–A(7)–open-D–Bb–open-D–G(5)',
      'A-string (str1) adds harmony notes on select beats at frets 5 and 7',
      'The Bb (fret 8 on D-string) is the "sinister" note — flat-6 of D Aeolian',
    ],
  },
  fallenLeaves: {
    album: 'Billy Talent II (2006)',
    key: 'C minor',
    bpm: 153,
    tuning: 'Drop D',
    techniques: ['aeolian', 'melodic-lead', 'chord-melody-alt', 'vocal-doubling'],
    notes: [
      'Built on i–iv–v all-minor chord movement: Cm–Fm–Gm',
      'Intro lead line runs Aeolian minor descending on upper strings (str3–5)',
      'Lead melody doubles vocal phrasing with 8th-note spacing and vibrato on held notes',
      'Most melodic / restrained song in catalog — show for D\'Sa\'s singable lead style',
      'Higher chord-complexity than average Billy Talent track (bass melody integration)',
    ],
  },
  redFlag: {
    album: 'Billy Talent II (2006)',
    key: 'A minor (relative to Drop D root)',
    bpm: 185,
    tuning: 'Drop D',
    techniques: ['gallop', 'power-chords', 'fast-alternate-picking', 'aeolian'],
    notes: [
      'Signature gallop pattern: 8th+16th+16th = col offsets [0,4,6,8,12,14] per measure',
      'Fast power-chord sequence in Drop D; root chord, bIII, bII cycle at high tempo',
      'One of the fastest songs in the catalog — tests right-hand gallop endurance',
      'Barely any lead playing; the rhythm IS the statement',
    ],
  },
  vikingDeathMarch: {
    album: 'Dead Silence (2012)',
    key: 'D minor',
    bpm: 148,
    tuning: 'Drop D',
    techniques: ['march', 'power-chords', 'heavy-downbeat'],
    notes: [
      'March-time 4/4 feel — every downbeat is a boot on pavement',
      'Drop D power chord sequence shifts between D5(0), A5(7), G5(5), Bb5(8)',
      'Riff formula: str0 power chord hits every beat; melody notes fill off-beats on str2',
      'Lower tempo than Red Flag but heavier feel due to march groove locking with snare',
      'Available on Rocksmith DLC — well-tabbed reference for the riff anatomy',
    ],
  },
  riverBelow: {
    album: 'Billy Talent III (2009)',
    key: 'D minor',
    bpm: 152,
    tuning: 'Drop D',
    techniques: ['d-string-melody', 'open-drone', 'vocal-doubling', 'descending-runs'],
    notes: [
      'D\'Sa\'s guitar is described as "the highlight throughout" and "sounds like two players"',
      'Primary lead voice: descending D-string (str2) runs from fret 12 down to open [12,10,8,7,5,3,2,0]',
      'Open low-D (str0) interspersed as drone every 4 melodic notes',
      'Creates open, ringing texture where bass note and melody note share pitch class',
      'Restrained, vocal phrasing — no shredding, just one phrase stated clearly and repeated',
    ],
  },
  thisIsHowItGoes: {
    album: 'Billy Talent (2003)',
    key: 'D minor',
    bpm: 138,
    tuning: 'Drop D',
    techniques: ['5-note-riff', 'chord-melody-alt', 'call-response'],
    notes: [
      'Intro/verse: 5-note repeating riff on D string with minimal movement',
      'Chorus: melodic line on top three strings (str3–5) combined with power chord hits on bottom three',
      'Dynamic contrast is the structural tool — sparse verse, dense chorus',
      'One of the clearest examples of call-and-response between single notes and chords',
    ],
  },
  standingInTheRain: {
    album: 'Billy Talent (2003)',
    key: 'B minor',
    bpm: 120,
    tuning: 'E standard',
    techniques: ['standard-tuning', 'melodic-lead', 'aeolian'],
    notes: [
      'One of the few songs NOT in Drop D — E standard tuning',
      'Chord progression: Bm–Em–F#–G–D–C–F#/Bb',
      'Solo progression: Bm–Em–D–G repeated twice — very vocal, sustained',
      'Shows D\'Sa can write compelling melodic material in standard tuning',
      'More classic-rock feel than typical Billy Talent — Thin Lizzy / Led Zeppelin influence audible',
    ],
  },
  surrender: {
    album: 'Billy Talent II (2006)',
    key: 'D minor',
    bpm: 130,
    tuning: 'Drop D',
    techniques: ['melodic-lead', 'anthemic', 'power-chords'],
    notes: [
      'Mid-tempo anthem — slower BPM showcases D\'Sa\'s sustained melodic phrasing',
      'Lead line is entirely singable and doubles vocal phrasing closely',
      'Power chord movements in Drop D follow standard Aeolian i–bVII–bVI pattern',
    ],
  },
  workerBees: {
    album: 'Billy Talent II (2006)',
    key: 'Eb / C minor',
    bpm: 158,
    tuning: 'Eb standard (half-step down)',
    techniques: ['jazz-voicings', 'complex-chords', 'non-drop-d'],
    notes: [
      'Notable exception: Eb standard tuning, NOT Drop D — shows tonal range',
      'Jazz-influenced chord voicings: Cm(x35543), Eb6(x6554x), Fm(133111), Eb/G(365xxx)',
      'These voicings are what D\'Sa means by "jazz-style chords" in a heavy context',
      'Requires clean tone with minimal break-up to articulate without turning to mud',
      'Demonstrates why D\'Sa prefers clean amp settings — complex voicings need clarity',
    ],
  },
};

// ─── AI prompt string ─────────────────────────────────────────────────────────

/**
 * Injected into Claude prompts verbatim.  Covers technique, theory, feel,
 * and fret-level specifics for authentic Ian D'Sa tab generation.
 */
export const aiPrompt = `GUITARIST: Ian D'Sa (Billy Talent, 2003–present)
TUNING: Drop D — D A D G B e (all strings standard except low E dropped to D)
STRING INDEX: 0=D(low drop) 1=A 2=D 3=G 4=B 5=e(high)

━━ DROP D FUNDAMENTALS ━━
Drop D is not a technique for D'Sa — it IS his guitar language. Everything follows from it:
  • str0 (low D, fret 0) = bass anchor / pedal drone in virtually every riff
  • One-finger barre across str0–str2 = power chord: fret 0=D5, 3=F5, 5=G5, 7=A5, 8=Bb5, 10=C5
  • str2 (D string, fret 0 = D3) shares pitch class with str0 — the "D-string bounce" exploits this
  • Almost all songs are rooted on D; Aeolian D minor is the home key

━━ THE D-STRING RIFF FORMULA (most important device) ━━
Core pattern: alternate the LOW-D OPEN (str0, fret 0) as bass pedal with FRETTED NOTES on the D-STRING (str2):
  str0: 0  —  0  —  0  —  0  —   ← open D, steady pulse
  str2: —  8  —  7  —  8  —  5   ← melody bouncing above (D–Bb–D–A–D–Bb–D–G = "Devil in a Midnight Mass")

Reference frets on str2 for D natural minor: 0=D  2=E  3=F  5=G  7=A  8=Bb  10=C  12=D(oct)
The Bb (fret 8) is his "sinister" note — flat-6 of Aeolian, most characteristic color in the catalog.

━━ RHYTHM RIFF TYPES ━━
1. D-STRING BOUNCE — str0 pedal alternating with str2 melody, 8th-note spacing
   Sequences: [0,8,0,7,0,8,0,5] / [0,7,0,5,0,3,0,2] / [0,10,0,7,0,5,0,7]
   ("Midnight Mass", "River Below", "Try Honesty" verse)

2. CHORD + MELODY CALL-AND-RESPONSE — power chord hit → single melodic note → repeat
   Even columns: pwrE(fret) on str0–str2 | Odd columns: single note on str2
   ("Try Honesty" chorus, "This Is How It Goes")

3. GALLOP — 8th+16th+16th pattern — col offsets [0,4,6,8,12,14] in a 16-col measure
   One-finger Drop D barre powers all chord hits; no position shifts needed
   ("Red Flag" — fastest, most urgent feel in catalog)

4. MARCH — heavy every-8th chug [0,2,4,6,8,10,12,14], accents on beats 1+3 (cols 0,8)
   Locked to kick drum; feels like boots on pavement
   ("Viking Death March", "Try Honesty" pre-chorus)

━━ LEAD / MELODY STYLE ━━
PHILOSOPHY — Vocal over technical:
  • D'Sa doubles or answers Ben Kowalewicz's vocal melody — the guitar is a second voice
  • "If you hear the opening you know it's a Billy Talent song" — identity over technique
  • Influenced by Led Zeppelin's dynamic phrasing (Jimmy Page) and Thin Lizzy's melodic sensibility
  • Soundgarden/Alice In Chains influence = dark Aeolian tonality, heavy but clean

LEAD DEVICES:
  • D-string descending runs: frets [12,10,8,7,5,3,2,0] on str2 with open-D pedal every 4 notes
  • Alternate-picked Aeolian runs on str2–str5 at position 5, 7, or 12
  • Melodic single-note lines at 8th-note spacing with vibrato on held notes (not constant 16ths)
  • Open-D drone (str0 or str2 open) sustaining beneath upper-string melody (str4 or str5)

SCALE / POSITION:
  • Primary: Aeolian [0,2,3,5,7,8,10] rooted on D — nearly the entire catalog
  • Secondary: minor pentatonic [0,3,5,7,10] for punchier phrases
  • Lead positions: 5th, 7th, 9th, 12th fret boxes on upper strings
  • The b6 (fret 8 on str2, Bb in D minor) appears constantly — his defining color note

━━ FEEL & PHILOSOPHY ━━
"Clean and heavy balance" — D'Sa runs a clean amp with minimal break-up to preserve chord voicings.
He was influenced by Soundgarden's "Outshined" discovering Drop D and never looked back.
Restraint is the point: one clear melodic idea stated cleanly beats ten ideas stated muddily.
The gallop rhythm came from Iron Maiden / classic metal DNA filtered through Canadian punk urgency.
Every lead phrase should be singable. If you can't hum it, it's wrong for this style.`;

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
  leadPositions,
  dStringMelodies,
  dropDChordFrets,
  dropDProgressions,
  riffTypes,
  rhythmPatterns,
  droneTextures,
  vocalDoubling,
  songs,
  aiPrompt,
};
