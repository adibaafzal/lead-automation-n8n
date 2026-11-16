// Run: node test/run_tests.js
const { scoreLead } = require("../src/score_lead");
const leads = require("./sample_leads.json");

const expected = { "Lena Hoffmann": "Hot", "Tom Becker": "Warm", "Sara Kim": "Cold", "Jonas Weber": "Warm" };
let failed = 0;

for (const lead of leads) {
  const r = scoreLead(lead);
  const ok = r.tier === expected[lead.name];
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${lead.name.padEnd(14)} score=${String(r.score).padStart(3)}  tier=${r.tier.padEnd(4)}  | ${r.reasons}`);
}
console.log(failed ? `\n${failed} test(s) failed` : "\nAll tests passed");
process.exit(failed ? 1 : 0);
