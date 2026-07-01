---
name: agent-postmortem
description: Run an AI-assisted post-incident review. Produces a postmortem doc the team can review, with timeline, root cause, contributing factors, and action items.
command: postmortem
---

# agent-postmortem

Drive a structured postmortem after a production incident.

## Inputs

- Incident summary (when it started, when it ended, who was affected).
- Source signals: alerts, dashboards, logs, customer reports.
- Any chat / war-room transcripts the user shares.

## Steps

1. **Confirm the basics**: incident ID/title, severity, start and end
   times (ISO 8601 with timezone), services affected, customer impact
   (counts + duration), and primary on-call.
2. **Build the timeline**. Pull from logs and chat. Each entry has a
   timestamp, what happened, what was observed, what was tried. No prose
   essays — bullet points.
3. **Identify the root cause**. Distinguish *trigger* (what started the
   incident) from *root cause* (why the system could be put into the bad
   state). Note contributing factors.
4. **Score the response**. What worked? What slowed us down? Were
   runbooks current? Were monitors useful?
5. **Produce action items**. Each has an owner, a due date, and an
   acceptance criterion. Avoid generic "improve monitoring" — be
   specific.
6. **Blameless framing**. Describe systems, not people. "The deploy job
   accepted an empty diff" not "<name> pushed a bad commit."

## Output

Write `docs/postmortems/<YYYY-MM-DD>-<slug>.md`. Include sections:

- Summary (1 paragraph)
- Impact (numbers)
- Timeline
- Root cause + contributing factors
- What went well / what hurt
- Action items (table: owner, due, acceptance)
- Open questions

## Confidence

```json
{
  "completeness": 0,
  "ambiguity": 0,
  "risk": 0,
  "test_coverage": 0,
  "dependencies": 0,
  "notes": "Postmortems score `test_coverage` against whether each action item has a verifiable acceptance criterion."
}
```
