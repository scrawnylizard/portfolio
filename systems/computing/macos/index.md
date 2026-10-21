---
layout: system
title: macOS
domain: computing
system: macos
order: 1
revised: 2026-10-20
summary: My Mac as a system for doing focused work with as little friction as possible.
purpose: >-
  To turn my intent into finished work quickly and reliably. In practice it also
  collects tools, files, and notifications faster than I prune them, so its real
  behavior drifts toward clutter unless something pushes back.

boundary:
  inside:
    - The Mac's hardware (storage, memory, battery)
    - macOS and its settings
    - Installed apps, Homebrew packages, and login and background items
    - Local files (Desktop, Downloads, Documents)
    - My daily habits at the keyboard
  outside:
    - Apple's update schedule and policies
    - Cloud services (iCloud, GitHub, web apps)
    - The home network
    - Work demands that set what the Mac has to do

stocks:
  - name: Free disk space
    inflows: [Cleanups, Offloading to cloud or external storage]
    outflows: [Downloads, App installs, Caches, Local snapshots]
    measure: df -h /
  - name: Installed tools
    inflows: [App Store and direct installs, brew install]
    outflows: [Uninstalls, brew uninstall]
    measure: brew list | wc -l
  - name: Background and login items
    inflows: [Apps that register helpers or agents]
    outflows: [Disabling in Login Items, Uninstalling apps]
    measure: sfltool dumpbtm | grep -c "Name:"
  - name: File backlog (Desktop + Downloads)
    inflows: [Downloads, Screenshots, Saved attachments]
    outflows: [Filing, Deleting]
    measure: du -sh ~/Desktop ~/Downloads
  - name: Backup recency
    inflows: [Successful Time Machine or cloud backups]
    outflows: [Time passing since the last backup]
    measure: tmutil latestbackup
  - name: Attention
    inflows: [Rest, Uninterrupted blocks]
    outflows: [Notifications, Context switches, Troubleshooting]

loops:
  - id: R1
    type: reinforcing
    name: Tool accretion
    story: >-
      Every new tool promises less friction, but many add a helper process. More
      background load makes the Mac feel slower, which sends me looking for
      another tool to fix it.
    links:
      - { from: Installed tools, to: Background and login items, polarity: "+" }
      - { from: Background and login items, to: Perceived slowness, polarity: "+" }
      - { from: Perceived slowness, to: Search for fixes, polarity: "+" }
      - { from: Search for fixes, to: Installed tools, polarity: "+" }
  - id: R2
    type: reinforcing
    name: Clutter → distraction
    story: >-
      A messy Desktop and Downloads folder makes things harder to find. Searching
      breaks focus, and with less focus I file less, so the backlog grows.
    links:
      - { from: File backlog, to: Time spent searching, polarity: "+" }
      - { from: Time spent searching, to: Attention, polarity: "-" }
      - { from: Attention, to: Filing habits, polarity: "+" }
      - { from: Filing habits, to: File backlog, polarity: "-" }
  - id: B1
    type: balancing
    name: Disk-pressure cleanup
    story: >-
      When free space gets low, macOS warns me and I clean up. The loop works,
      but only after the problem shows up, so it settles at "almost full."
    links:
      - { from: Free disk space, to: Storage warnings, polarity: "-" }
      - { from: Storage warnings, to: Cleanup effort, polarity: "+" }
      - { from: Cleanup effort, to: Free disk space, polarity: "+" }
  - id: B2
    type: balancing
    name: Updates and stability
    story: >-
      Problems push me to update, and updates fix problems, but the fixes arrive
      on Apple's schedule rather than mine.
    links:
      - { from: Instability and security gaps, to: Pressure to update, polarity: "+" }
      - { from: Pressure to update, to: Updates applied, polarity: "+" }
      - { from: Updates applied, to: Instability and security gaps, polarity: "-" }

leverage:
  - level: 12
    point: Parameters
    idea: Raise the low-disk warning threshold so B1 kicks in earlier.
  - level: 6
    point: Information flows
    idea: Put a weekly "system vitals" readout (disk, login items, backup age) where I'll see it, so drift shows up before it becomes a symptom.
  - level: 5
    point: Rules
    idea: One in, one out for menu bar apps and login items. Downloads older than 30 days get deleted automatically.
  - level: 4
    point: Self-organization
    idea: Keep the Mac's setup in a Brewfile and dotfiles so it can be rebuilt from scratch. That makes pruning safe.
  - level: 3
    point: Goals
    idea: Change the goal from "the Mac can do anything" to "the Mac does my work with nothing extra."
---

The main insight so far: **my Mac's default behavior is accumulation.** Every inflow (installs, downloads, helpers) happens with one click, while every outflow takes deliberate effort. Without a rule or a feedback signal, the stocks only grow. B1 works, but it reacts late, so the intervention I want is better *information* (level 6) and simple *rules* (level 5), not occasional heroic cleanups.
