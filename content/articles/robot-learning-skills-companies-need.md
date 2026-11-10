---
slug: robot-learning-skills-companies-need
title: "Robot Learning Skills Companies Hire For: Imitation Learning, RL and VLA Fine-Tuning"
description: "Robot learning skills to hire for in 2026: imitation learning (ACT, Diffusion Policy), reinforcement learning, VLA fine-tuning, data and evaluation."
category: Physical AI
date: 2026-11-11
target_query: "robot learning skills (imitation/RL) companies hire for"
tags: [robot learning, imitation learning, reinforcement learning, VLA, robotics hiring]
related: [open-source-robotics-lerobot-and-hugging-face, simulation-skills-for-robotics-engineers, how-to-assess-robotics-engineers-beyond-the-cv]
faq:
  - q: "What is robot learning?"
    a: "Robot learning is the use of machine learning to give robots skills, instead of hand-coding every motion. The main methods are imitation learning from human demonstrations, reinforcement learning from rewards, and fine-tuning large vision-language-action models on robot data."
  - q: "Should we hire for imitation learning or reinforcement learning?"
    a: "It depends on the task. Imitation learning fits manipulation tasks where a person can demonstrate the motion through teleoperation. Reinforcement learning fits tasks that can be simulated with a clear reward, such as legged locomotion."
  - q: "How much GPU is needed to fine-tune a VLA model?"
    a: "For Physical Intelligence's openpi models, the repository lists more than 8 GB of GPU memory for inference, more than 22.5 GB for LoRA fine-tuning and more than 70 GB for full fine-tuning."
  - q: "How can we test robot learning skills before hiring?"
    a: "Give candidates a robot or simulator, a task and limited time, then look at their data, their training choices and their success rate over repeated trials. Hackathons like HackLab let companies watch this happen over 36 to 48 hours."
sources:
  - name: "NVIDIA – What is a Humanoid Robot? (glossary)"
    url: "https://www.nvidia.com/en-us/glossary/humanoid-robot/"
  - name: "arXiv – Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware (ACT)"
    url: "https://arxiv.org/abs/2304.13705"
  - name: "arXiv – Diffusion Policy: Visuomotor Policy Learning via Action Diffusion"
    url: "https://arxiv.org/abs/2303.04137"
  - name: "Physical Intelligence – openpi (GitHub)"
    url: "https://github.com/Physical-Intelligence/openpi"
  - name: "Open X-Embodiment – Robotic Learning Datasets and RT-X Models"
    url: "https://robotics-transformer-x.github.io/"
  - name: "Hugging Face – LeRobot (GitHub)"
    url: "https://github.com/huggingface/lerobot"
---
**Companies building learned robot behaviour hire for three core skills: imitation learning from demonstrations, reinforcement learning in simulation, and fine-tuning vision-language-action (VLA) models.** Around those sit two skills that decide whether a project works: collecting good robot data and evaluating policies honestly on hardware. A candidate who has done all five on one real task is worth more than one who lists every algorithm on a CV.

## How is robot learning different from classic robot programming?

Classic robot programming defines every motion by hand: waypoints, trajectories and if-then rules written by an engineer. Robot learning replaces part of that code with a policy trained on data, so the robot can handle variation the programmer did not list. NVIDIA's overview of humanoid training describes the two main routes: robots "acquire new skills by replicating movements demonstrated by humans", or are "taught various movements and responses within simulated environments" through rewards ([NVIDIA glossary](https://www.nvidia.com/en-us/glossary/humanoid-robot/)).

For hiring, this changes the profile. A classic robot programmer needs deep knowledge of one controller. A robot learning engineer needs machine learning, data handling and enough robotics to know when a learned policy is the wrong tool and a hand-written controller is the better choice.

## What are the main robot learning methods companies use?

The three methods differ in where the learning signal comes from. Imitation learning copies human demonstrations, reinforcement learning (RL) optimises a reward, and VLA fine-tuning adapts a large pretrained model to a specific robot and task.

| Method | Learning signal | Typical use | Key tools and papers | Main risk |
|---|---|---|---|---|
| Imitation learning | Human demonstrations via teleoperation | Manipulation: grasping, assembly, folding | ACT, Diffusion Policy | Fails outside demonstrated situations |
| Reinforcement learning | Reward function, usually in simulation | Locomotion, dexterous control | Isaac Lab, MuJoCo, HIL-SERL | Sim-to-real gap, reward hacking |
| VLA fine-tuning | Pretrained vision-language model plus robot data | Language-conditioned, multi-task robots | π0 / π0.5, SmolVLA | GPU cost, slow inference on robot |

## What does imitation learning involve in practice?

Imitation learning means recording a person performing a task through a teleoperation rig and training a policy to reproduce it. Two methods dominate current practice.

- **ACT (Action Chunking with Transformers)** "learns a generative model over action sequences". Its authors report 80–90% success on fine manipulation tasks learned "with only 10 minutes worth of demonstrations" ([ACT paper](https://arxiv.org/abs/2304.13705)).
- **Diffusion Policy** represents "a robot's visuomotor policy as a conditional denoising diffusion process". Across 12 tasks from 4 benchmarks, its authors report "an average improvement of 46.9%" over prior methods ([Diffusion Policy paper](https://arxiv.org/abs/2303.04137)).

Both are implemented in Hugging Face's LeRobot library, alongside VQ-BeT and other policies ([LeRobot on GitHub](https://github.com/huggingface/lerobot)). A candidate who has trained either on a real arm has met the actual problems: inconsistent demonstrations, camera placement and slow recovery after a failed grasp.

## When do companies need reinforcement learning skills?

Companies need RL skills when a task can be simulated with a reward that captures success, and when demonstrations are hard to collect. Legged locomotion is the standard example: thousands of simulated robots learn to walk in parallel, then the policy is transferred to hardware.

RL work requires a different profile from imitation learning:

- Designing rewards that do not get exploited.
- Domain randomisation of friction, mass and latency to survive the move to hardware.
- Running GPU-parallel simulation, covered in our guide to [simulation skills for robotics engineers](/articles/simulation-skills-for-robotics-engineers).
- Fine-tuning on the real robot, for example with human-in-the-loop RL methods such as HIL-SERL, which LeRobot also supports.

## What is VLA fine-tuning and who can do it?

VLA fine-tuning adapts a large pretrained model that maps camera images and a language instruction to robot actions. Physical Intelligence's openpi repository releases π0 (a flow-based VLA), π0-FAST (autoregressive) and π0.5, described as having "better open-world generalization" ([openpi](https://github.com/Physical-Intelligence/openpi)).

The compute requirements set the bar for who can do this work:

| Task (openpi) | GPU memory listed | Example GPU |
|---|---|---|
| Inference | More than 8 GB | RTX 4090 |
| LoRA fine-tuning | More than 22.5 GB | RTX 4090 |
| Full fine-tuning | More than 70 GB | A100 80GB or H100 |

The openpi team also notes that π0 was built for its own robots, so results on other setups may vary. Good candidates know this and plan for data collection on the target robot, not only for downloading a checkpoint.

## Why is robot data collection a skill in its own right?

Data collection is a skill because robot data is scarce and its quality sets the ceiling for every method above. The Open X-Embodiment project pooled "1M+ real robot trajectories spanning 22 robot embodiments" from 60 datasets and 34 labs ([Open X-Embodiment](https://robotics-transformer-x.github.io/)). That is small next to the text corpora behind language models.

Engineers strong in this area can:

- Set up leader-follower teleoperation and calibrate it so data transfers between robots.
- Write clear episode protocols: start pose, object variation, failure handling.
- Store episodes in a shared format such as LeRobotDataset, which pairs synchronised video with state and action data.
- Spot bad demonstrations before they reach training.

## How do you evaluate a robot learning candidate?

Evaluate the loop, not the algorithm name. A practical assessment should show how the candidate collects data, chooses a policy, trains it, and reports results over repeated trials. Our guide on [assessing robotics engineers beyond the CV](/articles/how-to-assess-robotics-engineers-beyond-the-cv) covers formats in detail.

Questions that separate experience from reading:

1. How many demonstrations did you collect, and what did you change after the first training run?
2. What was your success rate over at least 10 trials, and what were the failure modes?
3. What did you randomise, and what broke when you moved to hardware?
4. Where did inference run, and how did latency affect the motion?

## Which robot learning skills should you hire for first?

Hire first for the method that matches your task, then for data and evaluation discipline. A practical priority order:

1. **Manipulation product:** imitation learning (ACT, Diffusion Policy), teleoperation and data quality.
2. **Legged or mobile platform:** RL in simulation, domain randomisation and sim-to-real transfer.
3. **Multi-task or language-driven robot:** VLA fine-tuning, GPU budgeting and on-robot inference.
4. **All cases:** honest evaluation over repeated real-world trials.

## How HackLab helps companies hire robot learning engineers

HackLab hackathons let companies watch robot learning skills under real constraints: builders get hardware, a task and 36 to 48 hours to make a policy work. Edition #2 on 21–22 November 2026 will provide robot arms, robot sets and a Unitree Go2 EDU quadruped to 200 builders selected from 1,100+ registrations. Edition #1 produced 5 hires at sponsor companies. To set a robot learning challenge, [partner with HackLab](/for-companies).

*Last updated: 11 November 2026.*
