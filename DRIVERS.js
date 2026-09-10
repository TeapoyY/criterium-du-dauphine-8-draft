// Critérium du Dauphiné Legends Dataset (84 riders × 6 eras)
// Critérium du Dauphiné = 1947-present (79 years history)
// "Race of the Sun" - premier French stage race, Tour de France warm-up
// Known for: PROLOGUE ITT + mountain stages + TT finale (classic Tour test)

const ERA_NAMES = {
    1: "1947-1969",
    2: "1970s-80s",
    3: "1990s",
    4: "2000s",
    5: "2010s",
    6: "2020s"
};

const ERA_LABELS = {
    1: "47-69",
    2: "70-89",
    3: "90-99",
    4: "00-09",
    5: "10-19",
    6: "20-now"
};

// Format: { name, era, pos, ovr }
// pos = GC / TT / SPR / CLIM (Pure climber) / HILL
// Critérium du Dauphiné stars: strong climbers + TT specialists (French cycling DNA)

const DRIVERS = [
    // Era 1: 1947-1969 (founding era)
    { name: "Edouard Fachleitner", era: 1, pos: "GC", ovr: 70 },
    { name: "Lucien Teisseire", era: 1, pos: "GC", ovr: 71 },
    { name: "Jean Dotto", era: 1, pos: "SPR", ovr: 72 },
    { name: "Nello Lauredi", era: 1, pos: "GC", ovr: 73 },
    { name: "Louis Caput", era: 1, pos: "HILL", ovr: 70 },
    { name: "Raphael Géminiani", era: 1, pos: "CLIM", ovr: 78 },
    { name: "Henry Anglade", era: 1, pos: "GC", ovr: 75 },
    { name: "Jean Stablinski", era: 1, pos: "HILL", ovr: 77 },
    { name: "Jacques Anquetil", era: 1, pos: "TT", ovr: 92 },
    { name: "Raymond Poulidor", era: 1, pos: "GC", ovr: 89 },
    { name: "Roger Rivière", era: 1, pos: "TT", ovr: 80 },
    { name: "Felice Gimondi", era: 1, pos: "GC", ovr: 84 },
    { name: "Rudi Altig", era: 1, pos: "SPR", ovr: 82 },
    { name: "Luis Ocaña", era: 1, pos: "CLIM", ovr: 81 },

    // Era 2: 1970s-80s (Dauphiné dominance era)
    { name: "Bernard Hinault", era: 2, pos: "GC", ovr: 96 },
    { name: "Eddy Merckx", era: 2, pos: "GC", ovr: 99 },
    { name: "Joop Zoetemelk", era: 2, pos: "GC", ovr: 85 },
    { name: "Raymond Martin", era: 2, pos: "TT", ovr: 80 },
    { name: "Charly Mottet", era: 2, pos: "GC", ovr: 84 },
    { name: "Gianni Bugno", era: 2, pos: "GC", ovr: 84 },
    { name: "Jean-François Bernard", era: 2, pos: "TT", ovr: 87 },
    { name: "Robert Millar", era: 2, pos: "CLIM", ovr: 85 },
    { name: "Greg LeMond", era: 2, pos: "GC", ovr: 90 },
    { name: "Pedro Delgado", era: 2, pos: "CLIM", ovr: 89 },
    { name: "Laurent Fignon", era: 2, pos: "GC", ovr: 88 },
    { name: "Andrew Hampsten", era: 2, pos: "GC", ovr: 82 },
    { name: "Jean-François Rault", era: 2, pos: "TT", ovr: 76 },
    { name: "Steve Bauer", era: 2, pos: "HILL", ovr: 79 },

    // Era 3: 1990s (Indurain + Ullrich era)
    { name: "Miguel Indurain", era: 3, pos: "GC", ovr: 95 },
    { name: "Jan Ullrich", era: 3, pos: "GC", ovr: 92 },
    { name: "Marco Pantani", era: 3, pos: "CLIM", ovr: 93 },
    { name: "Alex Zülle", era: 3, pos: "GC", ovr: 84 },
    { name: "Richard Virenque", era: 3, pos: "CLIM", ovr: 85 },
    { name: "Laurent Jalabert", era: 3, pos: "HILL", ovr: 87 },
    { name: "Frank Vandenbroucke", era: 3, pos: "HILL", ovr: 82 },
    { name: "Thierry Marie", era: 3, pos: "TT", ovr: 78 },
    { name: "Luc Leblanc", era: 3, pos: "HILL", ovr: 76 },
    { name: "Christophe Rinero", era: 3, pos: "CLIM", ovr: 77 },
    { name: "Chris Boardman", era: 3, pos: "TT", ovr: 84 },
    { name: "Bjarne Riis", era: 3, pos: "GC", ovr: 83 },
    { name: "Abraham Olano", era: 3, pos: "GC", ovr: 81 },
    { name: "Fernando Escartín", era: 3, pos: "CLIM", ovr: 80 },

    // Era 4: 2000s (US Postal + Discovery era)
    { name: "Lance Armstrong", era: 4, pos: "GC", ovr: 95 },
    { name: "Andreas Klöden", era: 4, pos: "GC", ovr: 85 },
    { name: "Jan Ullrich", era: 4, pos: "GC", ovr: 89 },
    { name: "Iban Mayo", era: 4, pos: "CLIM", ovr: 84 },
    { name: "Tyler Hamilton", era: 4, pos: "GC", ovr: 82 },
    { name: "Cadel Evans", era: 4, pos: "GC", ovr: 85 },
    { name: "Alberto Contador", era: 4, pos: "GC", ovr: 93 },
    { name: "Alejandro Valverde", era: 4, pos: "HILL", ovr: 88 },
    { name: "Denis Menchov", era: 4, pos: "GC", ovr: 84 },
    { name: "Oscar Pereiro", era: 4, pos: "GC", ovr: 80 },
    { name: "Samuel Sánchez", era: 4, pos: "HILL", ovr: 83 },
    { name: "David Moncoutié", era: 4, pos: "CLIM", ovr: 80 },
    { name: "Vincenzo Nibali", era: 4, pos: "GC", ovr: 87 },
    { name: "Sylvain Chavanel", era: 4, pos: "TT", ovr: 82 },

    // Era 5: 2010s (Sky/Froome era)
    { name: "Chris Froome", era: 5, pos: "GC", ovr: 94 },
    { name: "Alberto Contador", era: 5, pos: "GC", ovr: 92 },
    { name: "Nairo Quintana", era: 5, pos: "CLIM", ovr: 87 },
    { name: "Romain Bardet", era: 5, pos: "CLIM", ovr: 86 },
    { name: "Thibaut Pinot", era: 5, pos: "CLIM", ovr: 86 },
    { name: "Richie Porte", era: 5, pos: "GC", ovr: 84 },
    { name: "Tony Martin", era: 5, pos: "TT", ovr: 87 },
    { name: "Geraint Thomas", era: 5, pos: "GC", ovr: 86 },
    { name: "Julian Alaphilippe", era: 5, pos: "HILL", ovr: 91 },
    { name: "Primož Roglič", era: 5, pos: "GC", ovr: 91 },
    { name: "Daniel Martin", era: 5, pos: "HILL", ovr: 82 },
    { name: "Bauke Mollema", era: 5, pos: "GC", ovr: 82 },
    { name: "Steven Kruijswijk", era: 5, pos: "CLIM", ovr: 83 },
    { name: "Adam Yates", era: 5, pos: "GC", ovr: 82 },

    // Era 6: 2020s (modern era)
    { name: "Tadej Pogačar", era: 6, pos: "GC", ovr: 99 },
    { name: "Jonas Vingegaard", era: 6, pos: "GC", ovr: 96 },
    { name: "Remco Evenepoel", era: 6, pos: "TT", ovr: 95 },
    { name: "Juan Ayuso", era: 6, pos: "GC", ovr: 86 },
    { name: "Enric Mas", era: 6, pos: "CLIM", ovr: 85 },
    { name: "Mattias Skjelmose", era: 6, pos: "GC", ovr: 84 },
    { name: "Richard Carapaz", era: 6, pos: "CLIM", ovr: 87 },
    { name: "Egan Bernal", era: 6, pos: "GC", ovr: 87 },
    { name: "David Gaudu", era: 6, pos: "CLIM", ovr: 84 },
    { name: "Felix Gall", era: 6, pos: "CLIM", ovr: 86 },
    { name: "Matteo Jorgenson", era: 6, pos: "GC", ovr: 85 },
    { name: "Carlos Rodríguez", era: 6, pos: "GC", ovr: 86 },
    { name: "Mikel Landa", era: 6, pos: "CLIM", ovr: 84 },
    { name: "Sepp Kuss", era: 6, pos: "CLIM", ovr: 84 }
];

// 2026 Critérium du Dauphiné schedule (8 stages)
// Critérium du Dauphiné = Tour de France dress rehearsal
// Known for: PROLOGUE ITT + mountain stages + finale ITT (classic 3-test structure)
// Format: Prologue → 1 sprint → 1 hills → 2 mountain → 1 ITT → 1 mountain → 1 final mountain

const SCHEDULE = [
    { stage: 1, name: "Saint-Étienne Prologue", type: "ITT", desc: "6km opening TT, technical urban course" },
    { stage: 2, name: "Bourg-de-Péage Sprint", type: "flat", desc: "Drôme valley, mass sprint expected" },
    { stage: 3, name: "Beaujolais Hills", type: "hills", desc: "Rolling Beaujolais vineyards, punchy" },
    { stage: 4, name: "Chartreuse Mountain", type: "mountain", desc: "Chartreuse Massif, HC climbs begin" },
    { stage: 5, name: "Vercors Summit", type: "mountain", desc: "Vercors plateau, summit finish" },
    { stage: 6, name: "Bourg-en-Bresse ITT", type: "ITT", desc: "36km flat TT, GC shake-up" },
    { stage: 7, name: "Mont Ventoux", type: "mountain", desc: "Californian giant, mythic climb" },
    { stage: 8, name: "Les Deux Alpes", type: "mountain", desc: "Alpine finale, summit showdown" }
];
