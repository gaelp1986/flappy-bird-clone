# Project Spec — Flappy Bird Clone (Weekend 1)

**Repo name:** `flappy-bird` (matches what we'll link on the resume)
**Stack:** HTML, CSS, vanilla JavaScript. No frameworks, no libraries.
**Goal:** A playable browser game, deployed on GitHub Pages, with a README that makes a recruiter smile in 10 seconds.

---

## Repo structure

```
flappy-bird/
├── index.html      # canvas element + score display
├── style.css       # page layout, start/game-over screens
├── game.js         # ALL game logic lives here
└── README.md
```

Keep it to three code files. Simplicity is a feature — it says "I know what every file does."

---

## Feature checklist (build in this order)

**v1 — playable (Saturday)**
- [x] Canvas renders bird (a square/circle is fine to start)
- [x] Gravity: bird falls with accelerating velocity each frame
- [x] Flap: click / spacebar sets upward velocity
- [x] Pipes spawn on the right, scroll left, despawn off-screen
- [x] Pipe gaps at random heights
- [x] Collision detection: bird vs. pipes, bird vs. ground/ceiling
- [x] Game over state + restart

**v2 — polished (Sunday)**
- [x] Score: +1 per pipe passed, displayed live
- [x] High score persists across page reloads (localStorage — fine here, it's a game score, not a password)
- [x] Start screen ("click to play") and game-over screen with score
- [x] One polish item of your choice: sprite/graphics, sound effect, difficulty ramp, or pause. Pick ONE and finish it.

**Deploy**
- [x] Push to GitHub → Settings → Pages → deploy from main branch
- [ ] Verify the live URL works on your phone

---

## Core vs. shell (what you must OWN)

**Shell (vibe freely):** HTML boilerplate, CSS, canvas setup, start/game-over screens, README formatting.

**Core (~50 lines — read, understand, rewrite from memory):**
1. **The game loop** — `requestAnimationFrame`, and what happens each frame: update velocity → update positions → check collisions → draw. Know the order and why.
2. **Gravity math** — `velocity += gravity; y += velocity;` Two lines. Know why velocity accumulates (that's what makes the fall accelerate) and what flap does (`velocity = -jumpStrength`).
3. **Collision detection** — axis-aligned bounding box (AABB) overlap check. Be able to whiteboard: two rectangles overlap when `birdRight > pipeLeft && birdLeft < pipeRight && (birdTop < gapTop || birdBottom > gapBottom)`.

**Self-test before you link this repo anywhere:** close the laptop and explain out loud (1) what runs every frame and in what order, (2) why the bird accelerates as it falls, (3) how you know the bird hit a pipe. Under 2 minutes total. If you stumble, have Claude Code re-explain, then test again.

---

## Commit plan (fills the contribution graph honestly)

Don't push one giant commit. Commit at each working milestone:
`canvas + bird renders` → `gravity and flap` → `pipes scrolling` → `collision + game over` → `scoring` → `start/end screens` → `polish` → `README` → `deploy`. That's ~9 commits over a weekend — exactly what "person who codes" looks like.

---

## README template

```markdown
# Flappy Bird Clone
Browser-based Flappy Bird recreation in vanilla JavaScript.
**[▶ Play it live](your-github-pages-url)**

![gameplay GIF]   ← record with ScreenToGif/Kap; a moving image doubles engagement

## How it works
- Game loop via requestAnimationFrame (~60fps)
- Physics: gravity accumulates velocity each frame; flap applies impulse
- Collision: AABB checks between bird and pipe pairs
- High score persisted with localStorage

## Run locally
Open index.html in a browser. That's it.

## Built with
Vanilla JS/HTML/CSS. Developed using an AI-assisted workflow with
Claude Code (Anthropic "Claude Code in Action" certified) — AI for
scaffolding, human review and ownership of all game logic.

Originally built at All Star Code (2023); rebuilt and expanded 2026.
```

That last line matters: it's honest about the history and shows growth.

---

## Interview questions to be ready for
1. Walk me through your game loop.
2. How does collision detection work? What's the edge case at the gap?
3. Why requestAnimationFrame instead of setInterval?
4. What would you change to add difficulty over time?
5. What part did AI write, and how did you verify it? (Answer honestly and confidently — "I directed it, reviewed everything, and can rewrite the core logic" is a GOOD answer in 2026.)
