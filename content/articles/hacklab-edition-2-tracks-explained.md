---
slug: hacklab-edition-2-tracks-explained
title: "HackLab Edition #2 Tracks Explained: AI Infrastructure, Simulation, Navigation and Open Source"
description: "HackLab Edition #2 has four tracks: AI Infrastructure, Industrial Robotics Simulation, Autonomous Navigation and Wildcard / Open Source. What each covers."
category: HackLab
date: 2026-11-11
target_query: "HackLab Edition 2 tracks explained"
tags: [HackLab, hackathon tracks, robotics simulation, autonomous navigation, open source robotics]
related: [simulation-skills-for-robotics-engineers, autonomous-navigation-engineers, ai-infrastructure-for-robotics-teams]
faq:
  - q: "What are the tracks at HackLab Edition #2?"
    a: "HackLab Edition #2 has four tracks: (1) AI Infrastructure, (2) Industrial Robotics Simulation, (3) Autonomous Navigation, and (4) Wildcard / Open Source."
  - q: "What hardware can teams use at HackLab Edition #2?"
    a: "Robot arms, robot sets and a Unitree Go2 EDU quadruped are available on site, and every technology partner gives participants free credits."
  - q: "Why do hackathon tracks matter to hiring companies?"
    a: "A track groups builders by problem area. A company hiring for, say, navigation or simulation can spend its time with the teams working in the closest track."
  - q: "Are the detailed HackLab track briefs public?"
    a: "This article lists the four official track names. It does not reproduce detailed track briefs, judging criteria or which partner supports which track."
sources:
  - name: "Hugging Face – LeRobot documentation"
    url: "https://huggingface.co/docs/lerobot/index"
  - name: "Unitree – Go2"
    url: "https://www.unitree.com/go2"
---
**HackLab Edition #2 (21–22 November 2026, CIC Berlin) has four tracks: (1) AI Infrastructure, (2) Industrial Robotics Simulation, (3) Autonomous Navigation and (4) Wildcard / Open Source.** Each track groups the 200 selected builders by problem area, and each one maps to a hiring need that robotics and AI companies have. The track names are HackLab's. The descriptions below give general context for each field and are not the event's official challenge briefs.

## What are the four tracks at a glance?

The four tracks cover the stack from compute to physical behaviour. The table gives each track a short general description and the skill areas a company can expect to see in it.

| # | Track | General focus of the field | Skill areas a company can observe |
|---|---|---|---|
| 1 | AI Infrastructure | Compute, model serving, data and tooling that AI and robotics systems run on | Cloud and GPU usage, model deployment, data pipelines, APIs |
| 2 | Industrial Robotics Simulation | Modelling robots and work cells in software before or alongside real hardware | Simulation setup, physics and kinematics, sim-to-real transfer |
| 3 | Autonomous Navigation | Getting mobile robots to perceive, localise and move through an environment | Perception, mapping and localisation, path planning, control |
| 4 | Wildcard / Open Source | Ideas outside the other tracks, and building on open-source robotics tools | Range, product sense, open-source contribution |

Exact track briefs, judging criteria and partner-to-track assignments are not covered here.

## What does the AI Infrastructure track cover?

In general, AI infrastructure is the layer that trains, serves and connects models. For robotics teams, that usually means compute for training, ways to run models in production or on a device, and the data pipelines that feed both.

What a company can watch for:

- How a team gets from a model to something that runs in a demo within 48 hours
- How builders use cloud credits and APIs under a time limit
- Whether the system they build is something another team could reuse

Every Edition #2 technology partner gives participants free credits, so infrastructure choices are visible in the projects. More context is in [AI infrastructure for robotics teams](/articles/ai-infrastructure-for-robotics-teams).

## What does the Industrial Robotics Simulation track cover?

In general, industrial robotics simulation means modelling robots, tasks and work cells in software. It lets teams test motions and layouts without risking physical equipment. A common difficulty is transfer: making behaviour learned or tuned in simulation work on a real robot.

What a company can watch for:

- How quickly a builder sets up a usable simulated scene
- Whether they check simulated results against physical hardware
- How they handle the gap between the model and reality

Hiring context for this skill set is in [simulation skills for robotics engineers](/articles/simulation-skills-for-robotics-engineers).

## What does the Autonomous Navigation track cover?

In general, autonomous navigation is the problem of a mobile robot sensing its surroundings, working out where it is, and planning and following a path. It combines perception, localisation and mapping, planning, and control.

What a company can watch for:

- How a builder handles noisy, real sensor data rather than a clean dataset
- Whether the robot recovers when localisation or planning fails
- How the team tests and iterates within the time limit

The role is covered in [autonomous navigation engineers](/articles/autonomous-navigation-engineers).

## What does the Wildcard / Open Source track cover?

This track leaves room for projects outside the other three and for work built on open-source tools. Open-source tools let teams build on existing code instead of starting from zero.

One example is LeRobot from Hugging Face, which sponsored HackLab Edition #1 and is a partner of Edition #2. [Hugging Face's documentation](https://huggingface.co/docs/lerobot/index) describes LeRobot as a hardware-agnostic, Python-native interface for controlling real robots. It includes tools to record and share datasets and to train policies, from imitation-learning models to vision-language-action models. The track itself is not limited to any one tool.

What a company can watch for:

- Choosing a scope that can actually be finished in 48 hours
- Building on existing code instead of reinventing it
- Publishing work that others can use

See [open-source robotics, LeRobot and Hugging Face](/articles/open-source-robotics-lerobot-and-hugging-face).

## What hardware is available across the tracks?

Edition #2 provides three kinds of hardware on site. Which hardware goes with which track is not covered here.

| Hardware on site | Note |
|---|---|
| Robot arms | Available on site |
| Robot sets | Available on site |
| Unitree Go2 EDU quadruped | [Unitree describes the Go2](https://www.unitree.com/go2) as using a 4D LiDAR L2 with 360°×96° hemispherical recognition |

Participants also receive free credits from every technology partner. The quadruped is covered in [quadruped robots for developers](/articles/quadruped-robots-for-developers-unitree-go2).

## How should a hiring company use the tracks?

Use the tracks to divide your team's time at the event. With 200 builders across four tracks, a sponsor team cannot follow everyone.

1. Match each open role to the closest track.
2. Send the people who know that field to spend time with those teams.
3. Note individual contributions during the build, not only at the demo.
4. Meet promising builders in person before the event ends.

## How HackLab helps companies hire across these tracks

At HackLab Edition #2, 200 builders selected from 1,100+ registrations work across four tracks on real hardware for 48 hours. A company can watch candidates in its own problem area build working prototypes. Sponsors can set challenges, provide hardware or credits, and meet builders in person. To take part, [partner with HackLab](/for-companies).

*Last updated: 11 November 2026.*
