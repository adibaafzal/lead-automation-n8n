// Lead scoring logic used in the n8n "Score Lead" Code node.
// Kept as a plain function so it can be tested outside n8n (see test/run_tests.js).
// Score 0-100: Hot >= 70, Warm 40-69, Cold < 40.

function scoreLead(lead) {
  const sizePoints = { "1-50": 5, "51-200": 15, "201-1000": 25, "1000+": 30 };
  const budgetPoints = { "Under €5k": 5, "€5k-€20k": 20, "Over €20k": 30, "Not sure yet": 10 };
  const timelinePoints = { "Within 1 month": 30, "1-3 months": 15, "Later than 3 months": 5 };
  const seniorTitles = ["head", "director", "vp", "vice president", "chief", "ceo", "cfo", "coo",
                        "cto", "founder", "owner", "manager", "lead"];

  const reasons = [];
  let score = 0;

  const s = sizePoints[lead.company_size] ?? 0;
  score += s; reasons.push(`Company size ${lead.company_size}: +${s}`);

  const b = budgetPoints[lead.budget] ?? 0;
  score += b; reasons.push(`Budget ${lead.budget}: +${b}`);

  const t = timelinePoints[lead.timeline] ?? 0;
  score += t; reasons.push(`Timeline ${lead.timeline}: +${t}`);

  const role = String(lead.role || "").toLowerCase();
  if (seniorTitles.some((w) => role.includes(w))) {
    score += 10; reasons.push("Decision-maker role: +10");
  }

  // Free email domains are less likely to be real business buyers
  const email = String(lead.email || "").toLowerCase();
  const freeDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "gmx.de", "web.de"];
  if (freeDomains.some((d) => email.endsWith("@" + d))) {
    score -= 10; reasons.push("Free email domain: -10");
  }

  score = Math.max(0, Math.min(100, score));
  const tier = score >= 70 ? "Hot" : score >= 40 ? "Warm" : "Cold";
  return { score, tier, reasons: reasons.join("; ") };
}

module.exports = { scoreLead };
