# 🚴 8-0: Critérium du Dauphiné Draft

**Can You Win the Maillot Jaune?**

The Critérium du Dauphiné is France's premier pre-Tour stage race (1947-present, 79 years history). 8 stages across the French Alps, with classic Tour-de-France-style test: ITT prologue + mountain stages + ITT finale.

**Draft 5 legendary cyclists across 6 eras. Race 8 stages. Win all. Wear the Maillot Jaune.**

## 🚴 Play Live

**https://teapoyy.github.io/criterium-du-dauphine-8-draft/**

## Features

- **84 Critérium du Dauphiné legends** across 6 eras (1947-1969 → 2020s)
- **8 stages** of authentic 2026 Dauphiné calendar: Saint-Étienne ITT → Bourg-de-Péage sprint → Beaujolais hills → Chartreuse mountain → Vercors summit → Bourg-en-Bresse ITT → **Mont Ventoux** → Les Deux Alpes
- **Era Synergy Bonus**: +1.5 OVR per additional rider from same era
- **Maillot Jaune yellow jersey** with French tricolor theming
- **Share to X/Twitter**: `#Dauphine8Zero #CritériumDauphiné #CdD`
- **Single HTML, zero dependencies**, 38KB total
- **Mobile-friendly** responsive design

## Era Roster

| Era | Span | Stars |
|-----|------|-------|
| 1 | 1947-1969 | Anquetil, Poulidor, Rivière, Gimondi, Altig, Ocaña |
| 2 | 1970s-80s | Hinault, Merckx, Zoetemelk, Fignon, LeMond, Delgado |
| 3 | 1990s | Indurain, Ullrich, Pantani, Zülle, Virenque, Jalabert |
| 4 | 2000s | Armstrong, Contador, Klöden, Evans, Valverde, Nibali |
| 5 | 2010s | Froome, Bardet, Pinot, Thomas, Alaphilippe, Roglič |
| 6 | 2020s | Pogačar, Vingegaard, Evenepoel, Carapaz, Ayuso, Mas |

## Difficulty Curve (Monte Carlo 200 seasons)

| OVR | Avg Wins / 8 | Perfect 8-0 Rate | Experience |
|-----|--------------|------------------|------------|
| 70  | 0.00         | 0.0%             | 完全挣扎 |
| 80  | 0.00         | 0.0%             | 挣扎 |
| 90  | 0.00         | 0.0%             | 中游偶有惊喜 |
| 95  | 1.51         | 0.0%             | 争冠级别 |
| 99  | 4.75         | 1.5%             | ELITE tier |

## X-0 Sports Draft Universe

This is the **14th** variant in the X-0 Sports Draft matrix:

🏈 [NFL 38-0](https://github.com/TeapoyY/squad-draft-football) · 🏁 [NASCAR Cup 36-0](https://github.com/TeapoyY/nascar-36-draft) · 🚴 [Tour de France 21-0](https://github.com/TeapoyY/tour-de-france-21-draft) · 🏎️ [IndyCar 17-0](https://github.com/TeapoyY/indycar-17-draft) · ⚡ [Formula E 17-0](https://github.com/TeapoyY/formulae-17-draft) · 🏍️ [MotoGP 20-0](https://github.com/TeapoyY/motogp-20-draft) · 🏁 [Endurance 24-0](https://github.com/TeapoyY/endurance-24-draft) · 🏔️ [WRC 13-0](https://github.com/TeapoyY/wrc-13-draft) · 🌹 [Giro d'Italia 23-0](https://github.com/TeapoyY/giro-23-draft) · 🔴 [Vuelta a España 21-0](https://github.com/TeapoyY/vuelta-21-draft) · 🇨🇭 [Tour de Suisse 8-0](https://github.com/TeapoyY/tour-de-suisse-8-draft) · 8-0 🇫🇷 (Critérium du Dauphiné)

## Files

- `index.html` — Single-file game (38KB, 0 dependencies)
- `.github/workflows/deploy.yml` — GitHub Pages auto-deploy
- `DRIVERS.js` — Dataset (84 Dauphiné legends + 8 stages)
- `build.py` — Python converter (TdS 8-0 → CdD 8-0)
- `test.js` — Monte Carlo validation (200 seasons × 6 OVR)

## Credits

- Concept inspired by [82-0.com](https://82-0.com) (Vaulty Studios NBA variant)
- Era data sourced from Wikipedia + ProCyclingStats
- Single HTML, no frameworks, deploys via GitHub Pages

---

MIT License. Built by TeapoyY.
