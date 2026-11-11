# Likho Prosody Benchmark — Outreach Message for Reviewer Candidates (Pre-Approval, October 2026)

**Purpose:** Prepare a message for user approval before any candidate contact. This message template is designed to be reviewed, edited and approved by you (the project owner) before any email is sent. No candidate receives this, or any other communication, until you explicitly authorize outreach.

**Pilot status (for context only — do not include in final message until approved):**
- Ten items (`LKH-PRO-0001`–`LKH-PRO-0010`) are `goldStatus: pilot-unadjudicated`, all forms `supported: false`.
- Items were selected *because* the engine accepted them (distance 0). Selection bias is known.
- No independent annotator or adjudicator has participated.
- Engine pins describe uncommitted tree at `5ae5519`; nothing committed/pushed to hosted CI.

**Authorization state:**
- Public research to identify candidates: prepared (shortlist in `docs/PROSODY_BENCHMARK_REVIEWER_SHORTLIST_2026-10.md`).
- Contacting candidates: **NOT authorized** by this update.
- Packet distribution, hiring, fees, commit, push, hosted CI: **NOT authorized**.

---

## 1. Outreach message template (ready for your edit/approval)

Subject line options (choose one; all are placeholders until you approve):

- `Likho Urdu Prosody Benchmark — Independent Reviewer Expression of Interest`
- `Invitation: Independent Annotation Pilot for Urdu Prosody Study`
- `Request: Qualified Reviewer for Likho Prosody Benchmark (LKH-005)`

---

**Email body template** (replace `[BRACKETED]` sections with your approved content; do not send until all brackets are resolved):

```
Dear [Candidate Name],

I am writing on behalf of the Likho project (https://github.com/getmorefromlife/likho). 
Likho is an offline-first computational studio for Urdu poetry composition and prosody analysis, 
featuring real-time metre scansion, rhyme management and a source-attributed pronunciation 
lexicon of 40,000+ Attested words.

We are conducting an internal review of a ten-item benchmark pilot (LKH-005) to exercise 
our annotation schema and review protocol. The pilot uses source-exact public-domain Ghalib 
verses from Urdu Wikisource, pinned to specific revisions. Every item currently records 
`goldStatus: pilot-unadjudicated` and `supported: false` — no form is claimed as benchmark-supported.

Why we are reaching out:

Your public work in Urdu prosody [reference specific public evidence: e.g. "your 2021 article 
on caesura in Ghazal form" or "your regular metre column in X publication" or "your Ghalib 
metre blog series"] came to our attention, and we believe you would be well positioned to 
contribute to this review exercise.

What the review involves:

- You would receive ten source-exact Urdu lines, each pinned to a specific Wikisource revision.
- You would independently determine the metre (if any), word-level scansion, licensed reading 
  rules, and a verdict for each line (admissible / invalid-against-target / invalid-against-all 
  / unresolved / out-of-scope).
- You would record uncertainty codes and elapsed minutes per item.
- You would not see the engine's metre assignment, target pattern, distances, actual patterns 
  or word readings at any point.
- You would not see the other reviewer's worksheet or any prior benchmark result.
- The total time commitment is approximately 10–30 minutes per item (10 items), including 
  source verification and write-up.
- All work is local; no commit, push or hosted CI is involved at this stage.

Independence conditions (you would confirm these directly if you proceed):

- You are qualified to analyse Urdu prosody and are not the Likho engine author.
- You have not seen the engine's output, suggested readings or prior benchmark result for 
  these items.
- You will record a decision before seeing the other reviewer's worksheet.
- You have no undisclosed financial or authorship interest in the outcome.
- You are willing to report the known selection bias (engine-accepted lines only) with any result.

What we would need from you:

- A brief confirmation that the above independence conditions can be met.
- Your preferred role: annotator (first pass on all ten items) or adjudicator (review both 
  annotator worksheets and resolve disagreements).
- Your availability window (estimated total time: 1.5–5 hours, spread over your choice of days).
- Any conflicts of interest to disclose (financial interest in Likho, Arouz/Aruuz, Ghalib 
  publications, or institutional ties to the engineering team).

If this aligns with your expertise and availability, please reply to this email and we will:
1. Send you the reviewer packet (blank worksheets only — no engine output, no benchmark data,
   no filled-in results).
2. Send the review protocol and instructions document.
3. Answer any questions you have about the process.

If, after reviewing the materials, you decide this is not a good fit, no further action is needed.

Thank you for your time and consideration.

Best regards,

[Your Name]
Likho Project Owner
[Your institutional affiliation, if any — optional]
[Contact email you prefer candidates to use]
```

---

## 2. Bracket sections that must be resolved before approval

| Bracket | What to resolve | Example |
| --- | --- | --- |
| `[Candidate Name]` | Candidate's full name (from your selected shortlist). | `Dr. Mahboob Khan` |
| `[Reference to public work]` | Specific public evidence that caught your eye. | `your 2021 article "Caesura and Variation in Ghazal Form"` |
| `[Your Name]` | Your name as project owner. | `Syed Rizvi` |
| `[Your institutional affiliation]` | Your organization (optional but helpful for credibility). | `Independent / Likho project` |
| `[Contact email]` | The email address candidates should reply to. | `likho.benchmark@[your-domain].org` |
| `[Availability window]` | Specific days/times the candidate is available, or phrase "flexible". | `Flexible over the next three weeks` or `Available weekends only` |
| `[Role preference]` | Which role you want to ask about (annotator/adjudicator, or "either"). | `We would prefer an annotator, but are open to adjudicator if the candidate is interested.` |

---

## 3. Decision points (you resolve one of the following)

After you fill the brackets and review the message, choose **one** of these outcomes:

| Option | What happens next |
| --- | --- |
| **A: Approve as-is** | The message is ready to send. You authorize outreach to the single candidate named. No further changes needed from me. |
| **B: Edit then approve** | You edit the bracket sections (I can re-render the template with your changes) and then approve. I wait for your revised message. |
| **C: Request revisions** | You tell me what needs to change (tone, content, structure, independence framing, etc.). I revise the template and you re-review. |
| **D: Pause — no contact yet** | You are not ready to approve any outreach yet. I keep the template frozen and wait for your signal. |

---

## 4. Current shortlist (for your reference only — do not include candidate names in the message until you approve Option A)

If you need to select which candidate(s) to approach, the four public candidates from `docs/PROSODY_BENCHMARK_REVIEWER_SHORTLIST_2026-10.md` are:

1. **Dr. Mahboob Khan** — Professor of Urdu, published on Ghalib metre (email: `mahboob.khan@[university].edu`)
2. **Prof. Sarah Ahmed** — Classical Urdu metre specialist (email: `s.ahmed@[research-inst].ac.uk`)
3. **Mr. Farhan Ali** — Independent Urdu scholar and poet (email: `f.ali@[independent-domain].org`)
4. **Dr. Komal Soofi** — Urdu linguistics and phonology (email: `k.soofi@[university].pk`)

You may select one, some, or all of these. The message template above is written for **a single candidate** at a time; for multiple candidates, you would send separate emails (or a single email with BCC, but that is your decision).

---

## 5. What this message does NOT include (and must not)

- **No pilot benchmark.json data** — the message does not reference item texts, metres, or engine results.
- **No packet attachment** — the blank worksheets are not included until after independence is confirmed and packets are distributed (a later stage).
- **No compensation or fee discussion** — the message does not mention payment, stipends, or honoraria. If such terms are needed, they would be a separate approved communication.
- **No commitment** — the message does not promise anything beyond the described review exercise. No item is gold, no form is benchmark-supported, and the pilot cannot support accuracy claims.

---

## 6. Next steps (your decision)

| Step | Action | Your call |
| --- | --- | --- |
| **1. Review the template** | Read the outreach message above, fill the bracketed sections, and decide on Option A–D. | You decide. |
| **2. Tell me your decision** | Let me know which outcome (A–D) you choose, and any edits you want me to make. | You tell me. |
| **3. I act accordingly** | - If **A**: I note the approval and you may proceed to contact the candidate (per your authorization).<br>- If **B**: I re-render the template with your changes and you re-review.<br>- If **C**: I revise based on your feedback and you re-review.<br>- If **D**: I freeze the template and wait for your signal. | I execute. |

No contacting, packet distribution, hiring, fees, commit, push or hosted CI is authorized by this update. All work remains local until you explicitly authorize otherwise.