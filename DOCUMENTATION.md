# قلم و قافیہ | Qalam & Qafiya (Likho)
## Comprehensive Technical Architecture, Engine Specifications & Developer Guide

---

## 📑 Table of Contents
1. [Executive Summary & Core Philosophy](#1-executive-summary--core-philosophy)
2. [High-Level Architectural Overview](#2-high-level-architectural-overview)
3. [Ilm-e-Arooz Prosody Engine (`aroozEngine.ts`)](#3-ilm-e-arooz-prosody-engine)
   - [Phonetic Core Principles](#phonetic-core-principles)
   - [The 8 Classical Phonetic Rules](#the-8-classical-phonetic-rules)
   - [Arkan-Aware Meter Matching](#arkan-aware-meter-matching)
   - [Terminal Sakin Weight Normalization](#terminal-sakin-weight-normalization)
4. [Massive Offline Poetic Lexicon (`AroozLexiconService`)](#4-massive-offline-poetic-lexicon)
   - [Folder `qaafiyah 2` Ingestion & Zero-Duplicate Guarantee](#folder-qaafiyah-2-ingestion--zero-duplicate-guarantee)
   - [Pre-Compilation Pipeline (`generateLexicon.js`)](#pre-compilation-pipeline)
   - [Multi-Weight Dynamic Scansion](#multi-weight-dynamic-scansion)
5. [Reverse-Rhyme Search Engine (`qafiyaEngine.ts`)](#5-reverse-rhyme-search-engine)
   - [Phonetic Suffix & Harf-e-Rawi Extraction](#phonetic-suffix--harf-e-rawi-extraction)
   - [Af'ail & Bahr Categorization](#afail--bahr-categorization)
   - [Real-Time Contextual Detection from Canvas](#real-time-contextual-detection-from-canvas)
6. [Interactive Visual Slot / Wildcard Rhyme Builder (`slotRhymeBuilder.ts`)](#6-interactive-visual-slot--wildcard-rhyme-builder)
   - [Letter Slot State Machine](#letter-slot-state-machine)
   - [Classical Ilm-ul-Qawafi Presets](#classical-ilm-ul-qawafi-presets)
   - [Regex Querying](#regex-querying)
7. [Zero-Backend Multi-Format File Ingestion Engine (`fileIngestionService.ts`)](#7-zero-backend-multi-format-file-ingestion-engine)
   - [Supported Formats (ODT, TXT, CSV/TSV)](#supported-formats)
   - [In-Browser Decompression & XML Parsing](#in-browser-decompression--xml-parsing)
   - [IndexedDB Personal Rhyme Bank](#indexeddb-personal-rhyme-bank)
8. [In-App Urdu Phonetic Keyboard Engine (`phoneticKeymap.ts`)](#8-in-app-urdu-phonetic-keyboard-engine)
   - [CRULP / NLA Standards Implementation](#crulp--nla-standards-implementation)
   - [Diacritics, Punctuation & Safe OS Passthrough](#diacritics-punctuation--safe-os-passthrough)
9. [UI/UX Design System & Typography Standards](#9-uiux-design-system--typography-standards)
   - [Nastaliq Diacritical Clearance Rules](#nastaliq-diacritical-clearance-rules)
   - [Theme System & High-Contrast Visual Excellence](#theme-system--high-contrast-visual-excellence)
10. [Development, Build & Deployment Workflows](#10-development-build--deployment-workflows)

---

## 1. Executive Summary & Core Philosophy

**قلم و قافیہ (Qalam & Qafiya)** is a specialized, zero-compromise digital workstation engineered for classical Urdu poetry, metrics (*علمِ عروض*), and rhyme sciences (*علمِ قوافی*). 

Unlike generic word processors or cloud-dependent AI tools, Qalam & Qafiya operates on three unyielding principles:
1. **Mathematical Determinism:** Scansion adheres strictly to centuries-old classical Arabic/Urdu metrical rules within the documented reading rules and source coverage.
2. **Local Processing:** 100% of prosody scansion, reverse-rhyming, wildcard slot evaluations, and file parsing executes locally in the client browser. No verses or files are ever sent to an external server.
3. **Typographic Respect:** Urdu Nastaliq script possesses tall vertical ascenders and low descenders. Our UI engine guarantees complete diacritical clearance without clipped dots (*نقطے*) or truncated diacritics (*اعراب*).

---

## 2. High-Level Architectural Overview

The application is built using **React 19**, **TypeScript 5.7**, **TailwindCSS v4**, and **Vite 6**.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             USER INTERFACE LAYER                            │
│  ┌───────────────────────────────┐  ┌────────────────────────────────────┐  │
│  │    Poetry Canvas (Editor)     │  │    Literary Companion (Sidebar)    │  │
│  │  - Nastaliq Multi-line Canvas │  │  - Massive Lexicon (40,434 keys)  │  │
│  │  - Erab & Typographic Toolbar │  │  - Visual Slot Rhyme Builder       │  │
│  │  - Per-Misra Scansion Cards   │  │  - Client-Side File Ingestion      │  │
│  │  - CRULP Phonetic Keyboard    │  │  - Prosody Bahr Explorer           │  │
│  └───────────────┬───────────────┘  └─────────────────┬──────────────────┘  │
└──────────────────┼────────────────────────────────────┼─────────────────────┘
                   │                                    │
┌──────────────────▼────────────────────────────────────▼─────────────────────┐
│                           CORE COMPUTATION ENGINES                          │
│  ┌───────────────────────────────┐  ┌────────────────────────────────────┐  │
│  │       aroozEngine.ts          │  │       qafiyaEngine.ts              │  │
│  │  - Phonetic Syllabification   │  │  - Harf-e-Rawi Suffix Extractor   │  │
│  │  - Documented Contextual Readings    │  │  - Af'ail Metrical Grouping        │  │
│  │  - Arkan-Aware Meter Matching │  │  - Real-time Contextual Matcher    │  │
│  └───────────────┬───────────────┘  └─────────────────┬──────────────────┘  │
│  ┌───────────────▼───────────────┐  ┌─────────────────▼──────────────────┐  │
│  │     slotRhymeBuilder.ts       │  │    fileIngestionService.ts         │  │
│  │  - 3-State Letter Slot Matrix │  │  - Client DecompressionStream ODT  │  │
│  │  - Classical Presets Compiler │  │  - Strict Zero-Duplicate Ingestion │  │
│  │  - Compiled Regex Search │  │  - IndexedDB Persistence           │  │
│  └───────────────────────────────┘  └────────────────────────────────────┘  │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼──────────────────────────────────────────┐
│                             DATA & ASSET LAYER                              │
│  ┌───────────────────────────────┐  ┌────────────────────────────────────┐  │
│  │    Source pronunciation JSON  │  │   IndexedDB (Browser Local Storage)│  │
│  │  - 40,434 Source-attributed Keys      │  │  - User Custom Dictionary          │  │
│  │  - Pre-compiled Weights       │  │  - Imported File Rhyme Collections │  │
│  └───────────────────────────────┘  └────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Ilm-e-Arooz Prosody Engine

The current implementation is specified in [PROSODY_REPAIR.md](PROSODY_REPAIR.md). `urduPhonology.ts` preserves vocalization; `prosodicReadings.ts` generates documented contextual readings; `aroozEngine.ts` performs constrained lattice alignment; and `meterRepairEngine.ts` rescans real edits against a fixed named meter.

The 50-form shared catalog replaces duplicated meter tables and incorrectly attributed examples. The engine does not fabricate unknown-word weights, replace familiar verses with templates, or treat arbitrary foot substitutions as licensed zihafat. Word sources and rules actually used are exposed in the editor. Unknown pronunciation blocks automatic repairs.

## 4. Source-attributed Offline Pronunciation Dictionary

40,434 keys and 43,556 reading records come from a pinned, checksum-checked Aruuz lexical-table extraction. 1,007 unsupported/impossible source records remain inspectable in a quarantine file. Attribution is not independent scholarly certification.

`npm run generate:lexicon` builds compatibility assets from this source; it does not generate weights from spelling length. The local qaafiyah folder is vocabulary material, not pronunciation evidence. TXT/CSV/ODT word-list ingestion preserves unweighted words. Explicit personal weights are validated atomically and retain unreviewed provenance. Schema-v2 backups keep source attribution distinct from personal entries.

The adapted data's GPL-2.0 notice, license text and corresponding editable dictionary/conversion source are available under `public/licenses/`. See [the full source audit and reproduction contract](PROSODY_REPAIR.md).

---

## 5. Reverse-Rhyme Search Engine

Located in [`src/services/qafiyaEngine.ts`](file:///Users/syedrizvi/Documents/my%20website%20projects/Likho/src/services/qafiyaEngine.ts).

### Phonetic Suffix & Harf-e-Rawi Extraction
The engine strips diacritics, analyzes the phonetic ending (*حرفِ روی* and preceding vowel movements like *ام، ان، ار، ات، یت، ال، ور، یر*), and isolates the true rhyming core.

### Af'ail & Bahr Categorization
Matched rhymes are instantly sorted into classical metrical bins:
- `فَعُولْ` (`- =`): کلام، پیام، سلام، مقام، دوام، تمام
- `فَعِیلَت` (`- = =`): حقیقت، بصیرت، شریعت، طریقت، طبیعت، غنیمت، عزیمت
- `فَاعِلُن` (`= - =`): شاہد، عابد، قاصد، زاہد
- `مُسْتَفْعِلُن` (`= = - =`): پروردگار، آموزگار

### Real-Time Contextual Detection from Canvas
As the user types into the Poetry Canvas, the engine identifies the Radif (*ردیف*) and previous Qafiya words, auto-populating the sidebar with congruent rhymes matching the meter of the poem.

---

## 6. Interactive Visual Slot / Wildcard Rhyme Builder

Located in [`src/services/slotRhymeBuilder.ts`](file:///Users/syedrizvi/Documents/my%20website%20projects/Likho/src/services/slotRhymeBuilder.ts) and [`src/components/companion/VisualSlotRhymeBuilder.tsx`](file:///Users/syedrizvi/Documents/my%20website%20projects/Likho/src/components/companion/VisualSlotRhymeBuilder.tsx).

### Letter Slot State Machine
Users can break any target rhyme into interactive visual letter boxes:
$$\boxed{\text{ا}} \quad \boxed{\text{ی}} \quad \boxed{\text{م}} \quad \boxed{\text{ا}} \quad \boxed{\text{ن}}$$

Each slot cycles through 3 operational states on click:
1. **Locked (`state: 'locked'`):** Solid amber background. This exact Urdu letter must appear in this position.
2. **Wildcard (`state: 'any'`):** Dashed border with `*`. Any valid Urdu character may occupy this slot.
3. **Vowel Only (`state: 'vowel'`):** Constrained to long vowels (*ا، و، ی، ے*).
4. **Consonant Only (`state: 'consonant'`):** Constrained to non-vowel consonants.

### Classical Ilm-ul-Qawafi Presets
One-click buttons configure slots according to classical Arabic/Urdu rhyme theory:
- **صرف حرفِ روی (Rawi Only):** Locks only the final letter, turning preceding letters into wildcards.
- **مردف (ردف و روی):** Locks the penultimate vowel + final consonant (e.g., `* * ا ن`).
- **تاسیس و دخیل (Tasees & Dakhil):** Locks the foundation Alif, leaves Dakhil open, locks Rawi (e.g., `* ا * ر`).

### Regex Querying
The slot configuration compiles into an anchored, Unicode-safe regular expression:
```typescript
const regex = compileSlotRegex(slots, matchExactLength);
// Example: /^[\u0600-\u06FF]ی[\u0600-\u06FF]ان$/
```
This query searches the active in-memory vocabulary; no unmeasured latency guarantee is implied.

---

## 7. Zero-Backend Multi-Format File Ingestion Engine

Located in [`src/services/fileIngestionService.ts`](file:///Users/syedrizvi/Documents/my%20website%20projects/Likho/src/services/fileIngestionService.ts) and [`src/components/companion/FileImportModal.tsx`](file:///Users/syedrizvi/Documents/my%20website%20projects/Likho/src/components/companion/FileImportModal.tsx).

### Supported Formats
- **`.txt`:** Plain text documents encoded in UTF-8.
- **`.csv` / `.tsv`:** Comma- or tab-delimited word lists.
- **`.odt`:** OpenDocument Text documents created in LibreOffice, OpenOffice, or Google Docs.

### In-Browser Decompression & XML Parsing
Rather than requiring a server-side conversion API, `.odt` files are decompressed natively in the user's browser:
1. Read the uploaded file as an `ArrayBuffer`.
2. Locate the compressed `content.xml` stream inside the ZIP archive.
3. Decompress using the browser's native `DecompressionStream('deflate-raw')`.
4. Parse text nodes with `DOMParser` and extract clean Urdu words.

### IndexedDB Personal Rhyme Bank
Extracted words are stripped of diacritics, deduplicated, and stored in the browser's local **IndexedDB** under `userRhymeBank`. They persist across sessions and seamlessly integrate into the user's active Qafiya Tray.

---

## 8. In-App Urdu Phonetic Keyboard Engine

Located in [`src/utils/phoneticKeymap.ts`](file:///Users/syedrizvi/Documents/my%20website%20projects/Likho/src/utils/phoneticKeymap.ts) and [`src/components/editor/PhoneticKeyboardGuideModal.tsx`](file:///Users/syedrizvi/Documents/my%20website%20projects/Likho/src/components/editor/PhoneticKeyboardGuideModal.tsx).

### CRULP / NLA Standards Implementation
Enables writing Urdu on standard physical QWERTY keyboards without altering the operating system language settings.

| Key | Lowercase (Normal) | Uppercase (Shift) |
|:---:|:------------------:|:-----------------:|
| `a` | ا (Alif) | آ (Alif Madda) |
| `b` | ب (Bay) | ؓ (Razi-Allahu) |
| `c` | چ (Chey) | ث (Say) |
| `d` | د (Daal) | ڈ (Daal retroflex) |
| `e` | ع (Ain) | ؑ (Alaihis-Salam) |
| `f` | ف (Fay) | ٘ (Noon Ghunnah Mark) |
| `g` | گ (Gaaf) | غ (Ghain) |
| `h` | ح (Bari Hey) | ھ (Do-Chashmi Hey) |
| `i` | ی (Choti Yeh) | ٰ (Khari Zabar) |
| `j` | ج (Jeem) | ض (Zuaad) |
| `k` | ک (Kaaf) | خ (Khay) |
| `l` | ل (Laam) | ؐ (Sallallahu-Alaihi) |
| `m` | م (Meem) | ٌ (Do Zabar / Tanween) |
| `n` | ن (Noon) | ں (Noon Ghunnah) |
| `o` | ہ (Gol Hey) | ۃ (Teh Marbuta) |
| `p` | پ (Pay) | ُ (Pesh) |
| `q` | ق (Qaaf) | ذ (Zaal) |
| `r` | ر (Ray) | ڑ (Ray retroflex) |
| `s` | س (Seen) | ص (Suaad) |
| `t` | ت (Tay) | ٹ (Tay retroflex) |
| `u` | ء (Hamza) | ئ (Hamza on Yeh) |
| `v` | ط (Toay) | ظ (Zoay) |
| `w` | و (Waw) | ّ (Tashdeed) |
| `x` | ش (Sheen) | ژ (Zhay) |
| `y` | ے (Bari Yeh) | َ (Zabar) |
| `z` | ز (Zay) | ذ (Zaal) |

### Diacritics, Punctuation & Safe OS Passthrough
- Native OS shortcuts (`Ctrl+C`, `Ctrl+V`, `Cmd+Z`, `Cmd+A`) are preserved via event bypass.
- Toggle shortcut: `Ctrl + Space` or `Alt + K`.
- In-canvas visual indicator: `[⌨️ صوتی کی بورڈ: آن / آف]`.

---

## 9. UI/UX Design System & Typography Standards

### Nastaliq Diacritical Clearance Rules
Urdu Nastaliq typography (Mehr Nastaliq Web) requires strict CSS accommodations to prevent overlapping and clipping:
- **Line-Height:** Set generously to `2.6` to `2.8` on all poetry surfaces.
- **Padding:** Vertical padding `py-4` prevents top and bottom dots from truncating.
- **Direction & Alignment:** Strict `dir="rtl"` with right-to-left optical balancing.

### Theme System & High-Contrast Visual Excellence
The application supports three finely tuned color schemes:
1. **کاغذ (Sepia Parchment):** Warm papyrus background (`#fbf8f1`) with deep umber text and golden accents.
2. **شبینہ (Dark Obsidian):** Velvet charcoal background (`#161514`) with warm ivory text.
3. **سادہ (Minimal White):** Pure modernist editorial white (`#ffffff`) with stark slate typography.

#### WCAG Contrast Rule for Golden Chips
When an active button or chip uses the dark golden/bronze accent background (`bg-[var(--accent-gold)]`), the font color is strictly set to **`text-white font-bold`** (never black) to guarantee high contrast across all lighting environments.

---

## 10. Development, Build & Deployment Workflows

### Essential NPM Scripts
```bash
# 1. Start local Vite development server
npm run dev

# 2. Re-generate public/data/urdu_lexicon.json (40,434 keys)
npm run generate:lexicon

# 3. Type-check TypeScript and build production bundle
npm run build

# 4. Preview production build locally
npm run preview
```

### Vercel Deployment Configuration
The app is optimized for zero-config Vercel deployment:
- Framework Preset: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`
- Custom Domain / Project Name: Recommended as `likho.vercel.app` (configurable in Vercel Project Settings $\rightarrow$ Domains).

---
*قلم و قافیہ — اسٹوڈیو برائے شعر و ادب*  
*Document Version: 1.0.0 | Updated: October 2026*
