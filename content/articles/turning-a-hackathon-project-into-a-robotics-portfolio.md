---
slug: turning-a-hackathon-project-into-a-robotics-portfolio
title: "Turning a Hackathon Project into a Robotics Portfolio That Gets You Hired"
description: "Turn a hackathon project into a robotics or AI job: publish a clean repo, a short demo video and a write-up of your role, then follow up with sponsors."
category: For Builders
date: 2026-11-11
target_query: "use a hackathon project to get a robotics / AI job"
tags: [robotics portfolio, AI jobs, hackathon project, GitHub, demo video, careers, builders]
related: [will-a-hackathon-help-me-get-a-job, what-happens-after-the-hackathon, building-with-robot-arms-and-quadrupeds-at-a-hackathon]
faq:
  - q: "Can a hackathon project help me get a robotics job?"
    a: "Yes, if it is published and easy to check. A working repository, a short demo video and a clear account of what you personally built give a hiring team evidence that a CV line cannot. At HackLab Robotics' Edition #1, 5 participants were hired by sponsor companies after the event."
  - q: "What should a robotics portfolio project include?"
    a: "A public repository with a README that explains what the project does and how to run it, a demo video under two minutes, a short write-up of the problem, your role, the results and what failed, and any datasets or models you published."
  - q: "How soon after a hackathon should I publish my project?"
    a: "Within a week. Details fade quickly, and sponsor companies are most likely to remember your team in the days right after the event."
  - q: "Should I license my hackathon repository?"
    a: "Agree on it with your team, and add a license if you want others to reuse the code. GitHub's documentation says that without a license, default copyright law applies and nobody may reproduce, distribute or create derivative works from your work."
sources:
  - name: "GitHub Docs – About READMEs"
    url: "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes"
  - name: "GitHub Docs – Licensing a repository"
    url: "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository"
  - name: "Hugging Face – LeRobot docs: Imitation learning on real-world robots"
    url: "https://huggingface.co/docs/lerobot/il_robots"
---
**To use a hackathon project to get a robotics or AI job, publish it within a week as a public repository with a clear README, a demo video under two minutes and a short write-up of exactly what you built, then send it to the engineers you met at the event.** Hiring teams in robotics want evidence that you can make a real system work; a project they can open, watch and run is that evidence. At HackLab Robotics' Edition #1 (June 2026, Berlin), 5 participants were hired by sponsor companies after the event.

This guide is for builders: students, engineers and researchers who want a weekend project to count in a job search.

## Why does a hackathon project work as a portfolio piece?

A hackathon project works because it shows a complete, working system built under a deadline, which is close to what robotics teams do every day. A degree shows theory; a project on real hardware shows integration, debugging and judgement.

What a reviewer can see in a well-documented project:

- **Scope:** you chose a problem small enough to finish.
- **Integration:** perception, planning, control or model serving connected end to end.
- **Hardware reality:** how you handled noisy sensors, latency and failures.
- **Teamwork:** what you owned and how you worked with others.

More on the career side is in [will a hackathon help me get a job](/articles/will-a-hackathon-help-me-get-a-job).

## What should you capture during the hackathon itself?

Capture material while you build, because you cannot recreate it later. Thirty seconds of phone video during a test is worth more than a long description written a week afterwards.

A capture checklist:

1. **Short clips** of each milestone: first motion, first full run, failures.
2. **Screenshots** of dashboards, maps, training curves or logs.
3. **A running notes file** with decisions made and why.
4. **Commit history** with meaningful messages, not one final upload.
5. **A list of who built what** on the team, agreed before you leave.
6. **Contact details** of the sponsor engineers and judges you spoke with.

## What should the repository contain?

The repository should let a stranger understand the project in two minutes and run it in thirty. GitHub's documentation says a README typically explains what the project does, why it is useful, how to get started, where to get help, and who maintains and contributes to it ([GitHub Docs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes)).

For a robotics project, add:

- **Hardware and software versions:** robot model, OS, ROS 2 distribution, key libraries.
- **An architecture diagram:** one image showing how the parts connect.
- **Results:** what worked, with numbers where you have them, such as success rate over a set number of runs.
- **Known limitations:** what failed and what you would do next.
- **No secrets:** remove API keys and tokens before making the repository public.

Agree on a license with your team. GitHub notes that without one, default copyright law applies and no one may reproduce, distribute or create derivative works from the code ([GitHub Docs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository)).

## Should you publish datasets and trained models too?

Yes, when your project produced them and the team agrees. A published dataset or model shows the full robot-learning loop, not only the demo.

If you used Hugging Face's LeRobot, its tutorial describes how recorded datasets are uploaded to your Hugging Face page by default, tagged `LeRobot`, and can be opened in a browser visualizer; trained policy checkpoints can be uploaded to the Hub as well ([LeRobot imitation learning](https://huggingface.co/docs/lerobot/il_robots)). Link both from your README so a reviewer can see the data behind the demo.

## How do you write up the project for recruiters and engineers?

Write a one-page summary that separates the team's result from your own contribution. Reviewers want to know what you did, not only what the team shipped.

| Section | What to write | Length |
|---|---|---|
| Problem | The task in one or two sentences | 2 sentences |
| Your role | What you personally built or decided | 3–5 bullets |
| Approach | Platform, methods, key design choices | 1 short paragraph |
| Result | What worked, with numbers if measured | 2–3 sentences |
| What failed | The main problems and how you handled them | 2–3 sentences |
| Next steps | What you would build with more time | 1–2 sentences |
| Links | Repository, video, dataset or model | 1 line |

The same content works for a CV line, a LinkedIn post and a cover letter. On a CV, keep it to one or two lines: the platform, what you built, and the result. Avoid vague claims; "built a ROS 2 node that turned camera detections into navigation goals on a quadruped" says more than "worked on AI robotics".

## How should you follow up with sponsor companies?

Follow up within a week with a short, specific message and a link to your project. Sponsor companies watched you build, so you are not a cold applicant.

1. Reference something concrete from your conversation at the event.
2. Link the repository and the demo video.
3. State in one sentence what kind of role you are looking for.
4. Ask one clear question, such as whether their team is hiring for that profile.

HackLab Edition #1 had 14 sponsor companies, including Hugging Face, Mistral AI and n8n, and 5 participants were hired by sponsor companies after the event. What else to do after the demo is in [what happens after the hackathon](/articles/what-happens-after-the-hackathon).

## What is a realistic timeline after the event?

Most of the portfolio value is created in the first week. Use this timeline:

| When | Task |
|---|---|
| Last hours of the event | Record a clean backup demo, collect contacts, agree on who did what |
| Days 1–2 | Clean the repository, remove secrets, write the README |
| Days 3–5 | Edit the demo video, write the one-page summary |
| Days 5–7 | Send follow-ups to sponsor engineers; post the project publicly |
| Week 2–4 | Fix one known limitation and update the repository |

Common mistakes to avoid: a repository with no README, a demo video longer than three minutes, claiming the whole team's work as your own, and waiting a month to publish.

If you are still choosing what to build, [building with robot arms and quadrupeds](/articles/building-with-robot-arms-and-quadrupeds-at-a-hackathon) covers how to scope a physical demo for 48 hours.

## How can builders build a portfolio project at HackLab?

HackLab Robotics has organised one of the largest AI × robotics hackathons in Germany, and likely in Europe: Edition #2 (21–22 November 2026, CIC Berlin) drew 1,100+ registrations for 200 spots, and applications are now closed. The event page is on [Luma](https://luma.com/h0mcaqio); follow HackLab Robotics to hear about future editions. Companies that want to meet builders through their projects can [partner with HackLab](/for-companies).

*Last updated: 11 November 2026.*
