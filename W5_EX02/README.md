# Week 5 Example 2 — Animated Coin

## What This Example Demonstrates

> **Note for students:** This section is included in example files only to help you study. Do not include it in your Side Quest submissions.

This example introduces animating multiple sprite sheet objects independently by giving each one its own frame counter.

- **Single-row sprite sheet** — the coin sheet has only one row of 8 frames; `sy` (source y) is always 0, so only `sx` needs to change to advance the animation
- **Independent frame counters** — each coin object has its own `frame` and `frameTimer` properties so they animate at different points in the cycle
- **Offset start frames** — coins are created with different starting frame values so they don't all spin in sync, giving visual variety
- **`updateCoins()` and `drawCoins()` separation** — update logic and drawing are kept in separate functions; this is the same pattern used in Example 3 and makes code easier to read and extend
- **`frameTimer`** — counts up every `draw()` call; when it reaches `animSpeed`, the frame advances and the timer resets to 0
- **`% numFrames`** — the modulo operator wraps the frame back to 0 after the last frame, creating a continuous loop
- **`COIN` config object** — groups all sprite settings in one place so `animSpeed`, `scale`, and `numFrames` are easy to adjust
- **`imageMode(CENTER)`** — makes `image()` draw from the centre point; useful for positioning objects by their middle

## Setup and Interaction Instructions

To run the sketch locally, open `index.html` in Google Chrome using Live Server.

Five coins spin on screen — no interaction needed. Watch how each coin is at a different point in the animation cycle.

**Opening the Chrome Console**

- **Windows:** Press `F12` or `Ctrl + Shift + J`, then click the **Console** tab
- **Mac:** Press `Cmd + Option + J`

The console will show any errors in your sketch.

## Assets

| File | Source |
|------|--------|
| `assets/images/coin_gold.png` | Bellanger, C., Animated Coins — OpenGameArt.org |

## References

Bellanger, C. n.d. *Animated Coins*. OpenGameArt.org. Retrieved May 1, 2026, from https://opengameart.org/content/animated-coins-0
