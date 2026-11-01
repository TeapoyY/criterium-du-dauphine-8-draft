
const fs = require('fs');
const html = fs.readFileSync(__dirname + '/output.html', 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const code = m[1];

const noop = () => {};
const fakeCtx = new Proxy({}, { get: () => noop });
const fakeEl = {
    classList: { add: noop, remove: noop, toggle: noop },
    innerHTML: '', textContent: '',
    appendChild: noop, querySelectorAll: () => [], scrollTop: 0, scrollHeight: 0,
    style: {},
    disabled: false,
    value: '',
    getContext: () => fakeCtx,
    width: 480, height: 360,
    setAttribute: noop,
    addEventListener: noop
};

global.document = {
    getElementById: () => fakeEl,
    querySelectorAll: () => [],
    createElement: () => fakeEl,
};
global.setTimeout = noop;
global.localStorage = { getItem: () => null, setItem: noop };

const fn = new Function('document', 'setTimeout', 'localStorage',
    code + '; return { DRIVERS, SCHEDULE, simulateRace, mulberry32, pointsForPos, ERA_NAMES };');
const api = fn(global.document, global.setTimeout, global.localStorage);

console.log("=== Critérium du Dauphiné 8-0 ===");
console.log("DRIVERS:", api.DRIVERS.length);
console.log("SCHEDULE:", api.SCHEDULE.length, "stages");
console.log("Era names:", JSON.stringify(api.ERA_NAMES));
console.log("First 3 drivers:", api.DRIVERS.slice(0, 3).map(d => d.name + " (era " + d.era + ", OVR " + d.ovr + ")"));
console.log("Schedule:", api.SCHEDULE.map(s => s.stage + "." + s.name + "(" + s.type + ")").join(", "));

function rng(seed) {
    return function() {
        seed |= 0;
        seed = (seed + 0x6D2B79F5) | 0;
        let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = (t + Math.imul(t ^ t >>> 7, 61 | t)) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

// Full season Monte Carlo (loop through SCHEDULE)
console.log("\n=== Full Season Monte Carlo (200 seasons per OVR) ===");
for (const ovr of [70, 80, 85, 90, 95, 99]) {
    let totalWins = 0;
    let perfect = 0;
    const N = 200;
    for (let seed = 1; seed <= N; seed++) {
        const r = rng(seed * 1000);
        let wins = 0;
        for (let i = 0; i < api.SCHEDULE.length; i++) {
            const race = api.SCHEDULE[i];
            const result = api.simulateRace(ovr, race.type, r);
            if (result.playerPos === 1) wins++;
        }
        totalWins += wins;
        if (wins === 8) perfect++;
    }
    console.log("OVR " + ovr + ": avg wins=" + (totalWins/N).toFixed(2) + "/8, perfect 8-0: " + perfect + "/" + N + " (" + (perfect*100/N).toFixed(1) + "%)");
}

console.log("\n=== Single-race Win Rate (50 races, stage type=mountain) ===");
for (const ovr of [80, 90, 95, 99]) {
    let wins = 0;
    for (let seed = 1; seed <= 50; seed++) {
        const r = rng(seed * 17);
        const result = api.simulateRace(ovr, 'mountain', r);
        if (result.playerPos === 1) wins++;
    }
    console.log("OVR " + ovr + ": " + wins + "/50 mountain wins (" + (wins*2).toFixed(0) + "%)");
}

// Regression checks for draft, replay totals, and schedule-based finale.
const assert = require('assert');
const elements = new Map();
function element(tagName) {
    return {
        ...fakeEl, tagName, style: {}, children: [], attributes: {},
        appendChild(child) { this.children.push(child); },
        setAttribute(name, value) { this.attributes[name] = value; }
    };
}
const doc = {
    getElementById(id) {
        if (!elements.has(id)) elements.set(id, element('div'));
        return elements.get(id);
    },
    createElement: element
};
const game = new Function('document', code + `;
    return { DRIVERS, SCHEDULE, winProb, draftDriver, undraftDriver, showFinale,
        get state() { return state; } };
`)(doc);
assert.equal(new Set(game.DRIVERS.map(d => d.id)).size, 84);
assert.equal(game.SCHEDULE.length, 8);
assert.equal(game.winProb(90, 'ITT'), game.winProb(90, 'itt'));
for (const d of game.DRIVERS.slice(0, 5)) game.draftDriver(d);
assert.equal(game.state.drafted.length, 5);
assert.equal(doc.getElementById('count-text').textContent, 'Roster Complete!');
assert.equal(doc.getElementById('start-btn').disabled, false);
const card = doc.getElementById('driver-grid').children.at(-14);
assert.equal(card.tagName, 'button');
assert.equal(card.disabled, true);
const chip = doc.getElementById('draft-status').children.at(-1).children[0];
assert.equal(chip.tagName, 'button');
assert.match(chip.attributes['aria-label'], /^Remove /);
chip.onclick();
assert.equal(game.state.drafted.length, 4);
assert.match(doc.getElementById('help-text').textContent, /Pick 1 more/);
game.draftDriver(game.DRIVERS[0]);
for (const id of ['season-wins', 'season-streak', 'season-points']) doc.getElementById(id).textContent = '99';
doc.getElementById('start-btn').onclick();
for (const id of ['season-wins', 'season-streak', 'season-points']) assert.equal(doc.getElementById(id).textContent, '0');
assert.equal(doc.getElementById('race-next-row').hidden, true);
assert.equal(doc.getElementById('race-track').textContent, game.SCHEDULE[0].desc + ' · ITT');
for (const wins of [0, 3, 4, 8]) {
    game.state.season.playerWins = wins;
    game.showFinale();
    assert.equal(doc.getElementById('finale-record').textContent, `${wins}-${8 - wins}`);
    assert.equal(doc.getElementById('share-record').textContent, `${wins}-${8 - wins}`);
    assert.equal(doc.getElementById('finale-title').textContent.includes('UNDEFEATED'), wins === 8);
    assert.equal(doc.getElementById('finale-badges').innerHTML.includes('Sweep'), wins === 8);
    assert.equal(doc.getElementById('finale-badges').innerHTML.includes('Rebuild'), wins < 4);
}
console.log('Regression checks passed');
