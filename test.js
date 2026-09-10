
const fs = require('fs');
const html = fs.readFileSync('/tmp/build_dauphine/output.html', 'utf8');
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
