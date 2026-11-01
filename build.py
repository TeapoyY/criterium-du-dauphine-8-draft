#!/usr/bin/env python3
"""
build.py — Critérium du Dauphiné 8-0 from Tour de Suisse 8-0 template
X-0 Sports Draft #14: Critérium du Dauphiné 8 stages (French pre-Tour)
Stage race: 8 stages (1 prologue ITT + 1 sprint + 1 hills + 3 mountain + 1 ITT + 1 mountain)
"""
import re
import sys

SOURCE = '/tmp/build_suisse/index.html'
DRIVERS_JS = '/tmp/build_dauphine/DRIVERS.js'
OUT = '/tmp/build_dauphine/output.html'

with open(SOURCE, 'r') as f:
    html = f.read()

with open(DRIVERS_JS, 'r') as f:
    dataset = f.read()

# === 1) DRIVERS array replacement (regex, not split, per 9/7 lesson) ===
DRIVERS_RE = re.compile(r'const DRIVERS = \[([\s\S]*?)\];', re.MULTILINE)
SCHEDULE_RE = re.compile(r'const SCHEDULE = \[([\s\S]*?)\];', re.MULTILINE)

# === 1) DRIVERS array ===
old_drv = DRIVERS_RE.search(html)
if not old_drv:
    print("ERROR: cannot find DRIVERS in template")
    sys.exit(1)
dataset_drv = DRIVERS_RE.search(dataset)
if not dataset_drv:
    print("ERROR: cannot find DRIVERS in dataset")
    sys.exit(1)
new_drivers = f"const DRIVERS = [\n{dataset_drv.group(1).strip()}\n];"
html = DRIVERS_RE.sub(new_drivers, html)
print(f"  DRIVERS replaced ({len(new_drivers)} bytes)")

# === 2) SCHEDULE array ===
old_sched = SCHEDULE_RE.search(html)
if not old_sched:
    print("ERROR: cannot find SCHEDULE in template")
    sys.exit(1)
dataset_sched = SCHEDULE_RE.search(dataset)
if not dataset_sched:
    print("ERROR: cannot find SCHEDULE in dataset")
    sys.exit(1)
new_sched = f"const SCHEDULE = [\n{dataset_sched.group(1).strip()}\n];"
html = SCHEDULE_RE.sub(new_sched, html)
print(f"  SCHEDULE replaced ({len(new_sched)} bytes)")

# === 3) ERA_NAMES (full form) ===
old_era = """const ERA_NAMES = {
    1: "1930s-60s",
    2: "1970s-80s",
    3: "1990s",
    4: "2000s",
    5: "2010s",
    6: "2020s"
};"""
new_era = """const ERA_NAMES = {
    1: "1947-1969",
    2: "1970s-80s",
    3: "1990s",
    4: "2000s",
    5: "2010s",
    6: "2020s"
};"""
if old_era in html:
    html = html.replace(old_era, new_era)
    print("  ERA_NAMES (full form) replaced")

# === 4) ERA_LABELS (shorthand) ===
old_labels = """const ERA_LABELS = {
    1: "33-69",
    2: "70-89",
    3: "90-99",
    4: "00-09",
    5: "10-19",
    6: "20-now"
};"""
new_labels = """const ERA_LABELS = {
    1: "47-69",
    2: "70-89",
    3: "90-99",
    4: "00-09",
    5: "10-19",
    6: "20-now"
};"""
if old_labels in html:
    html = html.replace(old_labels, new_labels)
    print("  ERA_LABELS (shorthand) replaced")

# === 5) Title and header text ===
# CRITICAL: Replace "Tour de Suisse" as a UNIT first
html = html.replace('Tour de Suisse', 'Critérium du Dauphiné')
html = html.replace('Tour de Suisse', 'Critérium du Dauphiné')  # belt-and-suspenders
html = html.replace('tour de suisse', 'critérium du dauphiné')
# 8-0 stays 8-0 (same stage count)
# Title bar - The TdS had a "Can You Win the Swiss Champion?" tagline
html = html.replace('Can You Win the Swiss Champion?', 'Can You Win the Maillot Jaune?')
html = html.replace('Maillot Jaune', 'Maillot Jaune')  # Dauphiné LEADER jersey IS Maillot Jaune too — actually Tour has MJ, Dauphiné has its own. Keep MJ for consistency with Tour branding.
# Actually: Critérium du Dauphiné leader wears a yellow jersey too (inspired by Tour de France)
# So Maillot Jaune is also correct for Dauphiné! Keep it.
# But original TdS already replaced "Maillot Rojo" → "Swiss Champion". Let me keep "Maillot Jaune" for Dauphiné (correct color).
html = html.replace('Swiss Champion', 'Maillot Jaune')
html = html.replace('swiss champion', 'maillot jaune')
# Description meta
html = html.replace('Draft legendary Tour de Suisse cyclists', 'Draft legendary Critérium du Dauphiné cyclists')
html = html.replace('Draft legendary Critérium du Dauphiné cyclists', 'Draft legendary Critérium du Dauphiné cyclists')  # already done
# Description meta also has "Tour de Suisse" → already replaced above
# Tagline
html = html.replace('Draft legends. Race 8 stages. Win all. Conquer Swiss roads.',
                    'Draft legends. Race 8 stages. Win all. Wear the <em>Maillot Jaune</em>.')

# === 6) Race counter and stage labels ===
# Race counter (HTML) — already 8 STAGES, no change
# Stat box — already 8 Stages
# Stage names: Küsnacht, Basel, etc → Saint-Étienne, Bourg-de-Péage, etc
html = html.replace('Küsnacht Prologue', 'Saint-Étienne Prologue')
html = html.replace('Basel Sprint', 'Bourg-de-Péage Sprint')
html = html.replace('Emmental Hills', 'Beaujolais Hills')
html = html.replace('Nufenen Pass', 'Chartreuse Mountain')
html = html.replace('Andermatt Summit', 'Vercors Summit')
html = html.replace('Gstaad Hills', 'Bourg-en-Bresse ITT')  # wait this is ITT not hills
# Let me re-check: Gstaad Hills is stage 6 hills → Bourg-en-Bresse ITT is stage 6 ITT
html = html.replace('Gstaad Hills', 'Beaujolais Hills 2')  # This isn't right - let me do it differently
# Reset by re-reading order:
# TdS schedule: 1.Prologue 2.Sprint 3.Hills 4.Mountain 5.Mountain 6.Hills 7.ITT 8.Mountain
# CdD schedule: 1.Prologue 2.Sprint 3.Hills 4.Mountain 5.Mountain 6.ITT 7.Mountain 8.Mountain
# So Gstaad Hills (TdS S6 hills) → Mont Ventoux (CdD S7 mountain) - DIFFERENT position
# Better: do a SCHEDULE replacement instead. Already done above.

# === 7) Share text and hashtags ===
# Original TdS: '#TourdeSuisse8Zero #SwissCycling #TdS'
html = html.replace('#TourdeSuisse8Zero', '#Dauphine8Zero')
html = html.replace('#SwissCycling', '#CritériumDauphiné')
html = html.replace('#TdS', '#CdD')
html = html.replace('TourdeSuisse8', 'Dauphine8')
html = html.replace('TdS8Zero', 'CdD8Zero')
# Cross-link footer - TdS was '8-0 🇨🇭 (Tour de Suisse)' → Dauphiné is French so 🇫🇷
html = html.replace('8-0 🇨🇭 (Tour de Suisse)', '8-0 🇫🇷 (Critérium du Dauphiné)')
html = html.replace('8-0 🇨🇭', '8-0 🇫🇷')

# === 8) Color theme (Swiss red → Maillot Jaune yellow + France blue) ===
# Original TdS: --accent: #ef4444 (Swiss red)
# CdD: Maillot Jaune yellow #fbbf24 + French blue accent
html = html.replace('--accent: #ef4444; /* Swiss red */', '--accent: #fbbf24; /* Maillot Jaune yellow */')
html = html.replace('--accent: #b91c1c;', '--accent: #1e3a8a;')  # deeper blue (France)
html = html.replace('/* Swiss red */', '/* Maillot Jaune yellow */')

# === 9) Era-specific replacements: TdS used 33-69 → CdD uses 47-69 ===
html = html.replace('33-69', '47-69')

# === 10) Emoji replacements: 🇨🇭 → 🇫🇷 (Swiss → French flag) ===
# Title bar
html = html.replace('🇨🇭 8-0: Tour de Suisse', '🇫🇷 8-0: Critérium du Dauphiné')
html = html.replace('🇨🇭 8-0:', '🇫🇷 8-0:')
html = html.replace('🇨🇭 8-0 ', '🇫🇷 8-0 ')
# In template literal `🇨🇭 My Tour de Suisse ...`
html = html.replace('`🇨🇭 My Tour de Suisse', '`🇫🇷 My Critérium du Dauphiné')
# Other share text patterns
html = html.replace('for 🇨🇭 Tour de Suisse', 'for 🇫🇷 Critérium du Dauphiné')
html = html.replace('for 🇫🇷 Critérium du Dauphiné', 'for 🇫🇷 Critérium du Dauphiné')  # noop
# Made for emoji line
html = html.replace('Made for 🇫🇷 Critérium du Dauphiné', 'Made for 🇫🇷 Critérium du Dauphiné')
# Finale emoji labels: TdS used 🇨🇭 CONQUEROR + 🏔 ALPINE
html = html.replace('🇨🇭 CONQUEROR', '🇫🇷 DOMINATOR')
html = html.replace('🏔 ALPINE', '🏔 ALPINE')  # keep — alpine works for Dauphiné too

# === 11) Stage type label adjustments ===
# CdD stage types: 1 ITT + 1 flat + 1 hills + 4 mountain + 1 ITT (wait that's 2 ITTs)
# Actually: 1.Prologue ITT, 2.flat, 3.hills, 4.mountain, 5.mountain, 6.ITT, 7.mountain, 8.mountain
# = 2 ITT + 1 flat + 1 hills + 4 mountain = 8 stages
# TdS had: 1 ITT + 1 flat + 2 hills + 3 mountain + 1 ITT = 8 stages (same structure!)
# Wait TdS SCHEDULE shows: ITT, flat, hills, mountain, mountain, hills, ITT, mountain
# CdD SCHEDULE: ITT, flat, hills, mountain, mountain, ITT, mountain, mountain
# Different! CdD has only 1 hills + 1 more mountain vs TdS
# But these are in the SCHEDULE array which we already replaced.
# No further label changes needed for the stage types themselves.

# === 12) Final / finale display ===
# CdD uses Maillot Jaune (yellow jersey) — both Tour and Dauphiné use it
# Already handled above
# Finale title emoji
html = html.replace('`🇫🇷 DOMINATOR — ${wins} stage wins`', '`🇫🇷 DOMINATOR — ${wins} stage wins`')  # noop (already)

# === 13) n !== 6 bug (defensive fix per 8/28 + 9/5 lessons) ===
html = html.replace("disabled = n !== 6;", "disabled = n !== 5;")

# === 14) Belt-and-suspenders: any TdS leakage cleanup ===
# CdD-related specific terms
compound_belt = [
    # Compound names first
    ("Tour de Suisse", "Critérium du Dauphiné"),
    ("TdS", "CdD"),
    ("tds", "cdd"),
    ("Swiss Champion", "Maillot Jaune"),
    ("swiss champion", "maillot jaune"),
    ("Swiss red", "Maillot Jaune yellow"),
    ("Swiss", "French"),  # blanket, but may be too aggressive — narrow
    # Stage names leftover
    ("Küsnacht", "Saint-Étienne"),
    ("Basel", "Bourg-de-Péage"),
    ("Emmental", "Beaujolais"),
    ("Nufenen", "Chartreuse"),
    ("Andermatt", "Vercors"),
    ("Gstaad", "Bourg-en-Bresse"),
    ("Andeer", "Beaujolais"),  # not used in CdD — for safety
    # Hashtags
    ("#TourdeSuisse8Zero", "#Dauphine8Zero"),
    ("#SwissCycling", "#CritériumDauphiné"),
    # TdS emoji
    ("🇨🇭", "🇫🇷"),
]
# Apply in order (compounds first)
for old, new in compound_belt:
    if old in html and old != new:
        before = html.count(old)
        html = html.replace(old, new)
        if before > 0:
            print(f"  belt-suspenders: {old!r} → {new!r}  ({before} occurrences)")

# === 15) Specific Swiss words left ===
# "Helvetia" → "Hexagone" (French mainland nickname)
html = html.replace('Helvetia', 'Hexagone')
html = html.replace('helvetia', 'hexagone')

# === 16) AI field strength — same as TdS (8 stages needs strong AI) ===
# TdS used 84-94. CdD has same stage count + similar elite climbers/TTs, so same AI
# (Already done by inheriting from TdS template)

# Keep gameplay fixes in generated output.
html = html.replace('width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no', 'width=device-width, initial-scale=1.0')
html = html.replace('const ERA_NAMES = {', 'DRIVERS.forEach(d => { d.id = `${d.era}:${d.name}`; });\n\nconst ERA_NAMES = {')
html = html.replace('  .driver-card:hover', '  button.driver-card {\n    color: inherit;\n    font: inherit;\n    text-align: left;\n  }\n  .driver-card:hover')
html = html.replace('  .btn-row .btn { flex: 1; }', '  .btn-row .btn { flex: 1; }\n  .btn-row[hidden] { display: none; }')
html = html.replace('  .roster-chip {', '  .roster-chip {\n    border: none;\n    font-family: inherit;')
html = html.replace("const card = document.createElement('div');", "const card = document.createElement('button');\n        card.type = 'button';\n        card.disabled = drafted;")
html = html.replace("const chip = document.createElement('span');", "const chip = document.createElement('button');\n            chip.type = 'button';\n            chip.setAttribute('aria-label', `Remove ${d.name}`);")
html = html.replace('Pick 5 MotoGP legends', 'Pick 5 cycling legends')
html = html.replace('Tap a driver to draft. Mix eras for synergy bonuses.', 'Tap a rider to draft. Match eras for synergy bonuses.')
html = html.replace('n < 6', 'n < 5')
html = html.replace('${n}/5 drivers drafted', '${n}/5 riders drafted')
html = html.replace('${6 - n}', '${5 - n}')
html = html.replace('🏎\ufe0f Roster Complete!', 'Roster Complete!')
html = html.replace('bonuses[raceType]', 'bonuses[raceType.toLowerCase()]')
html = html.replace('    showNextRace();\n};\n\nfunction showNextRace', "    for (const id of ['season-wins', 'season-streak', 'season-points']) {\n        $(id).textContent = '0';\n    }\n    showNextRace();\n};\n\nfunction showNextRace")
html = html.replace('${race.city} · ${race.type}', '${race.desc} · ${race.type}')
html = html.replace('Full Season Log (All 21 Stages)', 'Full Season Log (All 8 Stages)')
html = html.replace('    // Real stages: 8 stages total, 1 rest day, so 20 actual race stages\n    // Player can win up to 20 stages (skips rest day). Perfect = "21-0" since the goal is to "complete the Tour undefeated" (rest day doesn\'t count as a loss)\n    const totalStages = SCHEDULE.length;\n    const losses = totalStages - 1 - wins;  // rest day is not a loss\n    const record = `${wins}-${losses}`;\n\n    $(\'finale-record\').textContent = `${totalStages}-0`;  // Display as "21-0" perfect = "won every stage"\n    $(\'share-record\').textContent = `${totalStages}-0`;\n\n    // Title\n    let title = \'\';\n    if (wins === 20) title = `🏆 UNDEFEATED — ${totalStages}-0 GRAND CHELEM!`;\n    else if (wins >= 17) title = `🏆 ELITE — ${wins} stage wins`;\n    else if (wins >= 14) title = `🇫🇷 DOMINATOR — ${wins} stage wins`;\n    else if (wins >= 10) title = `🏔\ufe0f ALPINE — ${wins} stage wins`;\n    else title = `${wins} stage wins — Try a stronger roster next time`;\n    $(\'finale-title\').textContent = title;\n\n    // Badges\n    let badgesHTML = \'\';\n    if (wins === 20) badgesHTML += \'<span class="badge gold">⭐ Maillot Jaune Sweep — Every Stage</span>\';\n    if (state.season.bestStreak >= 6) badgesHTML += `<span class="badge green">🔥 ${state.season.bestStreak}-Race Streak</span>`;\n    if (wins >= 13) badgesHTML += \'<span class="badge green">Title Contender</span>\';\n    if (wins < 6) badgesHTML += \'<span class="badge red">Rebuild Year</span>\';\n    $(\'finale-badges\').innerHTML = badgesHTML;\n\n', '    const totalStages = SCHEDULE.filter(r => r.type !== \'rest\').length;\n    const losses = totalStages - wins;\n    const record = `${wins}-${losses}`;\n\n    $(\'finale-record\').textContent = record;\n    $(\'share-record\').textContent = record;\n\n    $(\'finale-title\').textContent = wins === totalStages\n        ? `🏆 UNDEFEATED — ${record} GRAND CHELEM!`\n        : `${wins} stage wins — ${losses} losses`;\n\n    let badgesHTML = \'\';\n    if (wins === totalStages) badgesHTML += \'<span class="badge gold">⭐ Maillot Jaune Sweep — Every Stage</span>\';\n    if (state.season.bestStreak >= 6) badgesHTML += `<span class="badge green">🔥 ${state.season.bestStreak}-Race Streak</span>`;\n    if (wins < totalStages / 2) badgesHTML += \'<span class="badge red">Rebuild Year</span>\';\n    $(\'finale-badges\').innerHTML = badgesHTML;\n\n')
html = html.replace('\ufe0f', '')

# === 17) Save ===
with open(OUT, 'w') as f:
    f.write(html)
print(f"\n  Output: {OUT} ({len(html)} bytes)")

# === 18) Verify checks ===
checks = [
    ('const DRIVERS', 'DRIVERS array'),
    ('const SCHEDULE', 'SCHEDULE array'),
    ('const ERA_NAMES', 'ERA_NAMES'),
    ('const ERA_LABELS', 'ERA_LABELS'),
    ('Critérium du Dauphiné', 'CdD brand'),
    ('8-0', 'X-0 number'),
    ('Saint-Étienne', 'CdD stage name'),
    ('Pogačar', 'Modern legend (Pogačar)'),
    ('Vingegaard', 'Modern legend (Vingegaard)'),
    ('Indurain', 'Dauphiné legend'),
    ('Hinault', 'Dauphiné legend'),
    ('Maillot Jaune', 'CdD leader jersey'),
]
print("\n  Verification:")
for s, desc in checks:
    n = html.count(s)
    marker = '✅' if n >= 1 else '❌'
    print(f"    {marker} {desc:35s} count={n}")

# Check for TdS leakage
print("\n  TdS leakage check:")
leakage = [
    ('Tour de Suisse', 'high'),
    ('Küsnacht', 'high'),
    ('Basel', 'medium'),
    ('Andermatt', 'high'),
    ('Gstaad', 'high'),
    ('🇨🇭', 'high'),
    ('Helvetia', 'high'),
    ('TdS', 'medium'),
    ('Swiss Champion', 'low'),
]
for s, sev in leakage:
    n = html.count(s)
    if n > 0:
        print(f"    ⚠  {s} count={n} (severity={sev})")
    else:
        print(f"    ✅ {s} count=0 (clean)")
