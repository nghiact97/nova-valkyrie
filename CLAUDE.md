# Nova Valkyrie — project guide for Claude

Anime mecha-girl fork of Nova Vanguard (HTML5 canvas shooter, Capacitor → Android). The owner writes in Vietnamese; reply in Vietnamese, "em" voice, address the owner as "anh".

## How to work a request (orchestration)

1. **The prompt is the spec.** Restate the request as a short task list (in your head or a TaskList), each task = one deliverable that can be checked on its own.
2. **Split and delegate.** Independent tasks go to subagents (Agent tool) running in parallel. Keep in the main thread: integration into `tools/anime-mock.mjs` / `src/game.html`, final tests, the APK build and the reply to the owner.
3. **One task = one branch + worktree.** Spawn agents with `isolation: "worktree"`. The agent works on branch `task/<slug>` (e.g. `task/sprite-mika-fly`) and commits there. When it finishes, the main thread reviews the diff, merges into `main` and deletes the worktree. Tag every APK sent to the owner: `git tag v<versionName>`.
4. **Brief agents tightly (token budget).** A brief = goal, exact files to read/write, the commands to run, what "done" looks like, what NOT to touch. Point to files instead of pasting them. Ask for a short report (paths written + 3–5 lines), not file dumps.
4b. **Scope every code task with the graph (graphify).** Before writing a code brief run `py tools/graph_prep.py` (rebuilds `analysis/graphify-out/graph.json` from `src/game.html` + the JS in `tools/anime-mock.mjs`), then `cd analysis && py -m graphify affected "<fn>"` / `explain "<fn>"` for the functions the request touches. Put the allowed function list (the "scope") in the brief; the agent must stay inside it and report any function it had to touch outside it. After merging, rebuild the graph and run `affected` again on what changed to check nothing outside the request moved. Agents query the graph instead of reading whole files.
5. **Effort/model.** Default effort for agents. Use `effort: "xhigh"` only for genuinely hard tasks (tricky gameplay logic, performance problems, multi-file refactors). Art jobs that just drive Codex and cut sheets are low effort.
6. **Don't duplicate.** Once a task is delegated, do not also do it yourself; wait for the report. Small lookups (a few tool calls) you do inline instead of delegating.
7. **Verify before reporting.** Headless Chrome screenshots / logic checks in the scratchpad (`shot/*.mjs` with puppeteer-core + local Chrome). Say plainly what was and wasn't tested (real phone = A13 `adb -s R58W20BKNQM` only).

## Layout

- `src/game.html` — the game (fork copy; direct gameplay fixes live here).
- `tools/anime-mock.mjs` — builds the anime page by patching `src/game.html` (`patch(from,to)` throws if the target is missing). JS overrides go right after ``const js = ` ``; CSS goes into the style blocks (e.g. `battleui`). Inside that template literal escape `` ` `` and `${`.
- `tools/pack_girls.py` → `build/anime_girls.js` (all anime art as `SPR_SRC.<key>` overrides). `tools/pack_sprites.py` → `build/sprites.js` (base art).
- `art/anime/` — approved art; `art/anime/rejected/` keeps replaced art; `art/anime/refs/` owner references. `docs/` — plans and GPT prompt docs (Vietnamese).

## Commands

```bash
# pack + mock (artifact page)
py tools/pack_girls.py "kestrel=art/anime/style_a_mika.png@435,75,200#300,20,440,370" "seraph=art/anime/stand_seraph.png#300,10,440,370"
node tools/anime-mock.mjs <scratchpad>/anime_home.html      # then Artifact publish to https://claude.ai/artifact/2cfRrNN3Zp47dS4ttKYWBA
# APK (bump versionCode/versionName in android/app/build.gradle first; never write it with PowerShell Set-Content: BOM breaks gradle)
node tools/build-www-anime.mjs && npx cap sync android
android\gradlew.bat assembleDebug          # PowerShell
node tools/send-apk.mjs --notes "..."      # sends to the owner's Telegram group; every new APK goes there
# Codex art (always end the job text with "Generate all now, do not stop to ask for approval.")
codex exec --skip-git-repo-check -s workspace-write -C D:/Node/games/nova_vanguard_anime -i <ref.png> - < art/anime/job_x.txt
```

## Rules the owner set

- Keep the existing UI form; swap only what was asked. Approved looks are frozen (camera, light, material) — change only shape/colour per item.
- On a vague complaint, ask what is wrong; never revert approved work on a guess.
- Every screen fits one phone screen, no scrolling. Popups use the one Valkyrie dialog frame, one popup at a time.
- Show art choices inside the real game UI (patch a copy / runtime override, screenshot) before installing.
- Mockup-only helpers must be hidden in the app build (`if(window.Capacitor)return;`).
- Reference images from Huaban/Pinterest are style references only — never ship them.
- Vietnamese text goes through the `VI` dictionary in `src/game.html` or `L(en,vi)`; check both languages after UI changes.
