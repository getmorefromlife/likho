# Likho (قلم و قافیہ) — Independent Sovereign Urdu Lexicon Plan

**Document:** `docs/INDEPENDENT_SOVEREIGN_LEXICON_PLAN.md`  
**Created:** November 12, 2026  
**Status:** Parallel Strategic Track (Current GPL-2.0 Aruuz & Qaafiyah vocabularies remain active until cutover)  
**Goal:** Build a **100% proprietary, copyrightable, clean-room Urdu Prosodic & Rhyme Dictionary (`60,000+` words)** owned exclusively by Likho, eliminating all third-party GPL-2.0 (`AruuzDB.sql`) and external desktop utility (`Urdu_Dict.txt`) dependencies when ready for commercial IP sale or closed-source distribution.

---

## 1. Dual-Engine Parallel Architecture (Zero Disruption While Building)

While we build the new dictionary in the background, the live app continues using the current dictionaries without any interruption:

```
┌──────────────────────────────────────────────────────────┐
│                 Likho Runtime Scansion & Rhyme           │
│     (urduPhonology.ts · prosodicReadings.ts · qafiya)    │
└───────────────────────────┬──────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
┌───────────────────────────┐   ┌───────────────────────────┐
│   ACTIVE MODE (Current)   │   │  SOVEREIGN MODE (Target)  │
│ • aruuz-dictionary.json   │   │ • likho-sovereign-lex.json│
│   (GPL-2.0 attributed)    │   │   (100% Clean-Room Owned) │
│ • qaafiyahVocabulary.json │   │ • Poet-Attested Classical │
│   (Unweighted rhymes)     │   │   Diwan Rhyme Corpus      │
└───────────────────────────┘   └───────────────────────────┘
```

- We add a build-time/runtime flag (`LEXICON_SOURCE=legacy | hybrid | sovereign`).
- During development (`hybrid` mode), we measure coverage of `likho-sovereign-lex.json` against real poems until it reaches **100% parity (or superiority)** over the legacy data, then flip the switch to `sovereign` and delete the legacy files.

---

## 2. Why We Can Build This 10x Faster Than Anyone Else

Previously, building a 50,000-word Urdu scansion dictionary required humans to manually type `-=-` or `==` for every word.

**Likho already solved the hardest part:**
Your handwritten **[urduPhonology.ts](../src/services/urduPhonology.ts)** engine deterministically compiles **any vocalized Urdu word** (*اعراب شدہ لفظ* — with *zabar, zer, pesh, tashdid, jazm/sukun*) into exact syllables (`CV`, `CVC`, `CVV`, `CVCC`, `CVVC`) and metrical weights (`-` and `=`).

Therefore, **we do not need to manually write `-` and `=` for 60,000 words.**  
We only need **clean-room vocalized Urdu headwords and phonetic transliterations**, and `urduPhonology.ts` compiles the metrical weights automatically!

---

## 3. The 5 Clean-Room Pipelines to Build 60,000+ Words

### Pipeline 1: 19th-Century Public-Domain Classical Dictionaries (~35,000 Root Words)
Works published before 1929 are **100% in the Public Domain worldwide** (zero copyright or copyleft restrictions):
1. **John T. Platts — *A Dictionary of Urdu, Classical Hindi, and English* (1884):**
   - Digitized in the public domain (University of Chicago DSAL / Internet Archive).
   - Crucially, Platts records **every Urdu word in Perso-Arabic script PLUS exact Latin phonetic transliteration** (`muḥabbat`, `ḵẖudā`, `ārzū`, `shāʻir`, `dil`, `qalam`, `آئِینہ / ā'īna`).
   - Because Latin phonetic transliteration explicitly marks every short vowel (`a, i, u`), long vowel (`ā, ī, ū, e, o`), geminate consonant (`bb`, `dd`), and nasal (`ṉ`), a deterministic script converts Platts' public-domain transliteration directly into **fully vocalized Urdu (`مُحَبَّت`)** and compiles its exact scansion weight via `urduPhonology.ts`!
2. **Francis Steingass — *Comprehensive Persian-English Dictionary* (1892, Public Domain):**
   - Supplies all classical Persian literary compounds, *izafat* stems, and poetic vocabulary used in Urdu ghazals.
3. **Maulvi Syed Ahmad Dehlvi — *Farhang-e-Asafiya* (1892–1908) & Nayyar Kakorvi — *Noor-ul-Lughat* (1924, Public Domain):**
   - Classical Urdu orthographic and pronunciation statements (*"بفتحِ اوّل و سکونِ ثانی"*), parsed into explicit diacritics.

### Pipeline 2: Deterministic Urdu Morphological Inflection Expander (12,000 Stems → 45,000+ Words)
In Urdu, once a root stem's vocalization is known, its inflected forms follow strict phonological rules:
- **Nouns & Adjectives:**
  - Singular `کِتَاب (-=-)` → Plural `کِتَابیں (-==)`، Oblique `کِتَابوں (-==)`.
  - Masculine `-ā` stems `سِتَارَہ / سِتَارا (-==)` → `سِتَارے (-==)`، `سِتَاروں (-==)`.
- **Verbs (المصادر و الصیغ):**
  - From 600 core Urdu verb stems (`لِکھنا`, `دیکھنا`, `سُننا`, `چَلنا`, `گُزَرنا`, `بِکھَرنا`), our morphological generator automatically produces all 40+ tense/aspect/gender/number forms (`لِکھا`, `لِکھی`, `لِکھے`, `لِکھیں`, `لِکھو`, `لِکھوں`, `لِکھتا`, `لِکھتی`, `لِکھتے`, `لِکھوایا`, etc.) with **100% exact diacritics, syllable weights, and rhyme endings**.

### Pipeline 3: Reverse Meter Deduction from Public-Domain Classical Diwans (Poet-Attested Rhymes & Weights)
This is a signature innovation unique to **Likho**:
- We ingest public-domain classical Urdu poetry from **Urdu Wikisource** (*Diwan-e-Ghalib*, *Kulliyat-e-Mir*, *Diwan-e-Momin*, *Diwan-e-Zauq*, *Dagh Dehlvi*, *Bang-e-Dara / Bal-e-Jibril / Zarb-e-Kalim* by Allama Iqbal).
- **How Reverse Meter Deduction (*معکوس عروضی استخراج*) Works:**
  1. Every classical ghazal has a known meter (e.g. `فاعلاتن فاعلاتن فاعلاتن فاعلن`).
  2. When our dynamic-programming scanner (`prosodyEngine.ts`) scans a line where 6 of 7 words are known, the meter **mathematically constrains the exact weight of the remaining word**.
  3. Furthermore, every second line (*مصرعِ ثانی*) of every classical ghazal gives us **authentic, master-poet-attested Qafiya sets** (along with the exact couplet where Mir, Ghalib, or Iqbal used that rhyme!).
  4. This creates a **Classical Poet-Attested Rhyme Dictionary**—far richer and more authoritative than a flat word list—which you can copyright as an original curated literary database.

### Pipeline 4: Permissive Open-Data Phonetic Sources (Non-GPL)
To fill modern conversational Urdu vocabulary without touching any GPL-2.0 source:
- **WikiPron / Kaikki Wiktionary IPA Extracts (`CC-BY-SA` / Public Domain facts):** IPA strings (`/mʊ.ɦəb.bət̪/`) mapped directly to `urduPhonology.ts` syllables.
- **Universal Dependencies Urdu (`UD_Urdu-UDTB`):** Open-access morphological lemmas and part-of-speech tags (useful for strengthening our `meterRepairEngine.ts` grammar guards!).

### Pipeline 5: In-App Poet Workbench & Automated Audit (`LexiconManagerModal.tsx`)
- Any word with multiple valid poetic readings or ambiguity is flagged into a review queue.
- Using your existing `LexiconManagerModal.tsx` (or a batch CLI review tool), you can approve or adjust readings and export signed snapshots directly into `src/data/sovereign/likho-lexicon.json`.

---

## 4. Phased Implementation Roadmap

| Phase | Milestone | Output Artifact | Target Word Count |
| :--- | :--- | :--- | :--- |
| **Phase 1 (Done — Batch 1)** | **Clean-Room Phonological & Morphological Compiler (`v0.1.0-batch1`)** | `scripts/build-sovereign-lexicon.mjs` + `src/data/sovereign/likho-sovereign-lexicon.json` | **12,976 unique words** (13,071 readings) |
| **Phase 2 (Done — Batch 2)** | **Dual-Purpose Literary Dictionary + Arabic Triliteral Paradigms (`v0.2.0-batch2`)** | `src/services/sovereignLexiconService.ts` + `src/components/companion/ThesaurusTab.tsx` + `src/services/aroozLexiconService.ts` | **30,916 unique words** (31,268 vocalized & defined entries) |
| **Phase 3 (Done — Batch 3)** | **160 Triliteral Root Paradigms (18 Forms) + Classical Poetic Stems (`v0.3.0-batch3`)** | `likho-sovereign-lexicon.json` + `likho-sovereign-lexicon-part2.json` | **51,226 unique words** (52,128 vocalized & defined entries) |
| **Phase 4 (Done — Batch 4)** | **Classical Diwan Vocabulary + 3-Shard 65,000+ Clean-Room Dictionary (`v0.4.0-batch4`)** | `likho-sovereign-lexicon.json` + `part2.json` + `part3.json` | **65,203 unique words** (66,600 vocalized & defined entries) |
| **Phase 5 (Done — Batches 5, 6 & 7)** | **Core Urdu Grammar/Pronouns/Auxiliaries + `-اں` Nasal Contractions + `-ی` Nisbat + 100% Ghalib Benchmark Parity (`v0.6.0-batch6-7`)** | `likho-sovereign-lexicon.json` + `part2.json` + `part3.json` | **68,037 unique words** (69,537 vocalized & defined entries; **64/64 Ghalib benchmark words covered**) |

