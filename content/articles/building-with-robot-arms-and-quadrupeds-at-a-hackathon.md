---
slug: building-with-robot-arms-and-quadrupeds-at-a-hackathon
title: "Building with Robot Arms and a Quadruped at a Hackathon: A 48-Hour Plan for Builders"
description: "How to build with robot arms or a Unitree Go2 quadruped at a hackathon: pick a platform, scope for 48 hours, plan shared robot time and demo safely."
category: For Builders
date: 2026-11-11
target_query: "building with robot arms and a quadruped (Unitree Go2) at a hackathon"
tags: [robot arms, quadruped robots, Unitree Go2, LeRobot, ROS 2, hardware hackathon, builders]
related: [quadruped-robots-for-developers-unitree-go2, hacklab-edition-2-tracks-explained, how-to-prepare-for-your-first-hardware-hackathon]
faq:
  - q: "Can I build on a Unitree Go2 at a hackathon without prior quadruped experience?"
    a: "Yes, if you stay on high-level control. Unitree's ROS 2 package sends high-level sport-mode requests that the robot's built-in controllers carry out; low-level motor commands need much more care and are rarely worth the risk in 48 hours."
  - q: "Should I pick the robot arm or the quadruped?"
    a: "Pick the arm for manipulation and robot-learning projects such as pick-and-place, and the quadruped for navigation, inspection and perception on the move. Choose the one that matches your track and your team's strongest skills."
  - q: "Can you train an imitation-learning policy for a robot arm during a hackathon?"
    a: "It is possible but tight. Hugging Face's LeRobot tutorial suggests recording at least 50 episodes for a grasping task and says training should take several hours, so the recording and training plan has to start early."
  - q: "What robots are available at HackLab Edition #2?"
    a: "Robot arms, robot sets and a Unitree Go2 EDU quadruped are on site at HackLab Edition #2, 21–22 November 2026 at CIC Berlin."
sources:
  - name: "Unitree – Go2 product page"
    url: "https://www.unitree.com/go2"
  - name: "Unitree – unitree_ros2 (GitHub)"
    url: "https://github.com/unitreerobotics/unitree_ros2"
  - name: "Hugging Face – LeRobot docs: SO-101"
    url: "https://huggingface.co/docs/lerobot/so101"
  - name: "Hugging Face – LeRobot docs: Imitation learning on real-world robots"
    url: "https://huggingface.co/docs/lerobot/il_robots"
---
**To build with robot arms or a quadruped at a hackathon, pick one platform that fits your track, scope a demo that can run in under a minute, get the robot moving with its existing high-level interface on day one, and save learning or custom control for whatever time is left.** Shared robots are the bottleneck at any hardware hackathon, so the teams that finish plan their robot time as carefully as their code. At HackLab Robotics' Edition #2 (21–22 November 2026, CIC Berlin), builders work with robot arms, robot sets and a Unitree Go2 EDU quadruped over 48 hours.

This guide is for builders: students, engineers and researchers who want to get a physical demo working in a weekend.

## Should you build on the robot arm or the quadruped?

Choose the arm for manipulation and robot learning, and the quadruped for mobility, navigation and perception on the move. The right choice is the one that matches your track and the strongest skills on your team.

| | Robot arm | Quadruped (Unitree Go2 EDU) |
|---|---|---|
| Typical projects | Pick-and-place, sorting, teleoperation, imitation learning | Navigation, inspection routes, person following, language-driven commands |
| Fastest way to first motion | Teleoperation or scripted joint positions | High-level sport-mode requests |
| Main time cost | Data collection and training | Localisation, mapping and testing in a safe space |
| Main risk | Collisions with the table, objects or people | Falls and collisions while walking |
| Best-fitting Edition #2 tracks | Industrial Robotics Simulation, Wildcard / Open Source | Autonomous Navigation, AI Infrastructure |

The track mapping above is a suggestion, not an official assignment. The four tracks are described in [HackLab Edition #2 tracks explained](/articles/hacklab-edition-2-tracks-explained).

## How do you get a robot arm working fast?

Start with teleoperation, then record data, then train only if time allows. Many hackathon arm projects use open-source tooling; Hugging Face's LeRobot is one example, and its SO-101 arm shows the typical setup ([LeRobot SO-101](https://huggingface.co/docs/lerobot/so101)).

According to that documentation:

- The SO-101 comes as a **follower** arm with 6 STS3215 motors and a **leader** arm that you move by hand to drive the follower.
- Both arms must be **calibrated** so they report the same position values in the same physical pose. The docs note that calibration is what lets a neural network trained on one robot work on another.

The arms at a given event may be a different model, but the workflow is similar. LeRobot's imitation-learning tutorial gives the sequence and the time it takes ([LeRobot imitation learning](https://huggingface.co/docs/lerobot/il_robots)):

1. **Teleoperate** the arm with the leader arm or another device.
2. **Record** episodes with fixed cameras. The tutorial suggests at least 50 episodes for a grasping task, 10 per object location, and says you should be able to do the task yourself by looking only at the camera images.
3. **Train** a policy. The tutorial says training should take several hours and notes that small datasets usually need far fewer steps than the default.
4. **Evaluate** the policy on the robot with the same robot ID, cameras and task description as in the dataset.

For a 48-hour event, this means recording should be finished by the end of day one so training can run overnight.

## How do you get a Unitree Go2 moving in a hackathon?

Use high-level control first. Unitree's unitree_ros2 package controls the Go2 through ROS 2 messages over the same DDS layer the robot already uses, so no SDK wrapper is needed ([unitree_ros2](https://github.com/unitreerobotics/unitree_ros2)).

Key points from Unitree's documentation:

- **High-level control** sends requests to `/api/sport/request`, which the robot's built-in sport-mode controllers carry out; Unitree's example sets a desired body attitude.
- **Low-level control** sends torque, position and velocity commands per motor to `/lowcmd`. Commands go directly to the motors, so a mistake goes straight to the hardware.
- **Tested setups** are ROS 2 Foxy on Ubuntu 20.04 and ROS 2 Humble on Ubuntu 22.04, with Humble recommended.

Unitree's product page lists the EDU with a 15,000 mAh battery and about 2–4 hours of battery life, and marks it as the version with full secondary development support ([Unitree Go2](https://www.unitree.com/go2)). Plan your test sessions around charging. Hardware details are covered in [quadruped robots for developers](/articles/quadruped-robots-for-developers-unitree-go2).

## How should a team plan 48 hours on shared hardware?

Split the weekend into fixed phases and protect robot time for the work that needs it. Everything that can run without the robot, such as code, simulation and the demo script, should happen away from it.

| Phase | Time | Goal |
|---|---|---|
| Setup | Hours 0–4 | Environment installed, robot connected, first movement from your laptop |
| Baseline | Hours 4–12 | Simplest end-to-end version of the demo working once |
| Data and build | Hours 12–24 | Recording, mapping or integration; training runs overnight |
| Improve | Hours 24–40 | Reliability: run the demo again and again, fix what breaks |
| Freeze | Hours 40–48 | No new features; rehearse the demo and record a backup video |

Rules that save time:

- **Write a one-sentence demo goal** before touching the robot, for example "the robot walks to a marked spot and reports what it sees".
- **Book short robot slots** and arrive with a test plan for each slot.
- **Log everything**: commands sent, sensor data and failures. It helps debugging and your write-up afterwards.
- **Pin software versions** on day one and do not upgrade mid-event.

## What safety rules should builders follow with arms and quadrupeds?

Treat every robot as able to move unexpectedly, and follow the rules the organisers and hardware partners set on site. Generic habits that apply to both platforms:

- Keep a clear area and decide who may stop the robot.
- Test new code at low speed and with small motions first.
- Never send low-level motor commands without a teammate watching and ready to stop the robot.
- Keep hands and cables out of an arm's reach while it runs a policy.
- Stop when the battery runs low instead of pushing one more test.

## What makes a strong arm or quadruped demo?

A strong demo runs live, finishes in under a minute and shows one clear behaviour. Judges and sponsor engineers look at whether it works, not at how many features it lists.

- Show the robot doing the task, then explain how.
- Have a recorded backup run in case the live run fails.
- State honestly what is scripted, what is learned and what failed.

Preparation for hardware events in general is covered in [how to prepare for your first hardware hackathon](/articles/how-to-prepare-for-your-first-hardware-hackathon).

## How can builders work with this hardware at HackLab?

HackLab Robotics has organised one of the largest AI × robotics hackathons in Germany, and likely in Europe: Edition #2 drew 1,100+ registrations for 200 spots, and applications are now closed. The event page is on [Luma](https://luma.com/h0mcaqio); follow HackLab Robotics to hear about future editions. Companies that want to provide robots or set a hardware challenge can [partner with HackLab](/for-companies).

*Last updated: 11 November 2026.*
