/**
 * George Lynch — Dokken (1982–1989 era; some Lynch Mob context)
 *
 * Dual-purpose profile:
 *   1. `aiPrompt`  — injected into Claude prompts for AI tab generation
 *   2. All other exports — raw data consumed by hardcoded generator functions
 *
 * Lynch is the most harmonically exotic player in the classic LA metal scene.
 * Where peers reached for minor pentatonic, Lynch reached for Phrygian,
 * harmonic minor, and Phrygian dominant — creating a "dark Middle Eastern /
 * Spanish" flavor that is instantly recognizable and categorically different
 * from EVH, DeMartini, or any of his Sunset Strip contemporaries.
 */

// ─── Identity ─────────────────────────────────────────────────────────────────

export const id    = 'lnch';
export const name  = 'George Lynch';
export const band  = 'Dokken';
export const era   = '1982–1989';
export const color = '#cc44ff';

// ─── Tuning ───────────────────────────────────────────────────────────────────

/**
 * E standard throughout the Dokken catalog.
 * Lynch used no alternate tunings on the classic albums; his exotic sound
 * comes entirely from scale and harmonic choices, not tuning tricks.
 *
 * Notable exception: "In My Dreams" (Under Lock and Key, 1985) was recorded
 * in Eb standard — but this is the outlier, not the rule.
 *
 * MIDI open strings, index 0 = low E, 5 = high e:
 *   E2=40  A2=45  D3=50  G3=55  B3=59  e4=64
 */
export const open       = [40, 45, 50, 55, 59, 64]; // E standard
export const tuningName = 'E standard';
export const strings    = ['e', 'B', 'G', 'D', 'A', 'E']; // high→low display

// ─── Tempo ranges ─────────────────────────────────────────────────────────────

export const bpmLead   = [118, 185]; // "Mr. Scary" mid-section ceiling; melodic solos floor
export const bpmRhythm = [90,  148];

// ─── Scale / mode palette ─────────────────────────────────────────────────────

/**
 * Intervals in semitones from the root.
 *
 * Lynch's harmonic vocabulary — the deepest and most exotic of any LA metal player:
 *
 *  1. Phrygian         — primary exotic mode; b2 gives the Spanish/Middle Eastern flavor
 *                        Influenced by Ritchie Blackmore (Deep Purple), flamenco, metal
 *  2. Harmonic minor   — provides the exotic raised 7th + b6 combination;
 *                        generates Phrygian dominant (5th mode) for solo work
 *  3. Minor pentatonic — still the foundation; Lynch never abandons it, but always
 *                        extends it with Phrygian/HM color notes
 *  4. Phrygian dominant— 5th mode of harmonic minor [0,1,4,5,7,8,10];
 *                        creates the "Arabic" sound when resolving to i
 *  5. Blues scale      — b5 tritone appears in almost EVERY Lynch composition
 *  6. Diminished       — for tension runs; half-whole diminished pattern
 *  7. "Gothic Octave" (Hirajoshi) — Lynch's own name for the Japanese pentatonic scale
 *                                    [0,2,3,7,8]; creates pure oriental color
 *
 * Lynch is explicitly NOT a strict modal theorist — he thinks in "box shapes"
 * and "gray area" (see scalePhilosophy below).  These scales describe the
 * SOUND, not a theoretical framework he consciously applies.
 */
export const scales = {
  phrygian:         [0, 1, 3, 5, 7, 8, 10],  // b2 = the "Lynch note"
  harmonicMinor:    [0, 2, 3, 5, 7, 8, 11],  // raised 7th creates exotic tension
  pentatonicMinor:  [0, 3, 5, 7, 10],
  blues:            [0, 3, 5, 6, 7, 10],      // b5 tritone in almost every song
  phrygianDominant: [0, 1, 4, 5, 7, 8, 10],  // 5th mode of harmonic minor; Arabic flavor
  diminished:       [0, 2, 3, 5, 6, 8, 9, 11], // half-whole diminished
  aeolian:          [0, 2, 3, 5, 7, 8, 10],
  gothicOctave:     [0, 2, 3, 7, 8],          // Hirajoshi / Japanese pentatonic; Lynch's term
};

// ─── The "Gray Area" chromatic philosophy ────────────────────────────────────

/**
 * Lynch's most distinctive compositional concept, stated in his own words:
 * "I see the gray area in shapes and look for alternative places to go...
 *  finish on a note that is in the key you are in."
 *
 * In practice: take a standard pentatonic or blues box, visualize the semitone
 * gaps between scale notes as "gray area," insert chromatic passing tones there,
 * and resolve the phrase to an in-key target note.
 *
 * This is NOT random atonality — the chromatic notes create tension that
 * resolves.  The pattern recurs in a recognizable way that gives structure
 * despite the "outside" notes.
 *
 * In generator terms:
 *  - Pick a target note (in-scale)
 *  - Approach it from a semitone below or above (the "gray area" note)
 *  - The approach can be a slide (/), hammer-on (h), or picked chromatic note
 *  - Apply most commonly to beat-3 and beat-4 targets in a phrase
 *
 * The b5 (tritone) is his most-used "gray area" note:
 *  - In E minor pentatonic: between G (fret 3 on e str) and A (fret 5 on e str)
 *    sits Bb/G# (fret 4) — Lynch hits this constantly
 *  - He uses it as a passing tone INTO the perfect 5th (A), creating tension/release
 */
export const scalePhilosophy = {
  concept: 'gray-area chromatic',
  description: 'Visualize semitone gaps in box shapes; insert chromatic passing tones that resolve to in-key targets',
  primaryApproachIntervals: [-1, +1],  // semitone below or above target
  primaryTargetDegrees: [5, 7, 10],    // 5th, minor 7th, minor 3rd (pentatonic targets)
  tritonePassingNote: 6,               // b5 — appears in almost every Lynch composition
  resolveOnBeat: [3, 4],              // chromatic tensions resolve on beats 3 and 4
};

// ─── Key color intervals ──────────────────────────────────────────────────────

/**
 * Individual interval offsets that define Lynch's harmonic identity.
 * These are semitone offsets from the root, used in generators to find
 * specific "Lynch notes" on any string.
 */
export const colorNotes = {
  bII:     1,   // Phrygian b2 / Neapolitan — the primary exotic color
  tritone: 6,   // b5 — in nearly every song; massive tension
  bVI:     8,   // harmonic minor b6 — exotic alongside the raised 7th
  maj7:    11,  // harmonic minor raised 7th — creates the "harmonic" tension
  chromaticApproach: 1, // half-step above or below a target (gray area)
};

// ─── Lead fret-position windows ──────────────────────────────────────────────

/**
 * Lynch solos across the full neck but concentrates in specific boxes.
 * His Phrygian work often starts at position 4–5 (where the b2 sits naturally
 * close to open strings).  Harmonic minor sweeps cluster at 4–9.
 * High-register shred (12+) is used for climactic moments.
 */
export const leadPositions = [4, 5, 7, 9, 12];

// ─── Vibrato ─────────────────────────────────────────────────────────────────

/**
 * Lynch's "jackoff vibrato" — his single most distinctive physical technique.
 * Developed trying to emulate Jimi Hendrix; influenced by Carlos Santana's feel.
 *
 * Method: fretting hand moves PARALLEL to the neck (side to side, like a violinist)
 * rather than perpendicular (the common rock bend-vibrato).  This creates a
 * wide, smooth undulation rather than the typical bend-based shimmer.
 *
 * Characteristics:
 *  - Speed: fast to very fast
 *  - Width: wide (sometimes extreme) to subtle — highly variable
 *  - Application: applied immediately on note onset AND after bends resolve
 *  - Decoration code in tab: '~' on virtually every sustained note
 *
 * In contrast to EVH (which also has strong vibrato), Lynch's feels more
 * "classical" or "vocal" in its sweep — less whammy-assisted.
 */
export const vibratoStyle = {
  type: 'parallel-to-neck (violinist style)',
  speed: 'fast',
  width: 'wide to extreme',
  application: 'immediate onset + post-bend sustain',
  tabDecoration: '~',
  applyToNoteMinCols: 4,  // any note sustaining ≥ 4 16th cols gets vibrato
};

// ─── Two-handed tapping ───────────────────────────────────────────────────────

/**
 * Lynch's tapping approach vs. EVH:
 *  EVH  → pentatonic shapes [root, minor3rd, 5th] — warm, consonant arpeggios
 *  Lynch → harmonic minor / Phrygian shapes — exotic, dissonant arpeggios
 *            + diminished triads, augmented triads, Phrygian dominant
 *
 * Core unit: [tapFret, pullFret, hammerFret] — same format as EVH profile.
 *
 * Lynch's tap fret is almost always exactly 12 frets above the pull fret
 * (octave relationship), but the hammer fret creates the exotic interval.
 *
 * Position anchors used in App.jsx mr_scary_tap generator: pos = 5, 7, or 9.
 *  pos=5:  lo=5,  hi=17  → tap 17, pull 5, hammer 8/9/10
 *  pos=7:  lo=7,  hi=19  → tap 19, pull 7, hammer 10/11/12
 *  pos=9:  lo=9,  hi=21  → tap 21, pull 9, hammer 12/13/14
 *
 * Hammer targets and their intervallic meaning (from lo):
 *  lo+3 = minor 3rd  (minor triad arpeggio — most common)
 *  lo+4 = major 3rd  (Phrygian dominant / augmented context)
 *  lo+5 = perfect 4th (sus4 / Phrygian resolution target)
 *  lo+7 = perfect 5th (power-chord tapping — less common for Lynch)
 *
 * "Mr. Scary" style: harmonic minor arpeggio on single string
 *  root(lo) → b3(lo+3) → octave(lo+12) — then descend with pull-offs
 */
export const tapPatterns = [
  // pos=5 (lo=5, hi=17): exotic color at position 5
  [17, 5,  8],   // minor triad arpeggio (minor 3rd hammer)
  [17, 5,  9],   // Phrygian dominant flavor (major 3rd hammer)
  [17, 5, 10],   // perfect 4th — Phrygian resolution
  // pos=7 (lo=7, hi=19): mid-neck harmonic minor territory
  [19, 7, 10],   // minor triad from fret 7
  [19, 7, 11],   // major 3rd — augmented / HM color
  [19, 7, 12],   // perfect 4th from fret 7
  // pos=9 (lo=9, hi=21): upper-mid neck
  [21, 9, 12],   // minor triad from fret 9 (Mr. Scary home territory)
  [21, 9, 13],   // major 3rd color
  [21, 9, 14],   // perfect 4th
  // Inverted: pull lands on 3rd, hammer on 5th (triad ascending)
  [17, 8,  5],   // descending minor triad (reversed)
  [19, 10, 7],
  // Tap-slide variant: tap then slide +1 semitone (Lynch's tap-slide)
  [17, 5,  8],   // same as first, but generator adds '/' decoration after hammer
  [19, 7, 10],
];

/**
 * Preferred strings for tapping.
 * Lynch taps on D (str2) and G (str3) strings — mid-register for harmonic clarity.
 * He rarely taps high on the B/e strings (that's more EVH territory).
 */
export const tapStrings    = [2, 3, 2, 3, 2]; // D and G string dominant
export const tapGroupSizes = [8, 6, 8, 6];    // slightly wider spacing than EVH; more deliberate

// ─── Rhythm: chord progressions ──────────────────────────────────────────────

/**
 * Semitone offsets from root fret on low-E string (str0).
 * Lynch's rhythm playing is built on:
 *  1. Fast single-note lines on A string (str1) with palm muting
 *  2. Power chord stabs on low-E at specific positions
 *  3. Chromatic half-step approach notes BETWEEN chord positions
 *
 * All offsets are relative to rootF = gf(root, 0, open) on the low-E string.
 */
export const rhythmProgressions = {
  /**
   * i → bVII → bVI with chromatic connectors — "Tooth and Nail" backbone.
   * Four measure sequences; each entry = 4 root offsets (one per measure).
   * The chromatic +1 approach note between positions is IMPLICIT in the generator
   * (see chromaticApproach below); these define the target positions only.
   */
  toothAndNail: [
    [0, -2, -4, -2],   // i  bVII  bVI  bVII  — the core Dokken cadence
    [0, -2,  0, -4],   // i  bVII   i   bVI
    [0, -4, -2,  0],   // i   bVI  bVII   i   — resolve to root
    [0, -2, -4, -5],   // i  bVII  bVI   bV   — darker descent
  ],

  /**
   * Fast A-string single-note riff lines — "Into the Fire" / speed riff style.
   * Each inner array = [str, fretOffset] sequence for 4 beats within one measure.
   * str 0 = low-E (pedal); str 1 = A string (melody).
   * Applied 16 notes per measure (every 16th-note column).
   *
   * The chromatic fretOffset (+1 from rootF) is Lynch's passing note signature.
   */
  aStringRiff: [
    // [str, fretOffset] × 4 beats — each beat = 4 cols
    [[0, 0], [0, 0], [1, 2], [0, 1]],   // low-E pedal → A-string 5th → chromatic pass
    [[0, 0], [1, 2], [0, 0], [0, 3]],   // low-E → A 5th → low-E → A minor 3rd
    [[0, 0], [0, 1], [1, 2], [0, 0]],   // pedal → chromatic → 5th → back
  ],

  /**
   * Breaking the Chains style: straightforward power chord sequence.
   * Simple i-bVII-bVI in 4/4 with rhythmic variation.
   * Offsets from rootF on low-E string.
   */
  breakingChains: [
    [0, 0,  5,  0],   // i i IV i  (major-feel moment)
    [0, 5,  7,  5],   // i IV V IV
    [0, -2, 0, -4],   // i bVII i bVI
    [0, -2, -4, 0],   // i bVII bVI i
  ],

  /**
   * Phrygian color riff — bII approach then resolve to i.
   * The "+1" is the bII (Neapolitan) lurch, Lynch's most characteristic chord move.
   * Pattern: i → bII → i → bVII, repeated.
   */
  phrygianChords: [
    [0,  1,  0, -2],   // i  bII   i  bVII
    [0,  1, -2,  0],   // i  bII  bVII   i
    [0, -2,  1,  0],   // i  bVII  bII   i
    [1,  0, -2, -4],   // bII → i → bVII → bVI  (opens on dissonance)
  ],
};

// ─── Chromatic approach note ──────────────────────────────────────────────────

/**
 * Lynch inserts chromatic passing notes between power chord positions.
 * This is not ornamentation — it's a structural feature of his riff style.
 *
 * In a riff moving from fret X to fret Y:
 *  - If ascending: play X, then X+1 (chromatic), then Y
 *  - If descending: play X, then X-1 (chromatic), then Y
 *
 * The chromatic note lands on an OFF-beat 16th column between chord hits.
 * This creates the "crawling" half-step motion characteristic of Dokken riffs.
 *
 * Example ("Tooth and Nail" riff concept):
 *  low-E: 0 0 0 0 → 1 (chrom) → 0 0 → fret-3 stab → 0 0 ...
 *         pedal   → approach  → back → chord        → pedal
 */
export const chromaticApproach = {
  offsetAscend:  +1,  // half-step above current position
  offsetDescend: -1,  // half-step below current position
  landingColOffset: 1, // chromatic note lands 1 16th-col before the target chord
  tabDecoration: '',   // no specific decoration — just a picked note
};

// ─── Rhythm: strumming / picking patterns ─────────────────────────────────────

/**
 * Column-offset attack patterns within a 16-column measure.
 *
 * Lynch characteristics:
 *  - Fast A-string single-note lines at 16th-note density (every col = machine-gun)
 *  - Power chord stabs typically on beats 3 and "and-of-4" (cols 8 and 14)
 *  - Chromatic passing note on the 16th BEFORE a chord arrival
 *  - Heavy palm muting throughout; lifts for chord stabs
 *  - Occasional open low-E pedal between chord stabs (not always — unlike DeMartini)
 */
export const rhythmPatterns = [
  [0, 4, 8, 12],              // straight quarters (slower, heavier passages)
  [0, 2, 4, 6, 8, 10, 12, 14], // 16th-note machine-gun (speed riff / Into the Fire)
  [0, 4, 8, 10, 14],          // beat-3 + anticipation accent (Tooth and Nail feel)
  [0, 2, 4, 8, 10, 12],       // syncopated with gap
  [0, 6, 8, 14],              // sparse, heavy stabs
  [0, 4, 6, 8, 12, 14],       // gallop variant
  [0, 2, 8, 12, 14],          // front-loaded then back anticipation
  [0, 4, 8, 12, 14],          // standard + anticipation on 4-and
];

// ─── Song reference library ───────────────────────────────────────────────────

export const songs = {
  mrScary: {
    album: 'Back for the Attack (1987)',
    key: 'E minor / Phrygian',
    bpm: 126,
    tuning: 'E standard',
    techniques: ['tapped-arpeggios', 'phrygian', 'harmonic-minor', 'whammy-dive', 'wide-vibrato'],
    notes: [
      'Lynch\'s acknowledged masterpiece — full technical arsenal in one instrumental composition',
      'Tapping uses harmonic minor arpeggio shapes, NOT pentatonic (distinguishes from EVH)',
      'Tap pattern: hi fret (octave) pull → lo fret (root) hammer → mid fret (minor 3rd or major 3rd)',
      'Opens with low-E open string then hammer-on to 2nd fret in 16th notes (machine-gun intro)',
      'Whammy bar dive bombs appear at climactic moments — Floyd Rose essential for return to pitch',
      'Phrygian dominant run resolves to E: approach b2 (F) then resolve down to E root',
      'Considered the defining Lynch composition; studied by every Lynch-style player',
    ],
  },
  toothAndNail: {
    album: 'Tooth and Nail (1984)',
    key: 'E minor',
    bpm: 148,
    tuning: 'E standard',
    techniques: ['alternate-picking', 'legato', 'dive-bomb', 'natural-harmonics', 'wide-vibrato'],
    notes: [
      'Opens with rapid-fire alternate picking — no buildup, full speed from bar 1',
      'Lightning-fast legato runs connecting Phrygian and minor pentatonic box positions',
      'Jaw-dropping whammy dive bomb at phrase endings',
      'Natural harmonics used as texture in rhythm sections',
      'Wide jackoff vibrato on every sustained note — even short ones',
      'AllMusic: "there isn\'t a single solo on the album that isn\'t worth hearing"',
    ],
  },
  breakingTheChains: {
    album: 'Breaking the Chains (1981)',
    key: 'E minor',
    bpm: 120,
    tuning: 'E standard',
    techniques: ['power-chords', 'string-bending', 'sweep-picking', 'palm-mute'],
    notes: [
      'Rock-solid groove riff: i-bVII-bVI power chord sequence, driving 8ths',
      'Solo features string bending phrases — blues-informed Aeolian approach',
      'Sweep picking licks appear in solo acceleration sections',
      'Palm muting controls dynamics — riff breathes between chord hits',
      'Most approachable Lynch composition; blues roots most audible here',
    ],
  },
  intoTheFire: {
    album: 'Tooth and Nail (1984)',
    key: 'G# minor',
    bpm: 130,
    tuning: 'E standard',
    techniques: ['fast-A-string-riff', 'phrygian', 'chromatic-passing', 'alternate-picking'],
    notes: [
      'Key: G# minor — unusual key choice, adds to the exotic feel',
      'Primary harmonic palette: G#m, E, F#, C# (Aeolian with major IV and V)',
      'Rhythm riff: fast A-string single-note line with chromatic half-step passing between positions',
      'Isolated harmonic tracks reveal the construction detail: palm-muted A-string + chord stab pattern',
      'Demonstrates his "machine-gun 16th-note single notes" approach as rhythm not just lead',
    ],
  },
  inMyDreams: {
    album: 'Under Lock and Key (1985)',
    key: 'Eb minor (recorded Eb standard)',
    bpm: 118,
    tuning: 'Eb standard (exception)',
    techniques: ['melodic-solo', 'string-bending', 'wide-vibrato', 'phrasing'],
    notes: [
      'One of his most accessible and melodic solos — song-serving over technical display',
      'Eb standard tuning — the album\'s exception to his normal E standard approach',
      'Solo described as "killer" and "covers each note thoroughly" — phrase by phrase',
      'Demonstrates controlled restraint; space between notes as important as the notes',
      'Wide jackoff vibrato at its most musical here — slow, expressive, Santana-influenced',
    ],
  },
  dreamWarriors: {
    album: 'Back for the Attack (1987)',
    key: 'E minor',
    bpm: 128,
    tuning: 'E standard',
    techniques: ['palm-muting', 'slides', 'bends', 'multi-part'],
    notes: [
      'Multi-part guitar arrangement (at least 4 documented guitar parts)',
      'Combines palm-muted riff foundation with slide-decorated melodic lines',
      'i-bVII-bVI progression with Lynch\'s chromatic approach notes between changes',
      'Shows his ability to write for layered guitar arrangements, not just solo showcase',
    ],
  },
  justGotLucky: {
    album: 'Tooth and Nail (1984)',
    key: 'E minor',
    bpm: 132,
    tuning: 'E standard',
    techniques: ['blues-solo', 'pentatonic', 'phrygian-color'],
    notes: [
      'Second single from Tooth and Nail; charted #27 on Billboard Mainstream Rock',
      'Solo uses minor pentatonic foundation with Phrygian b2 color note insertions',
      'Less exotic than Mr. Scary — demonstrates his accessible blues side',
      'b5 tritone passing tone appears as it does in virtually every Lynch solo',
    ],
  },
  aloneAgain: {
    album: 'Tooth and Nail (1984)',
    key: 'E minor',
    bpm: 100,
    tuning: 'E standard',
    techniques: ['melodic-solo', 'string-bending', 'vibrato', 'blues'],
    notes: [
      'Widely cited as one of his "easiest" and most purely melodic solos',
      'Highly accessible entry point for Lynch-style playing',
      'Sustained bends with wide vibrato dominant — closer to blues idiom',
      'Slow tempo gives maximum space for his violinist-style vibrato to breathe',
    ],
  },
};

// ─── AI prompt string ─────────────────────────────────────────────────────────

/**
 * Injected into Claude prompts verbatim.  Covers technique mechanics,
 * theory, feel, and fret-level specifics for authentic Lynch tab.
 */
export const aiPrompt = `GUITARIST: George Lynch (Dokken, 1982–1989 classic era)
TUNING: E standard (E A D G B e) — no alternate tunings on classic Dokken albums
STRING INDEX: 0=E(low) 1=A 2=D 3=G 4=B 5=e(high)

━━ CORE IDENTITY ━━
Lynch is the most harmonically exotic player in 1980s LA metal. Where every peer reached for
minor pentatonic, Lynch reached for Phrygian, harmonic minor, and Phrygian dominant.
The result is a "dark Middle Eastern / Spanish" flavor that is instantly recognizable.
"There's so much to say without playing endless streams of notes — I'm always aware of the
value of subtlety and silence." — controlled chaos, not mindless speed.

━━ HARMONIC LANGUAGE (most important section) ━━
PRIMARY SCALE: Phrygian [0,1,3,5,7,8,10] — the b2 (one half-step above root) is THE Lynch note.
  • On low-E: root at fret N, b2 is fret N+1 — that half-step is his harmonic signature
  • Ritchie Blackmore (Deep Purple) influence — Phrygian aggression meets Carlos Santana feel

HARMONIC MINOR [0,2,3,5,7,8,11] — parent scale for exotic sweep/arpeggio work.
  • The b6+maj7 combination creates the "Mr. Scary" harmonic color
  • Phrygian dominant (5th mode of HM: [0,1,4,5,7,8,10]) for Arabic-sounding resolution to i

TRITONE / b5 [interval = 6 semitones above root] — appears in ALMOST EVERY Lynch composition.
  • In E minor: between G (fret 3 on e) and A (fret 5) sits Bb (fret 4) — his passing note
  • Used as chromatic tension INTO the perfect 5th; creates immediate darkness

THE "GRAY AREA" CHROMATIC APPROACH (Lynch's own concept):
  • Visualize a pentatonic/blues box; the gaps between scale notes = "gray area"
  • Insert chromatic passing tones (notes outside the scale) in these gaps
  • Always resolve to an IN-KEY target note at the end of the phrase
  • The approaching note is typically b2 (below target) or chromatic approach (above)
  • Result: phrases that sound "outside" but always land "inside" — controlled tension/release

━━ RHYTHM RIFF STYLE ━━
1. FAST A-STRING SINGLE-NOTE MACHINE-GUN ("Into the Fire", "Mr. Scary" intro):
   • Alternate-pick or legato 16th notes on A string (str1), palm muted throughout
   • Typical pattern: [str0 pedal → str1 melody → str0 → str1 chromatic pass → str0 → str1 target]
   • The chromatic passing note lands ONE 16th-col BEFORE the target chord arrival
   • Chord stab then punctuates at beat 3 (col 8) or beat-4-and (col 14) on low-E or A

2. i → bVII → bVI WITH CHROMATIC CONNECTORS ("Tooth and Nail" backbone):
   • Power chords in Aeolian minor, same as many LA metal bands — BUT
   • Between each chord change: insert a chromatic passing chord (rootFret+1) on the off-16th
   • This "crawling" half-step motion is structurally different from Ratt, EVH, etc.
   • Offsets from rootF on low-E: i=0, bVII=−2, bVI=−4, chromatic=+1 (always)

3. bII PHRYGIAN LURCH (Phrygian chord riff):
   • i → bII (root+1) → i — sudden half-step above creates Spanish/Flamenco dissonance
   • Used as stab or as a two-beat chord before resolving down to i or up to bVII
   • Most prominent in fast riff contexts; the bII lasts ≤ 2 counts before resolution

━━ LEAD / SOLO STYLE ━━
VIBRATO — "The Jackoff Vibrato" (his own term, developed from Hendrix):
  • Fretting hand moves PARALLEL to neck (side to side) like a classical violinist
  • NOT the typical perpendicular bend-vibrato — this creates a wider, smoother undulation
  • Wide to extreme width; fast speed; applied IMMEDIATELY on note onset
  • Apply '~' decoration to virtually every sustained note (≥ 4 16th-note columns)
  • Carlos Santana influence audible in the expressiveness and bluesiness of application

TAPPING — Harmonic minor / Phrygian arpeggios (NOT EVH pentatonic):
  • Core unit: tap high fret (octave above lo) → pull-off to lo → hammer to exotic middle note
  • [tap=lo+12, pull=lo, hammer=lo+3] = minor triad (most common — Mr. Scary style)
  • [tap=lo+12, pull=lo, hammer=lo+4] = major 3rd — Phrygian dominant / augmented color
  • [tap=lo+12, pull=lo, hammer=lo+5] = perfect 4th — Phrygian resolution gesture
  • Preferred strings: D (str2) and G (str3) — mid-register for harmonic clarity
  • Spacing: 8 16th-cols per unit (slightly wider than EVH's triplets — more deliberate)
  • Tap-slide variant: after tap, slide up or down 1 fret before pull-off ('/' decoration)

PHRASING ARC:
  • Opens with aggressive alternate-picked or legato run (Phrygian or HM scale)
  • Inserts b5 tritone as passing note mid-phrase — creates sudden darkness
  • Lands on a target note (root, minor 3rd, or 5th) with extreme wide vibrato
  • Silence follows — "subtlety of silence equally important as notes played"
  • Never plays "endless streams of notes" — phrases have clear beginnings and ends

POSITION USAGE:
  • Phrygian runs: positions 4–5 (b2 sits naturally near open strings)
  • Harmonic minor sweeps: positions 4–9
  • Tapping positions: 5, 7, 9 (lo fret) with tap at lo+12
  • High-register climax: 12+ fret for song endings and peak moments

━━ FEEL & PHILOSOPHY ━━
"Controlled chaos" — aggressive and technically demanding but always musical and resolved.
Dark, exotic, Middle Eastern / Spanish flavor separates Lynch from every LA metal peer.
Influences: Ritchie Blackmore (Phrygian aggression), Carlos Santana (vibrato/feel/blues soul),
Jimi Hendrix (vibrato development), Eric Clapton (blues roots), Allan Holdsworth (outside thinking).
Every exotic note should resolve. Every fast run should breathe. Every bend should be committed.`;

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
  scalePhilosophy,
  colorNotes,
  leadPositions,
  vibratoStyle,
  tapPatterns,
  tapStrings,
  tapGroupSizes,
  chromaticApproach,
  rhythmProgressions,
  rhythmPatterns,
  songs,
  aiPrompt,
};
