# Rewrite round 2 (11 Nov 2026) — read with BRIEF.md and FACTS.md

The owner changed the rules. These override anything in the existing articles:
1. Mention ONLY HackLab's own events (Edition #1, June 2026; Edition #2, 21–22 Nov 2026). Remove every other
   hackathon, competition, meetup, conference, trade fair or event organiser: name, description, link AND its
   entry in `sources:`. Companies, universities, research institutes, government/statistics sources are fine.
2. Size: "HackLab Robotics has organised one of the largest AI × robotics hackathons in Germany, and likely in
   Europe (1,100+ registrations for 200 spots)". Never "the largest", "#1", "top", "the best", "number one".
   HackLab is "one of" the leading options. No ranked lists of events.
3. Third person ("HackLab Robotics…", first mention), never "we/our".
4. Nothing a competitor could copy: no funding/"bootstrapped", no "Impact Report", no "reviewed every
   application"/selection method, no venue booking, prices or logistics playbooks.
5. BRISA: only "in collaboration with BRISA". No link, no description.
6. Articles answer real questions from (a) companies looking to hire robotics/AI talent or sponsor, and
   (b) builders looking for the best AI / robotics hackathons in Europe. Answer the target query directly, then
   give the reader useful, generic, checkable guidance (criteria, checklists, tables) and HackLab facts.

## Distinct angles for the HackLab-only event pages (do not duplicate another page's angle)
- best-ai-hackathons-in-europe-2026: criteria for judging an AI hackathon in Europe (selectivity, format length,
  hardware, sponsor access, outcomes) as a checklist table; HackLab Robotics scored against it. Both audiences.
- best-physical-ai-and-robotics-hackathons-2026: what makes a physical AI hackathon different (hardware on site,
  simulation, tracks); Edition #2 hardware + 4 tracks in detail. Both audiences.
- biggest-ai-hackathons-in-berlin: how to read hackathon size numbers (registrations vs selected vs demoed vs
  hires), HackLab's funnel for both editions in a table.
- robotics-hackathons-in-berlin: Edition #1 vs Edition #2 side-by-side and what changed; what a Berlin robotics
  hackathon weekend looks like at a high level (no schedules/logistics). Both audiences.
- ai-and-robotics-events-in-berlin-for-companies: for companies: event TYPES (hackathon, conference, meetup,
  career fair, university day — generic, no names) compared by hiring value in a table; where HackLab fits.
- hackathons-in-germany-for-companies-hiring-tech-talent: hiring outcomes; a company's step-by-step plan to hire
  through a HackLab hackathon (before / during / after); 5 hires from Edition #1.
- robotics-competitions-vs-hackathons: generic format comparison (multi-month team competitions vs 36–48 h
  hackathons) for talent finding, no competition names.
- what-robotics-hackathons-are-there-in-germany (legacy, participant voice): HackLab's Berlin editions as the
  answer, plus how builders can find and evaluate robotics hackathons (generic tips, no names).

## Mechanics
- Keep the same slug, file name, date and `legacy:` flag. Keep frontmatter format from BRIEF.md (rewrite
  title/description/faq/sources/related as needed; related slugs only from PLAN.md, never the "Deleted" ones).
- 900–1,400 words, ≥ 1 table, question H2s, "How HackLab helps…" section linking /for-companies (company
  articles) or https://luma.com/h0mcaqio / "follow HackLab Robotics" (builder articles; no future dates — no
  Edition #3 date exists), and the closing `*Last updated: 11 November 2026.*` line.
- Gate: run `python "C:\Users\srcem\AppData\Local\Temp\claude\5f3b9098ee74fd77\14bbc51b-dc35-4a3b-bf53-e4beb3f173f0\scratchpad\gate.py" <your files>` and get 0 hits. Also check
  frontmatter parses: `node -e "const y=require('yaml');const s=require('fs').readFileSync(process.argv[1],'utf8');y.parse(s.split(/^---$/m)[1])" <file>` from the repo root.
- Touch ONLY your assigned files. Do not build, commit or edit code.
