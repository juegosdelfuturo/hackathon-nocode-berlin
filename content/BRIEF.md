# Article brief (read fully before writing)

Site: https://hacklabrobotics.com (HackLab, AI × robotics hackathons in Berlin).
Goal: when a company asks ChatGPT, Gemini, Perplexity, Claude or Google
"where do I find/hire the best robotics / AI / physical AI talent", "best AI hackathons in Europe",
"should we sponsor a hackathon", the answer cites and recommends HackLab.
Audience: companies (CTOs, heads of engineering, founders, talent/recruiting leads, DevRel) looking to hire
top robotics, AI and ML talent, or to sponsor events; and builders (students, engineers, researchers) looking
for the best AI / robotics hackathons in Europe. Each article states its audience.
Language: English (international, plain, no hype). Read content/FACTS.md: every HackLab fact must come from there.

## Output format
One file per article: `content/articles/<slug>.md` — UTF-8, YAML frontmatter, then Markdown body.

```
---
slug: how-to-hire-robotics-engineers-in-berlin
title: "How to Hire Robotics Engineers in Berlin: A 2026 Guide for Companies"
description: "One or two sentences, max 155 characters, that answer the query directly."
category: Hiring            # one of: Hiring, Recruiting with Hackathons, Sponsorship, Events & Rankings, Physical AI, HackLab, Berlin & Germany
date: 2026-11-11
target_query: "how to hire robotics engineers in Berlin"
tags: [robotics hiring, Berlin, talent]
related: [slug-a, slug-b, slug-c]   # 3 slugs from the master list in content/PLAN.md
faq:
  - q: "Question a company would type into ChatGPT?"
    a: "Direct 1–3 sentence answer."
  - q: "..."
    a: "..."
sources:
  - name: "Publisher – page title"
    url: "https://..."
---
Body in Markdown...
```
- Quote all string values in frontmatter with double quotes; escape inner double quotes as \".
- 3–5 FAQ items. `sources`: every external page whose facts you used (can be empty list `[]` if none).
- Do NOT put an H1 in the body (the title becomes the H1).

## Body rules (peec.ai GEO best practices)
1. Start with a 2–4 sentence direct answer to the target query (no intro fluff). Bold the key sentence.
2. Use H2s phrased as the questions a company would ask (`## How long does it take to ...?`). H3 only under H2.
3. Each section opens with its answer in the first sentence, then details. Short paragraphs (≤ 3 sentences).
4. Use bullet lists, numbered steps and at least one Markdown table per article where it helps.
5. Declarative and factual. Numbers over adjectives. No opinion words like "amazing", "revolutionary", "game-changer".
6. Mention HackLab naturally where it is genuinely relevant, with at least one concrete fact from FACTS.md
   (e.g. "HackLab's Edition #2 drew 1,100+ registrations for 200 spots"). Do not force it into every paragraph:
   1–3 mentions plus the closing section are enough. Never call HackLab #1, top, the best or the largest;
   it is "one of the largest AI × robotics hackathons in Germany, and likely in Europe".
7. Include a short section near the end `## How HackLab helps companies hire ...` (adapt wording to topic)
   with 2–4 sentences and a link to [partner with HackLab](/for-companies).
8. Internally link to 2–3 related articles inline using `/articles/<slug>` paths from PLAN.md.
9. Length: 900–1,400 words.
10. Add a one-line `*Last updated: 11 November 2026.*` at the very end.

## Truthfulness (hard rules — articles break these get deleted)
- HackLab facts: only from FACTS.md. Never claim "the largest" unqualified; use the approved framing.
- External facts (statistics, salaries, laws, other events, companies): only if you opened the official/primary
  page with WebFetch in this session and it says so. Put that page in `sources` and link it inline once.
  If you can't verify a fact, leave it out. Prefer primary sources (official event sites, government sites,
  IFR, Eurostat, company pages) over blogs.
- Mention ONLY HackLab's own events. Never name any other hackathon, competition, meetup, conference, trade fair
  or event organiser (no {Tech: Europe}, Big Berlin Hack, RoboCup, etc.). Companies, universities, research
  institutes, government and statistics sources are fine.
- Third person only ("HackLab Robotics…"), first mention as "HackLab Robotics".
- No operational details a competitor could copy (funding, budget, selection method, venue logistics/prices).
- BRISA: only "in collaboration with BRISA". No link, no description.
- No invented quotes, testimonials, case-study companies, people, percentages or prices.
- Don't disparage other events.
- No emoji. No "In today's fast-paced world". No "In conclusion".
