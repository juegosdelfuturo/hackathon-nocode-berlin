---
slug: ai-infrastructure-for-robotics-teams
title: "AI Infrastructure for Robotics Teams: Data, Training, Simulation and Edge Compute"
description: "The AI infrastructure a robotics team needs: logging (MCAP), robot datasets, GPU training, simulation and edge inference, plus the engineers to hire."
category: Physical AI
date: 2026-11-11
target_query: "AI infrastructure for robotics teams"
tags: [AI infrastructure, robotics, MLOps, edge AI, Jetson, robot data, GPU]
related: [providing-api-credits-to-hackathon-teams, robot-learning-skills-companies-need, hacklab-edition-2-tracks-explained]
faq:
  - q: "What AI infrastructure does a robotics team need?"
    a: "Five layers: on-robot logging, a robot dataset format and store, GPU compute for training, compute for simulation, and edge hardware for inference on the robot. Tools such as MCAP, LeRobotDataset, Isaac Lab and NVIDIA Jetson cover these layers."
  - q: "What is MCAP?"
    a: "MCAP is an open-source container file format for multimodal log data, created as a Foxglove project. Its site says it is the default log format in ROS 2, and it stores timestamped channels with their schemas inside the file."
  - q: "How much GPU memory does training a robot foundation model need?"
    a: "It depends on the model. Physical Intelligence's openpi lists more than 8 GB for inference, more than 22.5 GB for LoRA fine-tuning and more than 70 GB, such as an A100 80GB or H100, for full fine-tuning."
  - q: "Should robot AI run on the robot or in the cloud?"
    a: "Usually both. Training runs on cloud or on-premise GPUs, while time-critical inference runs on the robot to avoid network latency. Edge modules such as NVIDIA Jetson AGX Thor are built for on-robot inference."
sources:
  - name: "MCAP – Official site"
    url: "https://mcap.dev/"
  - name: "Hugging Face – LeRobotDataset v3.0 docs"
    url: "https://huggingface.co/docs/lerobot/lerobot-dataset-v3"
  - name: "Physical Intelligence – openpi (GitHub)"
    url: "https://github.com/Physical-Intelligence/openpi"
  - name: "NVIDIA – Isaac Lab (GitHub)"
    url: "https://github.com/isaac-sim/IsaacLab"
  - name: "NVIDIA – Jetson AGX Thor"
    url: "https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-thor/"
  - name: "Hugging Face – SmolVLA blog post"
    url: "https://huggingface.co/blog/smolvla"
---
**A robotics team's AI infrastructure has five layers: logging data on the robot, storing it as training datasets, GPU compute for training, compute for simulation, and edge hardware that runs models on the robot.** Unlike a pure software ML stack, every layer has to handle synchronised video, sensor and action streams, and the last layer has to meet real-time limits. Each layer therefore needs a named owner and a budget, not just whoever happens to train the model.

## What are the layers of AI infrastructure for robotics?

The five layers follow the data from the robot to the model and back again.

| Layer | Job | Example tools | Main constraint |
|---|---|---|---|
| 1. Logging | Record every sensor, command and timestamp on the robot | MCAP, ROS 2 bags | Disk speed, crash safety |
| 2. Datasets | Turn logs and demonstrations into training data | LeRobotDataset v3, Hugging Face Hub | Video size, episode metadata |
| 3. Training | Train and fine-tune policies and VLA models | PyTorch, openpi, LeRobot | GPU memory and cost |
| 4. Simulation | Generate experience and test policies at scale | Isaac Lab, Isaac Sim, MuJoCo | GPU hours, sim-to-real gap |
| 5. Edge inference | Run models on the robot within control deadlines | NVIDIA Jetson modules | Power, thermals, latency |

## How should a robotics team log and store robot data?

Log everything in a self-describing format, then convert selected runs into a training dataset format. These are two different jobs.

For logging, MCAP is "an open source container file format for multimodal log data", a Foxglove project that its site describes as "the default log format in ROS 2" ([MCAP](https://mcap.dev/)). It keeps message schemas inside the file, uses an append-only design to limit corruption after unclean shutdowns, and supports LZ4 or Zstandard compression with indexed reads.

For training, LeRobotDataset v3.0 stores states and actions in Apache Parquet and camera frames as MP4, with metadata for features, frame rates, normalisation statistics and episode boundaries ([LeRobotDataset v3.0](https://huggingface.co/docs/lerobot/lerobot-dataset-v3)). Version 3 packs many episodes per file to reduce file-system pressure, and `StreamingLeRobotDataset` can train straight from the Hub without downloading first.

Infrastructure decisions at this layer:

- Where raw logs live and how long they are kept.
- Which runs become training episodes, and who labels them.
- Which datasets are private and which can be shared.

## How much GPU compute does robot learning need?

GPU needs range from one workstation card to data-centre GPUs, depending on the model. Physical Intelligence's openpi repository gives a concrete reference ([openpi](https://github.com/Physical-Intelligence/openpi)):

| Task | GPU memory listed | Example GPU |
|---|---|---|
| Inference | More than 8 GB | RTX 4090 |
| LoRA fine-tuning | More than 22.5 GB | RTX 4090 |
| Full fine-tuning | More than 70 GB | A100 80GB or H100 |

Smaller models change the picture. Hugging Face describes SmolVLA as a 450M-parameter model "small enough to run on CPU, train on a single consumer GPU, or even a MacBook" ([SmolVLA](https://huggingface.co/blog/smolvla)). Choosing the model size is an infrastructure decision as much as a research one. For the methods themselves, see [robot learning skills companies need](/articles/robot-learning-skills-companies-need).

## What does simulation add to the infrastructure bill?

Simulation adds GPU hours, because modern robot learning runs many simulated environments in parallel on the GPU. Isaac Lab is a "GPU-accelerated, open-source framework" for reinforcement learning, imitation learning and post-training, with more than 30 ready-to-train environments and more than 16 robot models ([Isaac Lab](https://github.com/isaac-sim/IsaacLab)).

Two practical points for infrastructure owners:

1. Simulation jobs and training jobs compete for the same GPUs; schedule them together.
2. Experiments that render simulated cameras or lidar need a separate GPU budget from physics-only runs, so they can be tracked and planned on their own.

## What edge hardware runs AI on the robot?

Edge hardware is an onboard computer that runs perception and policy models within the robot's power and latency limits. NVIDIA's Jetson AGX Thor developer kit is one current reference point ([Jetson AGX Thor](https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-thor/)):

- **GPU:** 2,560-core NVIDIA Blackwell architecture GPU with fifth-generation Tensor Cores.
- **AI compute:** 2,070 TFLOPS (FP4, sparse).
- **Memory:** 128 GB LPDDR5X at 273 GB/s.
- **Power:** 40 W to 130 W.
- **Versus AGX Orin:** NVIDIA states 7.5× the performance and 3.5× the energy efficiency.

The software side matters as much. SmolVLA's asynchronous inference lets the robot keep executing actions while the next action chunk is computed; Hugging Face reports about 30% faster task completion than synchronous mode. Engineers who understand this kind of scheduling get more out of any edge module.

## Who owns AI infrastructure in a robotics team?

Ownership depends on team size. A small team can give layers 1 to 3 to one ML-systems engineer and share layers 4 and 5 with simulation and embedded engineers; a larger team splits them into distinct roles.

| Role | Owns | Signals of experience |
|---|---|---|
| Robotics data engineer | Logging, dataset conversion, data quality | Has built a pipeline from robot logs to training episodes |
| ML infrastructure engineer | GPU clusters, training jobs, experiment tracking | Has scheduled multi-GPU fine-tuning and kept costs visible |
| Simulation engineer | Simulation environments and GPU usage | Has run parallel environments and measured sim-to-real gaps |
| Embedded / edge AI engineer | On-robot inference, drivers, latency | Has deployed a model on an edge module and profiled it |

## Which infrastructure skills should you hire for?

Hire for people who have moved robot data through the whole loop at least once. Concrete skills:

1. Recording and replaying multimodal robot logs without losing synchronisation.
2. Converting logs into a training format and tracking dataset versions.
3. Estimating GPU memory and cost before starting a training run.
4. Running simulation and training on shared GPUs without blocking each other.
5. Deploying and profiling a model on edge hardware against a latency budget.

Teams that receive cloud or API credits at events can test these skills cheaply; see [providing API credits to hackathon teams](/articles/providing-api-credits-to-hackathon-teams).

## How HackLab helps companies hire AI infrastructure engineers for robotics

AI Infrastructure is the first of four tracks at HackLab Edition #2, on 21–22 November 2026 at CIC Berlin, as explained in [HackLab Edition #2 tracks explained](/articles/hacklab-edition-2-tracks-explained). Builders will receive free credits from every technology partner, and Edition #2 partners and technology providers include Nebius, Anthropic, Hugging Face and Cognition. Teams will work for 48 hours with robot arms, robot sets and a Unitree Go2 EDU on site. The 200 participants were selected from 1,100+ registrations. To set an infrastructure challenge or offer credits, [partner with HackLab](/for-companies).

*Last updated: 11 November 2026.*
