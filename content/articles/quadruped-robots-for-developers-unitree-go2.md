---
slug: quadruped-robots-for-developers-unitree-go2
title: "Quadruped Robots for Developers: What Teams Build on the Unitree Go2"
description: "What developers build on a quadruped like the Unitree Go2: versions, specs, SDK and ROS 2 interfaces, RL locomotion and the skills it shows in hiring."
category: Physical AI
date: 2026-11-11
target_query: "quadruped robots like Unitree Go2 for developers"
tags: [quadruped robots, Unitree Go2, legged robots, ROS 2, reinforcement learning, robotics hiring]
related: [autonomous-navigation-engineers, providing-hardware-to-a-robotics-hackathon, hacklab-edition-2-november-2026]
faq:
  - q: "Which Unitree Go2 version is for developers?"
    a: "The EDU version. Unitree's product page marks full secondary development support only for the Go2 EDU, which also has a 15,000 mAh long-endurance battery. The page lists optional high-compute modules such as Orin (40–100 TOPS)."
  - q: "How much does a Unitree Go2 cost?"
    a: "Unitree lists the Go2 AIR at $1,600, PRO at $2,800 and X at $4,500, excluding tax and freight. The EDU version has no public price; buyers contact sales."
  - q: "Can the Unitree Go2 be programmed with ROS 2?"
    a: "Yes. Unitree's unitree_ros2 package controls Go2, B2 and H1 robots through ROS 2 messages over CycloneDDS, tested on ROS 2 Foxy and Humble, with Humble recommended."
  - q: "Can you train a Go2 walking policy with reinforcement learning?"
    a: "Yes. Unitree's open-source unitree_rl_gym trains policies for Go2, H1, H1_2 and G1 in Isaac Gym, tests them in MuJoCo and deploys them to the real robot."
sources:
  - name: "Unitree – Go2 product page"
    url: "https://www.unitree.com/go2"
  - name: "Unitree – unitree_sdk2 (GitHub)"
    url: "https://github.com/unitreerobotics/unitree_sdk2"
  - name: "Unitree – unitree_ros2 (GitHub)"
    url: "https://github.com/unitreerobotics/unitree_ros2"
  - name: "Unitree – unitree_rl_gym (GitHub)"
    url: "https://github.com/unitreerobotics/unitree_rl_gym"
  - name: "Nav2 – Documentation"
    url: "https://docs.nav2.org/rolling/index.html"
---
**Quadruped robots such as the Unitree Go2 give developers a mobile, legged platform with lidar, onboard compute and open interfaces, so teams can build navigation, inspection, perception and learned locomotion without designing a robot first.** For developers, the EDU version is the one built for this: Unitree marks it as the only Go2 version with full secondary development support. For hiring managers, a quadruped is a fast way to see whether a candidate can work across perception, control and systems on a real machine.

## What is the Unitree Go2 and which version do developers need?

The Go2 is a quadruped of about 15 kg with 12 joint motors, sold in four versions; developers need the EDU. All figures below come from Unitree's product page ([Unitree Go2](https://www.unitree.com/go2)).

| Spec | AIR | PRO | X | EDU |
|---|---|---|---|---|
| Price (tax and freight excluded) | $1,600 | $2,800 | $4,500 | Contact sales |
| Weight with battery | About 15 kg | About 15 kg | About 15 kg | About 15 kg |
| Speed | 0–2.5 m/s | 0–3.5 m/s | 0–3.7 m/s (max ~5 m/s) | 0–3.7 m/s (max ~5 m/s) |
| Payload | ≈7 kg (max ~10 kg) | ≈8 kg (max ~10 kg) | ≈8 kg (max ~12 kg) | ≈8 kg (max ~12 kg) |
| Battery | 8,000 mAh | 8,000 mAh | 8,000 mAh | 15,000 mAh |
| Battery life | About 1–2 h | About 1–2 h | About 1–2 h | About 2–4 h |
| Max joint torque | About 45 N·m | About 45 N·m | About 45 N·m | About 45 N·m |
| Secondary development (symbol on page) | ○ | ○ | ◕ (partial) | ● (full) |

Every version carries Unitree's 4D LiDAR L2. For heavier on-robot AI, the page lists optional high-compute modules "such as Orin (40-100TOPS)".

## What can developers build on a quadruped?

Developers can build almost any mobile robotics application that benefits from legs: stairs, rough ground and tight spaces. Common project types:

- **Autonomous navigation:** mapping a building and moving between waypoints. Nav2's documentation lists the Go2 among robots using Nav2 ([Nav2](https://docs.nav2.org/rolling/index.html)).
- **Inspection and monitoring:** carrying cameras or sensors along a route and flagging anomalies.
- **Perception:** object detection, person following and scene understanding from onboard cameras and lidar.
- **Learned locomotion:** training new gaits or behaviours with reinforcement learning.
- **Language and agent interfaces:** connecting a language model to high-level motion commands so a person can direct the robot in plain language.

## How do developers program the Go2?

Developers program the Go2 through two layers: a C++ SDK and a ROS 2 package that speak to the same DDS interface.

### unitree_sdk2

unitree_sdk2 is Unitree's robot SDK, version 2, released under BSD-3-Clause ([unitree_sdk2](https://github.com/unitreerobotics/unitree_sdk2)). It targets Ubuntu 20.04 on aarch64 and x86_64, built with CMake and GCC 9.4.0.

### unitree_ros2

unitree_ros2 adds ROS 2 support for Go2, B2 and H1 over CycloneDDS ([unitree_ros2](https://github.com/unitreerobotics/unitree_ros2)). Because the robots already use DDS, ROS 2 messages can control them directly without wrapping the SDK. It is tested on ROS 2 Foxy (Ubuntu 20.04) and Humble (Ubuntu 22.04), with Humble recommended.

The package exposes two control levels:

| Level | Topic / message | Use |
|---|---|---|
| High-level state | `sportmodestate` | Gait, body motion, foot positions |
| High-level command | `/api/sport/request` | Walk, stand, turn through built-in controllers |
| Low-level state | `lowstate` | Motor, IMU and power data |
| Low-level command | `/lowcmd` (`LowCmd`) | Direct torque, position and velocity per motor |

High-level control is where most application work happens. Low-level control sends torque, position and velocity commands to each motor directly, so it needs care: a wrong command goes straight to the hardware.

## How do teams train new behaviours with reinforcement learning?

Teams train locomotion policies in simulation and transfer them to the robot. Unitree's unitree_rl_gym supports Go2, H1, H1_2 and G1 and documents four steps ([unitree_rl_gym](https://github.com/unitreerobotics/unitree_rl_gym)):

1. **Train** a policy in Isaac Gym.
2. **Play** it back to check behaviour and export the network.
3. **Sim2Sim:** test the policy in MuJoCo.
4. **Sim2Real:** deploy on the robot, which must first be put into debug mode.

This pipeline is a compact test of robot learning skill: reward design, simulation, transfer and safe hardware testing in one project.

## When is a quadruped the right platform instead of a wheeled robot?

A quadruped is the right platform when the robot has to handle terrain or spaces that wheels cannot: stairs, kerbs, gravel, cables on the floor or cluttered industrial sites. A wheeled base is usually simpler when floors are flat and routes are fixed, as in many warehouses.

The trade-offs to weigh:

- **Mobility:** legs handle steps and uneven ground; wheels are more efficient on flat floors.
- **Runtime:** the Go2's listed battery life is about 1–2 hours on standard packs and 2–4 hours on the EDU's long-endurance pack.
- **Payload:** about 7–8 kg on the Go2, depending on version, limits heavy sensor or arm add-ons.
- **Control complexity:** changing how a legged robot walks means low-level control or a trained policy, while application work can stay on the built-in high-level commands.

## What should a team plan for before buying a quadruped?

Plan for safety, space and support time, not just the purchase. A practical checklist:

- **Safety rules:** a clear area, an emergency stop routine and a rule for who may send low-level commands.
- **Battery logistics:** spare batteries or charging breaks; standard packs run about 1–2 hours.
- **Software versions:** pin Ubuntu, ROS 2 and SDK versions to the tested combinations.
- **Compute choice:** decide early whether AI runs on the robot or off-board over the network.
- **Ownership:** one engineer responsible for firmware, updates and maintenance.

## Which skills does quadruped work reveal in a candidate?

Quadruped projects reveal whether a candidate can integrate across the stack under real constraints. Look for:

1. **ROS 2 and DDS fluency:** getting messages flowing to and from the robot quickly.
2. **Navigation:** mapping and waypoint following on a legged base. See [what autonomous navigation engineers do](/articles/autonomous-navigation-engineers).
3. **Perception:** turning camera and lidar data into decisions.
4. **Control judgement:** knowing when to use high-level commands and when low-level control is justified.
5. **Safety habits:** testing at low speed, in clear space, with a stop plan.

## How HackLab helps companies hire engineers who build on quadrupeds

HackLab Edition #2, on 21–22 November 2026 at CIC Berlin, will have a Unitree Go2 EDU quadruped on site alongside robot arms and robot sets, with an Autonomous Navigation track among its four tracks. Companies can watch 200 builders, selected from 1,100+ registrations, work with this hardware for 48 hours; details are in [HackLab Edition #2](/articles/hacklab-edition-2-november-2026). Sponsors can also provide their own hardware, as covered in [providing hardware to a robotics hackathon](/articles/providing-hardware-to-a-robotics-hackathon). To set a quadruped challenge, [partner with HackLab](/for-companies).

*Last updated: 11 November 2026.*
