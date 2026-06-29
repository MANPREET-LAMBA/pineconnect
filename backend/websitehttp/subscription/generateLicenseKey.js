const License = require("../schema/licenseSchema");
const Plan = require("../schema/planSchema");
const crypto = require("crypto");

function generateLicenseKey() {
  return crypto.randomBytes(16).toString("hex").toUpperCase();
}

const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;
const DURATION_MS = 30 * 24 * 60 * 60 * 1000;

function isNearOrExpired(license, now) {
  const isExpired = license.status === "expired" || license.endDate <= now;
  const timeLeft = license.endDate.getTime() - now.getTime();
  const isNearExpiry = timeLeft <= FIVE_DAYS_MS;
  return isExpired || isNearExpiry;
}

function buildExtendedEndDate(license, now) {
  const isExpired = license.status === "expired" || license.endDate <= now;
  const base = isExpired ? now : license.endDate;
  return new Date(base.getTime() + DURATION_MS);
}

function buildNewLicenseDoc(userId, plan, paymentId, orderId, now, index) {
  return {
    user: userId,
    plan: plan.name,
    licenseKey: generateLicenseKey(),
    licenseName: `${plan.name}-${index}`,
    mode: "ON",
    paymentId,
    orderId,
    status: "active",
    startDate: now,
    endDate: new Date(now.getTime() + DURATION_MS),
  };
}

async function createOrUpdateLicenses(userId, planName, paymentId, orderId) {
  const plan = await Plan.findOne({ name: planName });
  if (!plan) throw new Error(`Plan "${planName}" not found`);

  const targetCount = plan.Accounts;
  const now = new Date();

  const allLicenses = await License.find({ user: userId }).sort({ endDate: 1 });

  // ── FIRST PURCHASE ──────────────────────────────────────────────────────────
  if (allLicenses.length === 0) {
    const docs = Array.from({ length: targetCount }, (_, i) =>
      buildNewLicenseDoc(userId, plan, paymentId, orderId, now, i + 1)
    );
    return await License.insertMany(docs);
  }

  // ── Categorise existing licenses ────────────────────────────────────────────
  // Active = status is active AND not yet expired
  const activeLicenses = allLicenses.filter(
    (l) => l.status === "active" && l.endDate > now
  );
  // Expired = anything else (status expired, revoked, or endDate passed)
  const expiredLicenses = allLicenses.filter(
    (l) => l.status !== "active" || l.endDate <= now
  );

  // ── Helper: renew an existing license doc ───────────────────────────────────
  async function renewLicense(license) {
    license.endDate = buildExtendedEndDate(license, now);
    license.status = "active";
    license.plan = plan.name;
    license.paymentId = paymentId;
    license.orderId = orderId;
    await license.save();
    return license;
  }

  // ── Determine how many active keys the user currently has vs needs ──────────
  const activeCount = activeLicenses.length;

  console.log(`[License] targetCount=${targetCount} activeCount=${activeCount} expiredCount=${expiredLicenses.length}`);

  // ── SAME PLAN ───────────────────────────────────────────────────────────────
  // Compare against targetCount regardless of how many are expired.
  // This block handles: renew same plan (active keys exist = targetCount)
  if (targetCount === activeCount) {
    const result = [];

    for (const license of activeLicenses) {
      if (isNearOrExpired(license, now)) {
        // ≤ 5 days left → extend the existing key
        result.push(await renewLicense(license));
      } else {
        // > 5 days left → generate a fresh key, leave old one to expire naturally
        const index = allLicenses.length + result.length + 1;
        const [created] = await License.insertMany([
          buildNewLicenseDoc(userId, plan, paymentId, orderId, now, index),
        ]);
        result.push(created);
      }
    }

    return result;
  }

  // ── RENEW AFTER FULL EXPIRY (no active licenses but expired ones exist) ─────
  // e.g. user let everything expire, now re-subscribing to any plan
  if (activeCount === 0 && expiredLicenses.length > 0) {
    const result = [];
    const toReuse = expiredLicenses.slice(0, targetCount);
    const stillNeeded = targetCount - toReuse.length;

    // Reuse expired keys first
    for (const license of toReuse) {
      result.push(await renewLicense(license));
    }

    // Mint new ones if expired pool is smaller than targetCount
    for (let i = 0; i < stillNeeded; i++) {
      const index = allLicenses.length + result.length + 1;
      const [created] = await License.insertMany([
        buildNewLicenseDoc(userId, plan, paymentId, orderId, now, index),
      ]);
      result.push(created);
    }

    return result;
  }

  // ── UPGRADE (targetCount > activeCount) ────────────────────────────────────
  if (targetCount > activeCount) {
    const result = [];

    // 1. Handle existing active keys — extend only if near/past expiry
    for (const license of activeLicenses) {
      if (isNearOrExpired(license, now)) {
        result.push(await renewLicense(license));
      } else {
        result.push(license); // keep as-is
      }
    }

    const extraNeeded = targetCount - activeCount;

    // 2. Reuse expired keys first
    let reused = 0;
    for (const license of expiredLicenses) {
      if (reused >= extraNeeded) break;
      result.push(await renewLicense(license));
      reused++;
    }

    // 3. Mint brand-new keys for whatever's still needed
    const stillNeeded = extraNeeded - reused;
    for (let i = 0; i < stillNeeded; i++) {
      const index = allLicenses.length + result.length + 1;
      const [created] = await License.insertMany([
        buildNewLicenseDoc(userId, plan, paymentId, orderId, now, index),
      ]);
      result.push(created);
    }

    return result;
  }

  // ── DOWNGRADE (targetCount < activeCount) ──────────────────────────────────
  if (targetCount < activeCount) {
    const toKeep    = activeLicenses.slice(0, targetCount);
    const toDisable = activeLicenses.slice(targetCount);

    const result = [];

    for (const license of toKeep) {
      if (isNearOrExpired(license, now)) {
        result.push(await renewLicense(license));
      } else {
        result.push(license);
      }
    }

    for (const license of toDisable) {
      license.status = "expired";
      await license.save();
    }

    return result;
  }
}

module.exports = createOrUpdateLicenses;