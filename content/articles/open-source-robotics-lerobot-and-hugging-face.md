---
slug: open-source-robotics-lerobot-and-hugging-face
title: "Open-Source Robotics with LeRobot and Hugging Face: A Guide for Engineering Teams"
description: "What Hugging Face's LeRobot gives a robotics team: low-cost SO-101 arms, a shared dataset format, ready policies and VLAs, and the skills to hire."
category: Physical AI
date: 2026-11-11
target_query: "open-source robotics (LeRobot, Hugging Face) for teams"
tags: [LeRobot, Hugging Face, open-source robotics, SO-101, SmolVLA, robot learning]
related: [robot-learning-skills-companies-need, providing-hardware-to-a-robotics-hackathon, hacklab-partners-and-sponsors]
faq:
  - q: "What is LeRobot?"
    a: "LeRobot is Hugging Face's open-source Python library for real-world robotics, built on PyTorch and released under Apache 2.0. It bundles hardware drivers, a dataset format, imitation and reinforcement learning policies, and vision-language-action models."
  - q: "Can a company use LeRobot commercially?"
    a: "The LeRobot code is licensed under Apache 2.0, which permits commercial use. Individual models and datasets on the Hugging Face Hub carry their own licences, so each one has to be checked before use in a product."
  - q: "What hardware works with LeRobot?"
    a: "LeRobot supports low-cost arms such as the SO-100 and SO-101, plus Koch, LeKiwi, HopeJR, Reachy 2, Unitree G1 and OpenARM, and teleoperation through leader arms, gamepads, keyboards and phones."
  - q: "What is SmolVLA?"
    a: "SmolVLA is a 450-million-parameter open-source vision-language-action model from Hugging Face, released in June 2025. It was pretrained on community LeRobot datasets and is small enough to train on a single consumer GPU."
sources:
  - name: "Hugging Face – LeRobot (GitHub)"
    url: "https://github.com/huggingface/lerobot"
  - name: "Hugging Face – LeRobot docs: SO-101"
    url: "https://huggingface.co/docs/lerobot/so101"
  - name: "Hugging Face – SmolVLA blog post"
    url: "https://huggingface.co/blog/smolvla"
  - name: "Hugging Face – LeRobotDataset v3.0 docs"
    url: "https://huggingface.co/docs/lerobot/lerobot-dataset-v3"
  - name: "Hugging Face – Blog: Pollen Robotics acquisition (14 April 2025)"
    url: "https://huggingface.co/blog/hugging-face-pollen-robotics-acquisition"
---
**LeRobot is Hugging Face's open-source library for real-world robotics, and it gives teams a shared stack: low-cost hardware such as the SO-101 arm, a common dataset format, and ready-to-train policies from imitation learning to vision-language-action (VLA) models.** For an engineering team, it replaces much of the custom tooling between "we have a robot" and "we have a trained policy". For a hiring manager, it is a shared reference point: a candidate's LeRobot datasets and models can be inspected on the Hub before an interview.

## What is LeRobot and what does it include?

LeRobot is a Python library built on PyTorch and released under Apache 2.0, with the stated aim of "making AI for robotics more accessible with end-to-end learning" ([LeRobot on GitHub](https://github.com/huggingface/lerobot)). It covers the full loop from hardware to trained model.

| Layer | What LeRobot provides | Why it matters to a team |
|---|---|---|
| Hardware | Drivers for SO-100/SO-101, Koch, LeKiwi, HopeJR, Reachy 2, Unitree G1, OpenARM | Start on cheap arms, move to larger robots with the same code |
| Teleoperation | Leader arms, gamepads, keyboards, phones | Collect demonstrations without custom rigs |
| Data | LeRobotDataset format on the Hugging Face Hub | Share, version and stream robot data |
| Imitation learning | ACT, Diffusion Policy, VQ-BeT and others | Train manipulation skills from demonstrations |
| Reinforcement learning | HIL-SERL, TDMPC | Improve policies with rewards and human corrections |
| VLA models | π0, π0-FAST, π0.5, SmolVLA, GR00T and others | Fine-tune large pretrained robot models |
| Simulation benchmarks | LIBERO, MetaWorld | Compare policies before hardware tests |

## What is the SO-101 arm and why do teams use it?

The SO-101 is the low-cost arm that LeRobot calls its "flagship robot", designed as a leader-follower pair ([SO-101 docs](https://huggingface.co/docs/lerobot/so101)). The follower arm uses six STS3215 servo motors with 1/345 gearing. The leader arm uses differently geared motors so a person can move it by hand while the follower copies the motion.

The workflow is documented end to end:

1. **Source and print parts** from the open bill of materials.
2. **Configure motors** by assigning IDs and baud rates with `lerobot-setup-motors`.
3. **Assemble** joint by joint.
4. **Calibrate** both arms with `lerobot-calibrate`, which the docs say "allows a neural network trained on one robot to work on another".
5. **Teleoperate and record** demonstrations, then train a policy.

For teams, this means a manipulation prototype no longer requires an expensive industrial arm. For hiring, it means a candidate can show a working learned policy built at home.

## How does LeRobot handle robot data?

LeRobot stores robot data in LeRobotDataset, now at version 3.0, which pairs multi-camera video with synchronised state and action signals ([LeRobotDataset v3.0](https://huggingface.co/docs/lerobot/lerobot-dataset-v3)). The design has three parts:

- **Tabular data** (states, actions, timestamps) in Apache Parquet.
- **Video** encoded as MP4, sharded per camera.
- **Metadata** describing features, frame rates, normalisation statistics and episode boundaries.

Version 3 stores many episodes per file instead of one file per episode, and adds `StreamingLeRobotDataset` to train directly from the Hub without downloading first. For a company, a shared format means data recorded by one engineer can be trained on by another, and public datasets can be mixed with private ones.

## What can a team do with SmolVLA?

SmolVLA lets a small team experiment with VLA models without a data-centre budget. Hugging Face describes it as "a compact (450M), open-source Vision-Language-Action model", pretrained on 487 community datasets tagged `lerobot`, about 10 million frames in total ([SmolVLA](https://huggingface.co/blog/smolvla)). The post says it is "small enough to run on CPU, train on a single consumer GPU, or even a MacBook".

SmolVLA also introduced asynchronous inference, where the robot keeps executing actions while the next chunk is computed. Hugging Face reports about 30% faster task completion than synchronous mode at a similar success rate of about 78%. That kind of systems detail is where strong candidates separate themselves.

## Is Hugging Face moving into robot hardware?

Yes. In April 2025 Hugging Face announced it had acquired Pollen Robotics, which had spent about nine years building open-source robots, and that it would sell the Reachy 2 humanoid ([Hugging Face blog](https://huggingface.co/blog/hugging-face-pollen-robotics-acquisition)). The post describes Reachy 2 as a research and education robot with 7-DoF arms, VR teleoperation and open-source hardware and software, priced at $70,000.

For teams, the direction matters more than the single product: the same open ecosystem now spans software, data, models and hardware.

## What should a team watch out for with open-source robotics?

Open source lowers cost, but it moves responsibility to your team. Plan for:

- **Licences per artefact.** LeRobot code is Apache 2.0, but each model and dataset on the Hub has its own licence.
- **Hardware variation.** Low-cost servos and 3D-printed parts vary, so calibration and maintenance are ongoing work.
- **Fast-moving APIs.** The library changes often; pin versions in production.
- **Data you cannot share.** Decide early which recordings stay private.

## Which open-source robotics skills should you hire for?

Hire engineers who have taken a LeRobot-style project from assembly to a trained policy, and who can explain the trade-offs. Concretely:

1. Assembling, calibrating and maintaining low-cost arms.
2. Recording clean teleoperation datasets and publishing them in a standard format.
3. Training and comparing ACT, Diffusion Policy or a VLA such as SmolVLA on their own data.
4. Measuring success over repeated trials and reporting failure modes.
5. Contributing to or reading open-source code, not just running examples.

Our guide to [robot learning skills companies need](/articles/robot-learning-skills-companies-need) goes deeper on the methods. If you plan to put arms like these in front of candidates, see [providing hardware to a robotics hackathon](/articles/providing-hardware-to-a-robotics-hackathon).

## How HackLab helps companies hire open-source robotics engineers

Hugging Face was a sponsor of HackLab Edition #1 and is a partner of Edition #2, alongside NormaCore and other technology providers listed in [HackLab partners and sponsors](/articles/hacklab-partners-and-sponsors). Edition #2 on 21–22 November 2026 includes a Wildcard / Open Source track, with robot arms and robot sets on site for 200 builders selected from 1,100+ registrations. Companies can watch these builders work for 48 hours and meet them in person. To set an open-source challenge, [partner with HackLab](/for-companies).

*Last updated: 11 November 2026.*
