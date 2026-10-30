# Nova Vanguard: mini-bosses and shooting effects plan

## 1. Goals
- Break up the long middle of a stage. Today it is waves of small enemies and then the boss at x-5 / x-10. A mini-boss mid-stage gives a second peak and a reward moment.
- Make every shot feel heavier: muzzle, trail, impact, explosion and screen feedback. Players also get clear warnings before dangerous enemy attacks.
- Reuse the existing systems: the enemy bullet types (`ebSpecial`), `boltPath` / `drawNova`, sprites from Codex, and the Graphics Low/High setting.

## 2. Mini-boss rules
| Item | Rule |
|---|---|
| When | One mini-boss per normal stage, at wave `ceil(waves/2)`. Boss stages: none in World 1-2; from World 3 one mini-boss guards the wave before the boss |
| Entry | Short red banner "ELITE INBOUND" + name, small HP bar under the stage HUD (not the big boss bar) |
| HP | About 30% of that stage's boss HP; scales with difficulty like bosses |
| Reward | Coin shower, 6 XP crystals, 25% gear drop (Common/Rare; Epic on Nightmare), +15% Ult charge |
| Escape | If not killed within 25 s it flies away (no reward), so a weak build is never stuck |
| Codex art | 1 sprite per mini-boss, top-down, facing down, ~60% of a boss in size |

## 3. The 8 mini-bosses
Two per world. Each teaches one mechanic that the world's boss later uses at full scale.

| # | Name | World | Mechanic (what the player must do) | Attack |
|---|---|---|---|---|
| 1 | **Carrier** | 1 | Kill it before its hangar keeps launching darts | Opens a glowing bay and launches 3 darts every 4 s. The bay is a weak spot (x2 damage) while open |
| 2 | **Sniper** | 1 | Watch the red laser sight, then sidestep | Red aim line tracks the player for 1.2 s, locks (line turns white), then fires one very fast piercing shot along it |
| 3 | **Mine Layer** | 2 | Keep space, shoot mines early | Drops slow mines that blink, then burst into a ring (reuses the splitter shell) |
| 4 | **Shield Bearer** | 2 | Shoot when the shield vents | Rotating front energy shield blocks bullets (shows ripple). Every 5 s it vents for 2 s and takes x1.5 damage |
| 5 | **Twin Turrets** | 3 | Kill one turret to break the beam | Two linked turrets enter from the sides with a laser fence between them that sweeps down the screen |
| 6 | **Splitter** | 3 | Prepare for more targets | Organic blob that splits into 2 then 4 smaller copies when killed. Each copy fires seeker orbs |
| 7 | **Phase Wraith** | 4 | Track where it reappears | Blinks out (fade + ring), reappears 0.6 s after a marker shows, fires a brake curtain at reappearance |
| 8 | **Charger** | 4 | Dodge the dash lane | Shows a red lane on the floor for 0.8 s, then rams down or across the lane at high speed and returns |

Telegraph rule: every dangerous mini-boss attack shows a warning first (aim line, lane, blink marker or mine blink) for at least 0.6 s.

## 4. Shooting effects
### Player side
| Effect | Detail |
|---|---|
| Muzzle flash | Short flash sprite at each gun nozzle per volley, coloured per ship weapon; ship recoils 1-2 px |
| Bullet trails | Fast bullets get a short additive streak; homing shots get curved trails (like the missiles) |
| Impact sparks | Directional sparks pointing back along the bullet's path, colour of the bullet; armoured enemies (tank, shield) show a hex ripple instead |
| Damage numbers | Small white numbers on bosses / mini-bosses only; crits are bigger, yellow, with a pop. Off on Low graphics |
| Charge-up | Beam ships (Viper, Nebula ult) and the Laser Storm show a 0.3 s charge glow before firing |

### Enemy side
| Effect | Detail |
|---|---|
| Fire telegraph | Boss/mini-boss cannons glow 0.4 s before a volley; the patterns that aim (fan, sniper) flash the muzzle white |
| Danger zones | Red lane / ring on the ground for chargers, mortars and mines |
| Bullet readability | All enemy bullets keep warm colours (red, orange, pink, cyan-for-slow) with a dark outline so they read over any background |

### Explosions and screen feedback
| Tier | When | Effect |
|---|---|---|
| Pop | Small enemy | Flash + 8-12 particles |
| Blast | Tank, elite, mini-boss part | Fireball + shockwave ring + 3-5 debris chunks + short shake |
| Boss death | Boss, mini-boss | Chain of 5-8 explosions over 1.2 s, white screen flash, 0.25 s slow motion, then a big shockwave and the loot shower |
| Hit-stop | Crit on boss, ult hit, boss death | Freeze 30-60 ms (feels heavy without slowing the game) |

Performance: particle cap per frame (High 400, Low 120), pooled particle objects, and Low graphics drops trails, damage numbers and debris.

## 5. Art (Codex)
Same flow as before: 1 approved sample, then the batch. Prompts are in `art/miniboss_0_sample.txt` and `art/miniboss_1_batch.txt`.

| Step | Content | Images |
|---|---|---|
| 0 | Carrier (sample for approval) | 1 |
| 1 | The other 7 mini-bosses (Twin Turrets is one turret sprite, mirrored) | 7 |

All shooting effects are drawn in code. No art is needed for them.

## 6. Development phases
| Phase | Scope | Check |
|---|---|---|
| P1 | Mini-boss framework: entity type, spawn rule, small HP bar, banner, escape timer, rewards | Sim: one mini-boss per stage, reward drops, escape works |
| P2 | Mini-bosses 1-4 (World 1-2) with telegraphs | Sim each one; screenshot telegraph + attack |
| P3 | Mini-bosses 5-8 (World 3-4) | Same |
| P4 | Player FX: muzzle flash, trails, impact sparks, damage numbers, charge-up | Screenshot each of the 8 ships firing |
| P5 | Enemy telegraphs, danger zones, explosion tiers, boss death sequence, hit-stop | Screenshot sequence frames; FPS check on Low |
| P6 | Balance (HP, timers, rewards) with the stage bot; Low/High performance pass | Win rate per world unchanged ±5%, stage length +15-25 s |

## 7. Open decisions
1. Mini-boss in every normal stage, or only every second stage?
2. Should mini-bosses also appear in Endless (every 4th wave) and the Event?
3. Damage numbers: show on all enemies, or only bosses and mini-bosses (proposal: only bosses)?
