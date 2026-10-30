# Nova Vanguard: ship equipment (gear) plan

## 1. Goal
Gear is a second, long-term progression layer on top of ship levels. It makes stage drops and crates exciting, and it adds a reason to replay stages. It must stay readable on a phone: 4 slots, a small set of stats and clear comparisons.

## 2. Core rules
| Item | Rule |
|---|---|
| Slots | 4 per ship: **Cannon**, **Engine**, **Plating**, **Core** |
| Rarity | Common → Rare → Epic → Legendary (Mythic reserved for later). Colours match the ship rarity colours |
| Main stat | Fixed by slot. Cannon = Damage %, Engine = Fire rate %, Plating = Max HP, Core = Skill cooldown % / XP gain % |
| Sub stats | Common 0, Rare 1, Epic 2, Legendary 3, rolled from: Crit %, Boss damage %, Coin %, Pickup range, Shield duration, Start XP |
| Level | Lv 1–10 per rarity. Cost: coins + *Alloy* (the material). Each level adds +8% to the main stat |
| Merge | 3 identical items of the same rarity → 1 item one rarity higher (level carries over at 50%) |
| Sets | Each item belongs to a set. **2 pieces** = small bonus, **4 pieces** = signature effect |
| Shared | Gear is equipped per ship. One tap moves a full loadout to another ship |
| Power | Ship POWER = ship power + sum of gear power, so the existing POWER number keeps working |

### First 3 sets (12 items)
| Set | Theme / colour | 2-piece | 4-piece |
|---|---|---|---|
| **Vanguard** | balanced, cyan | +8% damage | Every 10th volley fires a piercing beam |
| **Aegis** | defence, green | +1 max HP | Shield skill lasts +2s and repairs 1 HP when it ends |
| **Solar** | attack, gold | +10% crit | Crits have a 15% chance to trigger a mini nova |

## 3. Where gear comes from
| Source | What drops |
|---|---|
| Boss stages (x-5, x-10) | 1 guaranteed item (Common/Rare, with Epic on Hard and Nightmare) |
| Normal stages | Alloy, with a small chance of a Common item |
| Shop crates | The existing Silver/Epic/Legend crates also roll gear |
| Events / daily chest | Alloy and Epic items |
| Dismantle | Unwanted items give back Alloy |

## 4. Screens (UI)
1. **Hangar → new "Gear" tab** (between Ships and Skills).
   - Top: the selected ship on its hologram pad with **4 slot frames around it** (2 left, 2 right). An empty slot shows a dim slot silhouette.
   - Under the ship: POWER, plus the active set bonuses as chips ("Vanguard 2/4").
   - Bottom: **inventory grid, 4 per row**. Filter chips (All / Cannon / Engine / Plating / Core), sort by rarity or power. A red dot marks items that are better than what is equipped.
2. **Item detail popup** (tap any item): large icon in a rarity frame, name, Lv, main stat, sub stats, set bonus progress, and a **comparison with the equipped item** (green ▲ / red ▼). Buttons: Equip · Upgrade · Merge · Dismantle.
3. **Merge popup**: 3 slots plus the result preview, with an auto-fill button.
4. **Battle result**: new gear drops appear as reward tiles with a rarity glow.

Rarity is drawn **by code** (frame colour, glow and corner gems), not painted into the icon. One icon per item type is therefore enough for all 4 rarities, which keeps the art count low.

## 5. Art plan (Codex)
The style is locked to the approved space-hardware icons (`art/v2/space/icon_shop.png`, `icon_daily.png`, `icon_mail.png`): gunmetal hull, a few white armour panels, neon strips in the accent colour, a thick navy outline, a transparent background and no frame.

| Batch | Content | Count |
|---|---|---|
| 0 - sample | Vanguard Cannon only, for approval | 1 |
| 1 | Vanguard set: Cannon, Engine, Plating, Core | 4 (3 new) |
| 2 | Aegis set | 4 |
| 3 | Solar set | 4 |
| 4 | Materials: Alloy, Merge catalyst, Dismantle (salvage) icon | 3 |

The 4 empty-slot silhouettes and the rarity frames are drawn in code (vector).

Prompts: `art/v2/space/gear_*.txt`. Same review loop as the icons: send, upload, Claude puts them in the real UI, approve.

## 6. Development phases
| Phase | Scope | Check |
|---|---|---|
| P1 | Data model (items, inventory, loadout per ship), Gear tab with slots + inventory, equip/unequip, stats applied in battle | Equip changes POWER and damage in the battle sim |
| P2 | Item detail popup with comparison, upgrade with coins + Alloy, sub stats | Upgrade costs and stat growth show in the popup |
| P3 | Merge, dismantle, set bonuses (2/4) including the 3 signature effects | Set chips light up and effects trigger in battle |
| P4 | Drop sources (boss stages, crates, events) and the result-screen reward tiles | Drops appear after stages, inventory fills |
| P5 | Balance: drop rates, costs, power curve. Bot-simulate stages 1-30 so a no-gear player can still clear Normal | Sim win rates per world |
| P6 | Painted icons swapped in as each art batch is approved | Screenshots of every gear screen at phone size |

## 7. Open decisions for the user
1. Gear per ship (current proposal) or one shared loadout for all ships?
2. Merge (3 → 1) as the main way to rarity-up, or only drops and crates?
3. Should Legendary gear be purchasable directly, or crate-only?
