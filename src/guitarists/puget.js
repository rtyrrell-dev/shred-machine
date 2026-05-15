/**
 * Jade Puget — AFI (1998–present; focus on 1999–2013 classic era)
 *
 * Dual-purpose profile:
 *   1. `aiPrompt`  — injected into Claude prompts for AI tab generation
 *   2. All other exports — raw data consumed by hardcoded generator functions
 *
 * NOTE ON TUNING: Puget plays Eb standard (one half-step below standard)
 * across the entire AFI catalog from Art of Drowning onward.  Every interval,
 * fret reference, and MIDI value in this file uses Eb standard open strings.
 */

// ─── Identity ─────────────────────────────────────────────────────────────────

export const id    = 'jade';
export const name  = 'Jade Puget';
export const band  = 'AFI';
export const era   = '1998–present (classic era 1999–2013)';
export const color = '#33ccff';

// ─── Tuning ───────────────────────────────────────────────────────────────────

/**
 * Eb standard — every string one half-step below E standard.
 * Puget chose Eb for its slightly darker, heavier resonance compared to E,
 * and for the comfort it gives Davey Havok's vocal range.
 *
 * MIDI open strings, index 0 = low string, 5 = high eb:
 *   Eb2=39  Ab2=44  Db3=49  Gb3=54  Bb3=58  eb4=63
 *
 * Live set variations: occasionally D standard, Drop Db (Eb drop), or E standard
 * depending on song; but Eb standard is the canonical recording tuning.
 */
export const open       = [39, 44, 49, 54, 58, 63]; // Eb standard
export const tuningName = 'Eb standard (Eb Ab Db Gb Bb eb)';
export const strings    = ['eb', 'Bb', 'Gb', 'Db', 'Ab', 'Eb']; // high→low display

// ─── Tempo ranges ─────────────────────────────────────────────────────────────

export const bpmLead   = [118, 184]; // "Leaving Song Pt. II" floor; "Miss Murder" ceiling
export const bpmRhythm = [118, 174]; // Black Sails hardcore top end; slow Burials floor

// ─── Scale / mode palette ─────────────────────────────────────────────────────

/**
 * Intervals in semitones from the root.
 *
 * Puget's harmonic vocabulary, rough order of use:
 *  1. Aeolian / natural minor — primary mode; every era, every album
 *  2. Minor pentatonic        — simplified Aeolian for punchier riffs and leads
 *  3. Phrygian                — "Leaving Song Pt. II" style fast runs; adds b2 for
 *                               Spanish/dark flavor and feeds the bII chord move
 *  4. Blues scale             — occasional passing b5, especially in faster hardcore runs
 *  5. Chromatic               — half-step neighbor tones (the Neapolitan bII approach)
 *
 * Influences driving this vocabulary: The Cure (Aeolian post-punk), Siouxsie &
 * the Banshees (Phrygian/chromatic dissonance), Robert Johnson/BB King (blues b5).
 */
export const scales = {
  aeolian:         [0, 2, 3, 5, 7, 8, 10],
  pentatonicMinor: [0, 3, 5, 7, 10],
  phrygian:        [0, 1, 3, 5, 7, 8, 10],  // b2 = Neapolitan neighbor note
  blues:           [0, 3, 5, 6, 7, 10],
};

// ─── Lead fret-position windows ──────────────────────────────────────────────

/**
 * Puget rarely plays high-neck single-string shred.  His leads and melodic
 * passages cluster in the mid-neck area where open strings can ring underneath.
 * He consciously plays two or three strings simultaneously rather than pure
 * single-string lines, so these positions serve multi-string phrases.
 */
export const leadPositions = [5, 7, 9, 12, 4];

// ─── Tapping style ────────────────────────────────────────────────────────────

/**
 * Puget's tapping is MELODIC, not shred.  He features it on 1–2 songs per album,
 * always in service of a specific melodic idea rather than as a speed showcase.
 *
 * Format: [tapFret, pullFret, hammerFret] — same convention as EVH profile.
 * Groups of 6 sixteenth-note columns per unit (triplet feel), reflecting his
 * melodic pacing.  He does NOT do rapid-fire 16th-note triplet blasts;
 * the notes breathe and have space between groups.
 *
 * Reference song: "Dancing Through Sunday" (Sing the Sorrow, 2003)
 * — melodic arpeggio tapping across Aeolian chord tones, groups of 6
 */
export const tapPatterns = [
  // Aeolian-flavored melodic shapes (Sing the Sorrow era)
  [12, 5,  8],   // minor pentatonic core (mirrors EVH but at slower, more melodic tempo)
  [12, 5,  7],   // Aeolian minor 3rd hammer
  [12, 4,  7],   // Phrygian color — tap 12, pull to 4 (b2), hammer 7
  [12, 3,  7],   // Dark Phrygian b2 emphasis
  [10, 3,  5],   // Lower register; intimate, atmospheric
  [10, 5,  8],   // Mid-neck tap
  [14, 5,  9],   // Extended reach
  [14, 7, 10],   // Position 7 fretting + 14th tap
  [17, 5,  8],   // High tap, wide interval — dramatic moment
  [17, 7, 10],
];

/**
 * Preferred strings for tapping.
 * Puget favors Gb (str3) and Bb (str4) for melodic tap lines.
 * He rarely taps on the low strings; tapping is always a melodic upper-voice device.
 */
export const tapStrings = [3, 4, 3, 4, 5]; // Gb and Bb dominant

/**
 * Column spacing per tapping group.
 * 6 = triplet feel (his default — melodic, breathing)
 * 8 = wider spacing — used when tap phrase overlaps a held chord below
 */
export const tapGroupSizes = [6, 6, 8, 6]; // triplet dominant; never rushing

// ─── Open-string melodic picking ─────────────────────────────────────────────

/**
 * Puget's signature melodic lead texture from the Art of Drowning era:
 * an open string (usually open Bb, str4 fret 0) used as a pedal/drone,
 * alternating with fretted notes on the high eb string (str5).
 *
 * This creates the floating, atmospheric quality heard in "Days of the Phoenix."
 * The open string provides harmonic continuity while the fretted string carries
 * melody — effectively a two-voice texture from one guitarist.
 *
 * Column rhythms below are 16th-note column indices for a 4-measure phrase
 * (64 cols total).  Even-index entries = open string; odd-index = fretted melody.
 */
export const openStringPickingRhythms = [
  // Alternating open-Bb + fretted-eb, 8th-note spacing with occasional 16th decoration
  [0, 4, 6, 8, 12, 14, 16, 20, 22, 24, 28, 30, 32, 36, 38, 40, 44, 46, 48, 52, 54, 56, 60, 62],
  // Dotted feel — open Bb on beats, fretted eb on the "and" with slight push
  [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 63],
];

/**
 * The open-string pedal note is always the open Bb string (str4, fret 0 = Bb3).
 * The fretted melody rides on the eb string (str5).
 */
export const openStringPedal = { str: 4, fret: 0 };  // open Bb
export const openStringMelody = { str: 5 };           // fretted eb string

// ─── The Neapolitan bII chord (chromatic neighbor) ────────────────────────────

/**
 * Puget's most distinctive harmonic device: the bII chord — one half-step ABOVE
 * the root — deployed as a chromatic neighbor that creates sudden dissonance before
 * resolving back to i.  This is the Neapolitan chord used in a punk/post-punk context.
 *
 * In Aeolian minor, a typical cadence is: i → bVII → bVI → bVII → i
 * Puget replaces or augments this with: i → bII → i  (crushing half-step approach)
 * or uses bII as a color stab: i … bII … bVII … i
 *
 * On the Ab string (str1, the generator's chord root string), the bII fret is
 * always rootFret + 1.  The generator should clamp to [0, 22].
 *
 * Also used as a chromatic passing chord between i and bVII:
 *   i(0) → bII(+1) → i(0) → bVII(-2)   — creates unsettling chromatic color
 *
 * Era most prominent: Black Sails (1999) hardcore dissonance; Phrygian runs
 * in "Leaving Song Pt. II" (2003); "The Nephilim" (2000).
 */
export const bIIOffset = 1; // semitones above root fret on Ab string

// ─── Rhythm: chord progressions ──────────────────────────────────────────────

/**
 * Power chord root fret offsets from i (root) on the Ab string (str1).
 * Apply with pwrA(rootF + offset, open) in the generator.
 * Values are semitone offsets; clamp results to [0, 22].
 *
 * Aeolian degree → semitone offset from root:
 *   i   = 0
 *   bII = +1   (Neapolitan — chromatic, Puget's signature)
 *   bIII= +3
 *   iv  = +5
 *   v   = +7
 *   bVI = -4   (equivalently +8, but going down is more natural on guitar)
 *   bVII= -2   (equivalently +10)
 */
export const rhythmProgressions = {
  /**
   * i – bVI – bVII — the AFI backbone.
   * Used in "Girl's Not Grey", "Miss Murder", virtually every mid-era song.
   * Four measure patterns; each entry = [m1_offset, m2_offset, m3_offset, m4_offset].
   */
  aeolianCore: [
    [0, -4, -2, -4],   // i  bVI  bVII  bVI   — looping cadence
    [0, -4, -2,  0],   // i  bVI  bVII  i     — resolve to root
    [0, -2, -4, -2],   // i  bVII bVI  bVII   — reversed emphasis
    [0,  0, -4, -2],   // i  i    bVI  bVII   — delayed movement
  ],

  /**
   * i – bII – i – bVII (Neapolitan dissonance then resolution).
   * Black Sails / hardcore era and Phrygian lead sections.
   * The +1 half-step neighbor creates the "sinister lurch" sound.
   */
  neapolitanMove: [
    [0,  1,  0, -2],   // i  bII  i  bVII
    [0,  1, -2,  0],   // i  bII  bVII  i
    [0, -2,  1,  0],   // i  bVII  bII  i
    [0,  1,  0, -4],   // i  bII  i  bVI
  ],

  /**
   * Syncopated stab patterns — Sing the Sorrow / Decemberunderground style.
   * Puget NEVER plays i-bVI-bVII as straight 8th notes; stabs are always
   * syncopated off-beats.  The chord hits anticipate or delay by a 16th.
   *
   * These are column offsets (16th-note positions) within a 16-col measure
   * where power chord stabs land.  Between stabs: silence or palm mute.
   */
  syncopatedStabs: [
    [0, 6, 10, 14],          // beat 1 + three off-beat stabs
    [0, 2, 8, 14],           // front-heavy then anticipation
    [2, 6, 10, 12],          // entirely off-beat — maximum syncopation
    [0, 4, 10, 14],          // quarter + anticipation pattern
    [0, 6, 8, 12, 14],       // busy Sing the Sorrow feel
    [0, 2, 6, 12],           // sparse, atmospheric stabs
  ],

  /**
   * Driving 8th-note chug — Black Sails hardcore era.
   * Fast, relentless, less syncopated than later work.
   * i-bII neighbor stabs in 8th-note context at high BPM (~160+).
   */
  hardcoreChug: [
    [0, 2, 4, 6, 8, 10, 12, 14],  // straight 8ths
    [0, 2, 4, 8, 10, 12, 14],      // slight gap on beat 3
    [0, 2, 6, 8, 10, 14],          // two gaps for urgency
  ],

  /**
   * "Days of the Phoenix" / Art of Drowning verse progression.
   * Ab-string root chords at varying positions; often with open strings ringing.
   * Semitone offsets from root, one per chord hit across a 2-measure phrase.
   */
  artOfDrowning: [
    [0, -2,  0, -4,  0, -2],        // i bVII i bVI i bVII — wandering
    [0,  3,  0, -2,  0,  3],        // i bIII i bVII i bIII — brighter
    [0, -4,  0, -2,  1,  0],        // i bVI i bVII bII i   — with neighbor
  ],
};

// ─── Rhythm: strumming / picking patterns ─────────────────────────────────────

/**
 * Column-offset attack patterns within a 16-column measure.
 *
 * Puget's key rhythmic characteristics:
 *  - NEVER straight 8th-note stabs in the Sing the Sorrow+ era (too obvious)
 *  - Off-beat anticipations are essential — chord hits on "and" of beats
 *  - He seeks "a little melodic hook" over obvious palm-muted patterns
 *  - Black Sails era: straight 8ths and 16ths are acceptable (hardcore speed)
 *  - Droning tremolo picking (col spacing 1) for atmospheric drone sections
 */
export const rhythmPatterns = [
  [0, 6, 10, 14],              // signature off-beat stabs (Sing the Sorrow)
  [0, 2, 8, 14],               // front + back anticipation
  [2, 6, 10, 12],              // pure off-beat — "Girl's Not Grey" feel
  [0, 4, 10, 14],              // mixed quarter + anticipation
  [0, 6, 8, 12, 14],           // busier Decemberunderground feel
  [0, 2, 4, 6, 8, 10, 12, 14], // straight 8ths (Black Sails hardcore only)
  [0, 4, 8, 12],               // straight quarters (breakdown / intro)
  [0, 2, 6, 12],               // sparse atmospheric stabs (Burials era)
];

// ─── Tremolo-picked drone ─────────────────────────────────────────────────────

/**
 * Puget uses dense tremolo picking on a single note or dyad to create
 * atmospheric drone effects in verse sections or intro buildups.
 * Heard on "Twisted Tongues" (Bodies, 2021) and several Burials-era tracks.
 *
 * The tremolo note is typically the root or the 5th, held on one string
 * while a second string rings an open note for harmonic texture.
 *
 * In generator terms: populate every 16th-note column (spacing 1) on
 * one string for 8–16 columns, then release into a chord stab.
 *
 * Typical tremolo-to-stab ratio: 8 tremolo cols (half a measure) → chord stab.
 */
export const tremoloDroneConfig = {
  tremoloColSpacing: 1,        // every 16th-note column
  tremoloLengthCols: [8, 12, 16], // options: half-, three-quarter-, full-measure tremolo
  preferredStrings:  [1, 2],   // Ab or Db string (mid-range resonance)
  resolveToChord:    true,     // always followed by a power chord stab
};

// ─── Era style reference ─────────────────────────────────────────────────────

/**
 * Each era has a distinct compositional personality.
 * Generators can use `eraStyles` to pick an era and apply its characteristics.
 */
export const eraStyles = {
  /**
   * Black Sails in the Sunset (1999) — Fast Hardcore
   * Straight 8th/16th power chord aggression; bII chromatic neighbor for dissonance.
   * Minimal technique, maximum urgency.  Standard tuning (NOT yet Eb).
   */
  blackSails: {
    label: 'Black Sails hardcore',
    bpmRange: [155, 184],
    rhythmPatternKey: 'hardcoreChug',
    progressionKey:   'neapolitanMove',
    leadScale:        'phrygian',
    techniqueNotes:   'Relentless 8ths, chromatic bII neighbor chord stab, no legato polish',
  },

  /**
   * Art of Drowning (2000) — Open-String Melodic Awakening
   * Introduction of the open-Bb pedal + fretted-eb melody device.
   * First melodic tapping experiments.  Eb standard begins here.
   */
  artOfDrowning: {
    label: 'Art of Drowning',
    bpmRange: [130, 165],
    rhythmPatternKey: 'artOfDrowning',
    progressionKey:   'aeolianCore',
    leadScale:        'aeolian',
    techniqueNotes:   'Open-Bb pedal alternating with fretted eb melody; Aeolian; early tapping',
  },

  /**
   * Sing the Sorrow (2003) — Peak Melodic Complexity
   * Syncopated i-bVI-bVII stabs (NEVER straight 8ths).
   * Melodic tapping in groups of 6 on 1–2 songs.
   * Full barre chords, palm muting contrast, post-punk harmonic sophistication.
   */
  singTheSorrow: {
    label: 'Sing the Sorrow',
    bpmRange: [120, 160],
    rhythmPatternKey: 'syncopatedStabs',
    progressionKey:   'aeolianCore',
    leadScale:        'aeolian',
    techniqueNotes:   'Syncopated off-beat stabs; melodic tapping groups of 6; palm mute ↔ full chord dynamics',
  },

  /**
   * Decemberunderground (2006) — Mainstream Dark Clarity
   * "Miss Murder" riff: single-note melodic intro → power chord explosion.
   * Natural harmonics in choruses; double stops; palm-muted verses.
   */
  decemberunderground: {
    label: 'Decemberunderground',
    bpmRange: [130, 174],
    rhythmPatternKey: 'syncopatedStabs',
    progressionKey:   'aeolianCore',
    leadScale:        'aeolian',
    techniqueNotes:   'Melodic single-note intro → power chord explosion; palm mute verse; natural harmonics chorus',
  },

  /**
   * Burials / Bodies (2013–2021) — Sparse Atmospheric
   * Meandering, intentional guitar lines; tremolo drone; reverb/delay textures.
   * Guitar is "another tool" — not the dominant element.
   */
  burials: {
    label: 'Burials/Bodies atmospheric',
    bpmRange: [118, 150],
    rhythmPatternKey: 'syncopatedStabs',
    progressionKey:   'aeolianCore',
    leadScale:        'aeolian',
    techniqueNotes:   'Tremolo-picked drone; sparse stabs; in-the-box reverb/delay; guitar as texture not focus',
  },
};

// ─── Song reference library ───────────────────────────────────────────────────

export const songs = {
  missMurder: {
    album: 'Decemberunderground (2006)',
    key: 'G# minor (Ab minor in Eb tuning)',
    bpm: 144,
    tuning: 'Eb standard',
    techniques: ['melodic-intro', 'palm-mute', 'power-chords', 'natural-harmonics', 'double-stops'],
    notes: [
      'Iconic single-note melodic intro before power chords — the "Decemberunderground formula"',
      'Verse: palm-muted power chords on Ab string; tight, percussive',
      'Chorus: full barre chords across all 6 strings + natural harmonics for height',
      'Hammer-ons and double stops add urgency within the chord transitions',
      'Root: Ab minor on Ab string (str1); i-bVI-bVII backbone (Ab–E–Gb)',
      'Written in a single four-day studio session — last track completed for the album',
      'Post-punk and new wave influence in the melodic intro construction',
    ],
  },
  girlsNotGrey: {
    album: 'Sing the Sorrow (2003)',
    key: 'G# minor',
    bpm: 120,
    tuning: 'Eb standard',
    techniques: ['syncopated-stabs', 'full-barre-chords', 'aeolian', 'palm-mute'],
    notes: [
      'Chord sequence: G#m – F# – E – B (i – bVII – bVI – bIII in G# Aeolian)',
      'Verse rhythm: syncopated off-beat stabs — never straight 8ths',
      'Transitions between delicate verse picking and full-throttle chorus barre chords',
      'Lead melody on eb and Bb strings (str5/str4); Aeolian position 7–9',
      'Demonstrates his "always play full barre chords" philosophy — 6-string voicings throughout',
    ],
  },
  leavingSongPt2: {
    album: 'Sing the Sorrow (2003)',
    key: 'Eb minor',
    bpm: 145,
    tuning: 'Eb standard',
    techniques: ['phrygian-runs', 'fast-alternate-picking', 'aeolian', 'open-strings'],
    notes: [
      'Key: Eb minor (conveniently, root = open low Eb string in Eb tuning)',
      'Chord progression: Ebm – Db – Abm – Gb (i – bVII – iv – bIII)',
      'Fast alternate-picked Phrygian runs in lead sections — his most aggressive lead work',
      'Verse uses open-string melodic picking in the Art of Drowning style',
      'Demonstrates full range from punk aggression to melodic sophistication within one track',
    ],
  },
  daysOfThePhoenix: {
    album: 'The Art of Drowning (2000)',
    key: 'Eb / Bb area (Aeolian)',
    bpm: 138,
    tuning: 'Eb standard',
    techniques: ['open-string-pedal', 'melodic-picking', 'two-voice-texture'],
    notes: [
      'Signature technique debut: open-Bb (str4 fret 0) pedal alternating with fretted eb melody (str5)',
      'Every other note is open Bb; fretted notes carry the Aeolian melody above',
      'Creates two-voice texture (bass drone + melody) from a single guitarist',
      'Rhythm: 8th-note alternation with occasional 16th decorations (slides on melody)',
      'The "open Bb pedal + fretted eb melody" device defines the Art of Drowning sound',
    ],
  },
  silverAndCold: {
    album: 'Sing the Sorrow (2003)',
    key: 'G# minor',
    bpm: 130,
    tuning: 'Eb standard',
    techniques: ['palm-mute', 'dynamic-contrast', 'pluck-picking', 'syncopated-stabs'],
    notes: [
      'Verse: plucked, palm-muted "plucky" riff — deliberately softened and restrained',
      'Chorus: full-throttle barre chords, no palm muting — maximum dynamic contrast',
      'Dynamic relationship between verse/chorus is the compositional statement',
      'Charted #7 on Alternative Songs — demonstrates his pop-smart melodic instinct within goth framework',
    ],
  },
  theNephilim: {
    album: 'The Art of Drowning (2000)',
    key: 'Eb minor area',
    bpm: 155,
    tuning: 'Eb standard',
    techniques: ['fast-hardcore', 'chromatic-bII', 'hammer-pull'],
    notes: [
      'Fast Art of Drowning track showing the transition from Black Sails aggression',
      'Chromatic bII neighbor chord appears as a stab (half-step above root)',
      'Hammer-on/pull-off runs connect chord positions rather than picking every note',
    ],
  },
  summerShudder: {
    album: 'Decemberunderground (2006)',
    key: 'G# minor',
    bpm: 152,
    tuning: 'Eb standard',
    techniques: ['heavy-rock-guitars', 'melodic-lead', 'post-punk-riff'],
    notes: [
      'Band\'s favorite song from Decemberunderground; provides the album title',
      '"Lament of heavy rock guitars and soaring vocal work"',
      'Balances intense guitar weight with a melodic, catchy refrain',
      'Best example of Puget\'s "dark romantic" guitar voice in the catalog',
    ],
  },
  torchSong: {
    album: 'Crash Love (2009)',
    key: 'G# minor',
    bpm: 142,
    tuning: 'Eb standard',
    techniques: ['galloping-palm-mute', 'full-barre-chorus', 'epic-riff'],
    notes: [
      'Album opener — establishes Crash Love\'s cleaner but still powerful sound',
      'Verse: galloping palm-muted picking, syncopated stab pattern',
      'Chorus: intense ride-driven rhythm + epic full-chord guitar riffs',
      'Choir arrangement backing makes the guitar\'s melodic counterpoint more critical',
      'Mid-paced anthemic feel — not as fast as BT II material',
    ],
  },
  lookingTragic: {
    album: 'Burials (2013)',
    key: 'G# minor',
    bpm: 128,
    tuning: 'Eb standard',
    techniques: ['wall-of-palm-mute', 'percussive-rhythm', 'atmospheric'],
    notes: [
      'Wall of palm-muted guitars — Diamond Nitrox amp head provides the specific tone',
      'Demonstrates the later-era shift: guitar as rhythmic texture rather than melodic voice',
      'Puget\'s most percussive, least melodic rhythm approach',
    ],
  },
};

// ─── AI prompt string ─────────────────────────────────────────────────────────

/**
 * Injected into Claude prompts verbatim.
 */
export const aiPrompt = `GUITARIST: Jade Puget (AFI, 1998–present; classic era 1999–2013)
TUNING: Eb standard — Eb Ab Db Gb Bb eb (one half-step below standard)
STRING INDEX: 0=Eb(low) 1=Ab 2=Db 3=Gb 4=Bb 5=eb(high)

━━ CORE PHILOSOPHY ━━
"I rarely play something obvious when guitar can be providing melodic counterpoint to the vocals."
"Rather than obvious palm-muted patterns, I look for a little melodic hook — always more interesting."
Post-punk intelligence applied to heavy music. Every note deliberate. Atmospheric over aggressive.
He views himself as "more of a songwriter than a guitar player" — technique serves composition.
Influenced by The Cure, Siouxsie & the Banshees, Depeche Mode, Robert Johnson, Jimmy Page.

━━ TUNING & KEY ━━
Eb standard is the home tuning from Art of Drowning (2000) onward. Root of virtually all songs falls
on the Ab string (str1) or the low Eb string (str0). G# / Ab minor is the most common key center.
Open strings: Eb(0) Ab(1) Db(2) Gb(3) Bb(4) eb(5) — the open Bb (str4 fret 0) is a crucial pedal note.

━━ HARMONIC LANGUAGE ━━
PRIMARY PROGRESSION — i–bVI–bVII (Aeolian backbone):
  • Semitone offsets on Ab string: i=0, bVII=−2, bVI=−4
  • Example in Ab minor: Ab5(root) → E5(−4) → Gb5(−2) — the AFI cadence heard on nearly every song
  • Never resolves to V — always modal, never functional tonality

NEAPOLITAN bII CHORD (chromatic dissonance device):
  • bII = root fret + 1 on Ab string (one half-step above tonic)
  • Creates sudden lurch of dissonance: i(0) → bII(+1) → i(0) or i → bII → bVII → i
  • Black Sails era: used aggressively in fast 8th-note context
  • Sing the Sorrow era: used as syncopated stab within i–bVI–bVII framework
  • Phrygian scale [0,1,3,5,7,8,10] naturally contains the b2 (bII) — scale and chord choice are unified

SYNCOPATION RULE (Sing the Sorrow onward — CRITICAL):
  • Power chord stabs are NEVER straight 8th notes in the mid-to-late era
  • Hits land on off-beats: col 6 (and-of-2), col 10 (and-of-3), col 14 (and-of-4) within a 16-col measure
  • Typical stab pattern: [0, 6, 10, 14] or [2, 6, 10, 12] — anticipations and delays throughout
  • Only exception: Black Sails hardcore songs use straight 8th-note relentless chug

━━ LEAD / MELODY STYLE ━━
TECHNIQUE — Multi-string, not single-string:
  • Puget deliberately avoids pure single-string lead lines (sounds "thin" live without a second guitarist)
  • Almost always frets two strings simultaneously, or uses one fretted string + one open string
  • "Days of the Phoenix" formula: open Bb (str4 fret 0) pedal alternating with fretted eb melody (str5)
    — creates two-voice texture (drone + melody) from one guitarist

TAPPING (Sing the Sorrow era — melodic, NOT shred):
  • Features tapping on 1–2 songs per album; always in service of a melodic idea
  • Groups of 6 sixteenth-note columns per unit (triplet feel), with breathing space between groups
  • Shapes: tap 12 / pull 5 / hammer 8 (Aeolian), tap 12 / pull 4 / hammer 7 (Phrygian)
  • The tap resolves to a MELODIC PHRASE, not another tap run — always musical, never mechanical
  • Preferred strings: Gb (str3) and Bb (str4)

PHRYGIAN LEAD RUNS ("Leaving Song Pt. II" style):
  • Fast alternate-picked runs through Phrygian [0,1,3,5,7,8,10] at positions 5, 7, 9
  • The b2 interval connects to the bII chord usage — scale and rhythm are stylistically unified
  • Ascend and descend the Phrygian box; hammer-on ascending, pick descending

AEOLIAN MELODIC LINES ("Girl's Not Grey", "Miss Murder" chorus):
  • Upper strings (Gb/str3, Bb/str4, eb/str5) carry Aeolian melodies
  • 8th-note or dotted-8th spacing — never 16th-note density for primary melody
  • Vibrato applied to held notes; slides (/) mark melodic position shifts

TREMOLO-PICKED DRONE (Burials/Bodies era):
  • Tremolo-pick a root or 5th on a single string (str1 or str2) for 8–16 cols
  • Creates "dense yet distant" atmospheric texture
  • Resolves into a power chord stab or melodic release phrase

━━ ERA QUICK-REFERENCE ━━
Black Sails (1999):  Fast 8th-note chug, bII neighbor stabs, Phrygian aggression, standard tuning
Art of Drowning (2000): Open-Bb pedal + fretted-eb melody, emerging melodic tapping, Eb tuning begins
Sing the Sorrow (2003): Syncopated stabs (NEVER straight 8ths), melodic tap groups of 6, full barre chords
Decemberunderground (2006): Melodic single-note intro → power chord explosion, natural harmonics in chorus
Burials/Bodies (2013–): Sparse, atmospheric, tremolo drone, guitar as texture not lead voice

━━ FEEL ━━
Atmospheric, intentional, dark. This is post-punk intelligence, not metal brute force.
The goal is always melodic counterpoint — the guitar answers the vocal, not competes with it.
Restraint is the technique. One perfectly placed syncopated stab beats eight mechanical 8th notes.`;

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
  tapPatterns,
  tapStrings,
  tapGroupSizes,
  openStringPickingRhythms,
  openStringPedal,
  openStringMelody,
  bIIOffset,
  rhythmProgressions,
  rhythmPatterns,
  tremoloDroneConfig,
  eraStyles,
  songs,
  aiPrompt,
};
