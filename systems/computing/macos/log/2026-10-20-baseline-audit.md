---
title: Baseline audit
type: observation
hypothesis: Background items and the Downloads backlog have grown since I last looked, and nothing in the system would have told me.
---

The first step is to measure every stock in the model once, so later experiments have a baseline to compare against.

| Stock | Command | Baseline |
|-------|---------|----------|
| Free disk space | `df -h /` | _to record_ |
| Installed tools | `brew list \| wc -l` | _to record_ |
| Background and login items | `sfltool dumpbtm \| grep -c "Name:"` | _to record_ |
| File backlog | `du -sh ~/Desktop ~/Downloads` | _to record_ |
| Backup recency | `tmutil latestbackup` | _to record_ |

## Next

- Record the numbers above.
- Pick one leverage point to try first. The best candidate is the level-6 "system vitals" readout, since it makes every later experiment visible.
