# Nova Vanguard - space-hardware icon plan

Approved style samples, attached to every prompt: icon_daily.png, icon_mail.png, icon_shop.png. Those three are already in game and are not redrawn.
The badge-style icons in `art/v2/` are superseded. They stay in game only until their space replacement is approved.

| # | Prompt file | Purpose | Icons | Count |
|---|---|---|---|---|
| 1 | `batch1_menu.txt` | Menu and navigation (finish the Home screen) | home, hangar, settings, campaign, rank, quests, spin, offer | 8 |
| 2 | `batch2_battle_settings.txt` | Battle buttons and Settings rows | shield, bomb, music, sfx, vibration, graphics, language | 7 |
| 3 | `batch3_upgrades.txt` | Hangar upgrade skills | armor, magnet, power, coinboost | 4 |
| 4 | `batch4_skills_a.txt` | In-battle skills, part 1 | sk_multishot, sk_rapid, sk_damage, sk_pierce, sk_crit, sk_missile, sk_orbit | 7 |
| 5 | `batch5_skills_b.txt` | In-battle skills, part 2 | sk_lightning, sk_wing, sk_drone, sk_nova, sk_regen, sk_maxhp, sk_magnet | 7 |
| 6 | `batch6_currency_hud.txt` | Currency and HUD symbols (shown small, often at 16-24 px) | coin, gem, energy, heart | 4 |
| | | **Total** | | **37** |

## Order and why
1. Batch 1 first: it finishes the Home screen, where the mix of old badge icons and new space icons is most visible.
2. Batches 2-3 cover Settings, the battle buttons and the Hangar Skills tab.
3. Batches 4-5 cover the 14 level-up skill cards, the most-seen icons during a run.
4. Batch 6 covers the currency and HUD symbols. They need a small code change so painted icons can also show without a plate (top bar, prices, HP heart).

## Review loop per batch
1. Send the batch prompt with the 3 samples attached (Codex CLI on this PC, or Codex/ChatGPT by hand), then save or upload the PNGs.
2. Claude packs them, places them in the real UI and screenshots the screens at phone size.
3. The user approves, or names the icons to redraw. Approved names go into `UI_APPROVED` with `UI_VARIANT = space` in `tools/pack_sprites.py`. Redraws reuse the same prompt line with a note about what to change.

Pending redraw: Offer (the capsule read as a bomb). It is included in batch 1 as a hologram gift box with a % tag.
