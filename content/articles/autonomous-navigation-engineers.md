---
slug: autonomous-navigation-engineers
title: "What Autonomous Navigation Engineers Do and How to Hire Them"
description: "Autonomous navigation engineers make robots localise, map, plan and move safely. The stack (ROS 2, Nav2, SLAM), the skills to test and how to hire them."
category: Physical AI
date: 2026-11-11
target_query: "what autonomous navigation engineers do and how to hire them"
tags: [autonomous navigation, ROS 2, Nav2, SLAM, mobile robots, robotics hiring]
related: [quadruped-robots-for-developers-unitree-go2, simulation-skills-for-robotics-engineers, how-to-hire-robotics-engineers-in-berlin]
faq:
  - q: "What does an autonomous navigation engineer do?"
    a: "They build the software that lets a mobile robot know where it is, map its surroundings, plan a path and follow it without collisions. In ROS 2 teams this usually means working with Nav2, a SLAM package, sensor drivers and a simulator."
  - q: "What is Nav2?"
    a: "Nav2 is the ROS 2 navigation framework, which describes itself as an open-source, production-grade autonomy framework trusted by 300+ companies. It combines behaviour trees, planners, controllers, costmaps and localisation such as AMCL."
  - q: "Which ROS 2 version should navigation candidates know?"
    a: "The distributions with long support windows matter most. ROS 2 Humble is supported until May 2027, Jazzy until May 2029 and Lyrical Luth, released in May 2026, until May 2031, so migration experience between them is valuable."
  - q: "How can we see navigation skills before hiring?"
    a: "Watch candidates get a real robot to navigate a space. HackLab Edition #2 has an Autonomous Navigation track and a Unitree Go2 EDU quadruped on site."
sources:
  - name: "Nav2 – Documentation"
    url: "https://docs.nav2.org/rolling/index.html"
  - name: "SLAM Toolbox (GitHub)"
    url: "https://github.com/SteveMacenski/slam_toolbox"
  - name: "ROS 2 Documentation – Distributions (source)"
    url: "https://raw.githubusercontent.com/ros2/ros2_documentation/rolling/source/Releases.rst"
  - name: "Autoware Foundation – Autoware (GitHub)"
    url: "https://github.com/autowarefoundation/autoware"
---
**Autonomous navigation engineers build the software that lets a mobile robot answer four questions continuously: where am I, what is around me, where should I go, and how do I get there without hitting anything.** In practice that means localisation, mapping, path planning, motion control and obstacle handling, usually on ROS 2 with Nav2. To hire one, test whether they can make a real robot navigate a real space and explain why it failed when it did.

## What does an autonomous navigation engineer do day to day?

They integrate sensors, maps and planners into a system that moves a robot reliably, then tune it until it works in the target environment. A typical week mixes four kinds of work:

- **Integration:** connecting lidar, cameras, IMU and wheel or leg odometry into one consistent set of coordinate frames.
- **Tuning:** adjusting planner, controller and costmap parameters for a specific robot and building.
- **Testing:** running scenarios in simulation and then on hardware, logging every run.
- **Debugging:** working out whether a failure came from localisation drift, a bad map, the planner or the controller.

The last point is the core of the job: a failure often comes from an interaction between layers rather than from one bug.

## What does the autonomous navigation stack look like?

The stack has five layers, and each one has a widely used open-source tool in the ROS 2 world.

| Layer | Question it answers | Common open-source tools | Skill to test |
|---|---|---|---|
| Localisation | Where am I on the map? | AMCL (in Nav2), SLAM Toolbox localisation mode | Diagnosing drift and relocalisation |
| Mapping (SLAM) | What does the space look like? | SLAM Toolbox | Building and updating maps of large spaces |
| Global planning | Which route should I take? | Nav2 planners: Smac (2D, Hybrid-A*, State Lattice), NavFn, Theta Star | Choosing a planner for the robot's kinematics |
| Local control | How do I follow the route safely? | Nav2 controllers: DWB, MPPI, Regulated Pure Pursuit | Tuning for speed, smoothness and clearance |
| Behaviour | What do I do when stuck? | Nav2 behaviour trees | Designing recovery logic |

### Nav2

Nav2 describes itself as "an open-source, production-grade autonomy framework trusted by 300+ companies worldwide" ([Nav2 documentation](https://docs.nav2.org/rolling/index.html)). It uses behaviour trees to orchestrate modular servers for planning, control, costmaps and localisation, and says it supports "nearly any class of robot kinematics and dynamics". Its documentation lists robots using Nav2, including Unitree's G1 humanoid and Go2 quadruped.

### SLAM Toolbox

SLAM Toolbox is a set of 2D SLAM tools "for lifelong mapping and localization in potentially massive maps with ROS" ([SLAM Toolbox](https://github.com/SteveMacenski/slam_toolbox)). It offers synchronous mapping, asynchronous mapping, a localisation mode and experimental lifelong mapping. Its README notes synchronous mode has been used to map a 200,000 sq. ft. building.

### Road vehicles: Autoware

Road autonomy uses a different stack. Autoware describes itself as "the world's leading open-source software project for autonomous driving", is managed by the Autoware Foundation, and covers perception, localisation, planning and control for vehicles ([Autoware](https://github.com/autowarefoundation/autoware)). Candidates from automotive teams often know this stack rather than Nav2.

## Which ROS 2 versions matter for hiring?

The distributions with roughly five-year support windows matter most, because products stay on them for years; Kilted Kaiju, by contrast, is supported for about 18 months. According to the ROS 2 documentation ([ROS 2 distributions](https://raw.githubusercontent.com/ros2/ros2_documentation/rolling/source/Releases.rst)):

| Distribution | Released | End of life |
|---|---|---|
| Humble Hawksbill | 23 May 2022 | May 2027 |
| Jazzy Jalisco | 23 May 2024 | May 2029 |
| Kilted Kaiju | 23 May 2025 | December 2026 |
| Lyrical Luth | 22 May 2026 | May 2031 |

Humble reaches end of life in May 2027, so any team still on it has a migration ahead. Engineers who have already moved a navigation stack between distributions shorten that work.

## What skills separate strong navigation engineers?

Strong navigation engineers understand the physics of their robot and the failure modes of each layer. Look for:

1. **Coordinate frames and transforms.** They can find a wrong or missing transform quickly.
2. **Sensor knowledge.** They know what lidar, depth cameras and odometry get wrong, and how to fuse them.
3. **Kinematics awareness.** They choose planners and controllers that match a differential-drive, omnidirectional, car-like or legged base.
4. **Simulation habits.** They test in a simulator first. See [simulation skills for robotics engineers](/articles/simulation-skills-for-robotics-engineers).
5. **Data discipline.** They record runs, replay them and compare parameter changes on the same data.
6. **Safety thinking.** They define speed limits, stop zones and behaviour when localisation is lost.

## How do you interview an autonomous navigation engineer?

Interview with a real failure, not a whiteboard algorithm. A useful format has three parts:

1. **Log review (30 minutes).** Give the candidate a recorded run where the robot got stuck or drifted. Ask them to find the cause.
2. **Design discussion (30 minutes).** Describe your robot and environment. Ask which localisation, planner and controller they would choose and why.
3. **Practical task (half a day, or a hackathon).** Have them get a robot to navigate between two points in an unfamiliar space.

Questions that reveal real experience:

- What was the largest space you mapped, and how did you handle loop closure?
- What did you change when the robot oscillated near obstacles?
- How did you test recovery behaviours?

## Where do you find autonomous navigation engineers?

Navigation engineers come from mobile robotics companies, automotive teams, university robotics labs and the ROS open-source community. In Berlin, the local robotics ecosystem and university groups are a source of candidates; see [how to hire robotics engineers in Berlin](/articles/how-to-hire-robotics-engineers-in-berlin). Many strong juniors have built navigation on a student robot or a quadruped, and that experience transfers.

## How HackLab helps companies hire autonomous navigation engineers

HackLab Edition #2, on 21–22 November 2026 at CIC Berlin, includes an Autonomous Navigation track, and a Unitree Go2 EDU quadruped will be on site alongside robot arms and robot sets. Companies can watch 200 builders, selected from 1,100+ registrations, work on navigation problems for 48 hours. Edition #1 led to 5 hires at sponsor companies. To set a navigation challenge or meet these builders, [partner with HackLab](/for-companies).

*Last updated: 11 November 2026.*
