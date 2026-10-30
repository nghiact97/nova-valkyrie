"""Write art/v2/space/PLAN.md and one Codex prompt per icon batch.

Style is locked by the approved space-hardware samples in art/v2/space/:
icon_daily.png (hologram on an emitter base), icon_mail.png (hologram on an emitter base) and icon_shop.png (hardware object).
"""
from pathlib import Path

SPACE = Path(__file__).resolve().parent.parent / "art" / "v2" / "space"
REFS = "icon_daily.png, icon_mail.png, icon_shop.png"

STYLE = f"""STYLE (identical for every icon; match the attached APPROVED samples {REFS} exactly):
- Space-hardware look: dark gunmetal hull (#2a3150 to #141a44) with a few clean white armour panels, thin neon light strips in the icon's accent colour, and one glass or hologram element. Real spaceship hardware, stylised for a game. No toy plastic, no everyday household objects.
- Two families, as in the samples: HARDWARE (a solid object, like icon_shop.png) or HOLOGRAM (a low, wide gunmetal emitter base projecting a glowing symbol, like icon_daily.png and icon_mail.png). Each icon below says which family it belongs to.
- Thick dark-navy outline (#0a0e2a) around the whole object; one soft light from the top-left; one crisp specular highlight; neon parts glow softly with a tight glow (no spray).
- Bold silhouette, at most 3-4 large shapes. NO greebles, rivets, scratches, micro-text, letters, numbers or random sparkles.
- No badge, plate, circle or frame behind the object. Front-on view, at most a very slight 3/4 tilt, centred, filling about 85% of the canvas, same visual size as the samples.
- Must stay instantly readable at 32x32 px on a dark starfield.
- Output per icon: PNG 1024x1024, FULLY transparent background with a clean, smooth edge (no halo, no speckles). No text, no watermark.
- Make the first icon, compare it with the samples, then keep the rest of the batch consistent with it."""

# (file stem, family, subject, accent)
BATCHES = [
    ("batch1_menu", "Menu and navigation (finish the Home screen)", [
        ("home", "HARDWARE", "a compact ring-shaped space station with a glowing docking-bay door in the centre", "cyan"),
        ("hangar", "HARDWARE", "a jet fighter seen from above, nose up, gunmetal hull with white wing panels and twin glowing engines", "cyan"),
        ("settings", "HARDWARE", "a chunky machined gear with 8 teeth and a glowing energy core in the centre", "cyan core, steel-blue rim light"),
        ("campaign", "HOLOGRAM", "a planet with a curved flight-path arc and one gold target marker on the arc", "cyan planet, gold marker"),
        ("rank", "HARDWARE", "a military insignia: a five-point star on a chevron with two short swept wings", "gold"),
        ("quests", "HARDWARE", "a rugged mission tablet whose screen shows two glowing check marks", "green"),
        ("spin", "HARDWARE", "an energy reactor wheel: gunmetal outer ring, 6 glowing segments alternating pink and gold, a gold pointer at the top", "pink + gold"),
        ("offer", "HOLOGRAM", "a glowing gift box with a bow, plus a small round tag showing a bold percent sign (the % symbol is allowed here)", "gold box, pink tag"),
    ]),
    ("batch2_battle_settings", "Battle buttons and Settings rows", [
        ("shield", "HARDWARE", "a compact shield generator projecting a curved hexagon-pattern energy dome", "cyan"),
        ("bomb", "HARDWARE", "a round plasma bomb with a gunmetal shell, a glowing core window and a short fuse cap", "red core, gold spark at the cap"),
        ("music", "HOLOGRAM", "a pair of beamed music notes", "blue"),
        ("sfx", "HARDWARE", "an angular speaker module emitting two curved sound waves to the right", "blue"),
        ("vibration", "HARDWARE", "a rugged handheld comm device standing upright with zig-zag vibration marks on both sides", "violet"),
        ("graphics", "HARDWARE", "a sci-fi visor-style display screen on a short stand showing one bright four-point sparkle", "pink"),
        ("language", "HOLOGRAM", "a globe with latitude and longitude lines and a small speech bubble at the top right", "green"),
    ]),
    ("batch3_upgrades", "Hangar upgrade skills", [
        ("armor", "HARDWARE", "an armoured chest plate with a glowing repair cross in the centre", "green"),
        ("magnet", "HARDWARE", "a heavy horseshoe electromagnet pointing up, with energy arcs between the tips", "violet"),
        ("power", "HARDWARE", "a square power-core chip with pins on all sides and two glowing upward chevrons on its face", "cyan"),
        ("coinboost", "HARDWARE", "a gold credit chip-coin with a glowing upward arrow beside it", "gold + green arrow"),
    ]),
    ("batch4_skills_a", "In-battle skills, part 1", [
        ("sk_multishot", "HARDWARE", "a triple-barrel cannon muzzle firing three bolts that fan out upward", "cyan bolts"),
        ("sk_rapid", "HARDWARE", "a short gatling barrel cluster with bright speed streaks", "gold"),
        ("sk_damage", "HARDWARE", "an armour-piercing round hitting with a hot impact starburst", "red + gold"),
        ("sk_pierce", "HARDWARE", "a bolt passing straight through two upright armour plates", "cyan"),
        ("sk_crit", "HOLOGRAM", "a targeting crosshair with a bright four-point star in the centre", "gold"),
        ("sk_missile", "HARDWARE", "a homing missile flying diagonally up-right with a curved exhaust trail", "red + gold trail"),
        ("sk_orbit", "HARDWARE", "a bright core orb with three plasma orbs circling it on a ring", "violet"),
    ]),
    ("batch5_skills_b", "In-battle skills, part 2", [
        ("sk_lightning", "HARDWARE", "a forked chain-lightning bolt jumping between two small emitter nodes", "electric blue"),
        ("sk_wing", "HARDWARE", "a delta-wing fighter seen from above with two side cannons firing angled shots outward", "green shots"),
        ("sk_drone", "HARDWARE", "two small diamond-shaped escort drones flying side by side, slightly offset", "cyan lights"),
        ("sk_nova", "HOLOGRAM", "an expanding shockwave ring around a bright white core", "gold"),
        ("sk_regen", "HARDWARE", "a repair module with a big glowing medical cross and tiny nanobot dots around it", "green"),
        ("sk_maxhp", "HARDWARE", "an armoured mechanical heart core with a small glowing upward arrow", "pink + green arrow"),
        ("sk_magnet", "HARDWARE", "a horseshoe magnet pulling two small energy crystals toward it", "violet + cyan crystals"),
    ]),
    ("batch6_currency_hud", "Currency and HUD symbols (shown small, often at 16-24 px)", [
        ("coin", "HARDWARE", "a thick gold credit coin with a star emblem, seen face-on", "gold"),
        ("gem", "HARDWARE", "a faceted energy crystal gem", "pink-magenta"),
        ("energy", "HARDWARE", "a compact energy cell battery with a lightning core window", "cyan"),
        ("heart", "HARDWARE", "an armoured mechanical life-core heart", "pink-red"),
    ]),
]


def main():
    total = sum(len(b[2]) for b in BATCHES)
    plan = [
        "# Nova Vanguard - space-hardware icon plan", "",
        f"Approved style samples, attached to every prompt: {REFS}. Those three are already in game and are not redrawn.",
        "The badge-style icons in `art/v2/` are superseded. They stay in game only until their space replacement is approved.", "",
        "| # | Prompt file | Purpose | Icons | Count |", "|---|---|---|---|---|",
    ]
    for i, (fn, title, items) in enumerate(BATCHES, 1):
        plan.append(f"| {i} | `{fn}.txt` | {title} | {', '.join(n for n, *_ in items)} | {len(items)} |")
        lines = [
            f'Create {len(items)} mobile-game UI icons for "Nova Vanguard", a vertical-scrolling space shooter for phones. '
            "The icons sit directly on a dark navy deep-space starfield. Do not create any other images.", "",
            f"Attached: the APPROVED style samples {REFS}.", "", STYLE, "",
            "ICONS (file - family - subject - accent colour):",
        ]
        for k, (n, fam, subj, acc) in enumerate(items, 1):
            lines.append(f"{k}. art/v2/space/icon_{n}.png - {fam} - {subj} - accent: {acc}.")
        lines += ["", "Save each file at exactly the path given. When done, list the files with their sizes."]
        (SPACE / f"{fn}.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")
    plan += [
        f"| | | **Total** | | **{total}** |", "",
        "## Order and why",
        "1. Batch 1 first: it finishes the Home screen, where the mix of old badge icons and new space icons is most visible.",
        "2. Batches 2-3 cover Settings, the battle buttons and the Hangar Skills tab.",
        "3. Batches 4-5 cover the 14 level-up skill cards, the most-seen icons during a run.",
        "4. Batch 6 covers the currency and HUD symbols. They need a small code change so painted icons can also show without a plate (top bar, prices, HP heart).", "",
        "## Review loop per batch",
        "1. Send the batch prompt with the 3 samples attached (Codex CLI on this PC, or Codex/ChatGPT by hand), then save or upload the PNGs.",
        "2. Claude packs them, places them in the real UI and screenshots the screens at phone size.",
        "3. The user approves, or names the icons to redraw. Approved names go into `UI_APPROVED` with `UI_VARIANT = space` in `tools/pack_sprites.py`. Redraws reuse the same prompt line with a note about what to change.",
        "", "Pending redraw: Offer (the capsule read as a bomb). It is included in batch 1 as a hologram gift box with a % tag.",
    ]
    (SPACE / "PLAN.md").write_text("\n".join(plan) + "\n", encoding="utf-8")
    print("\n".join(plan))


if __name__ == "__main__":
    main()
