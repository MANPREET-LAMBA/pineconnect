const License = require("../schema/licenseSchema");
const Plan = require("../schema/planSchema");
const crypto = require("crypto");

function generateLicenseKey() {
  return crypto.randomBytes(16).toString("hex").toUpperCase();
}

async function createOrUpdateLicenses(userId, planName, paymentId, orderId) {

  const plan = await Plan.findOne({ name: planName });
  const licenseCount = plan.Accounts;

  const duration = 30 * 24 * 60 * 60 * 1000; // 30 days

  const existingLicenses = await License.find({ user: userId }).sort({ createdAt: 1 });

  const now = new Date();

  // FIRST PURCHASE
  if (existingLicenses.length === 0) {

    const licenses = [];

    for (let i = 0; i < licenseCount; i++) {
      licenses.push({
        user: userId,
        plan: plan.name,
        licenseKey: generateLicenseKey(),
        licenseName: `${plan.name}-${i + 1}`,
        mode: "algo",
        paymentId,
        orderId,
        status: "active",
        startDate: now,
        endDate: new Date(now.getTime() + duration),
      });
    }

    return await License.insertMany(licenses);
  }

  // CHECK ACTIVE LICENSES
  const activeLicenses = existingLicenses.filter(
    (l) => l.status === "active"
  );

  const currentCount = activeLicenses.length;

  // RENEW DATE
  const newEndDate = (license) =>
    license.endDate > now
      ? new Date(license.endDate.getTime() + duration)
      : new Date(now.getTime() + duration);

  // SAME PLAN RENEW
  if (currentCount === licenseCount) {

    for (let license of activeLicenses) {
      license.endDate = newEndDate(license);
      license.paymentId = paymentId;
      license.orderId = orderId;
      await license.save();
    }

    return activeLicenses;
  }

  // UPGRADE PLAN (MORE ACCOUNTS)
  if (licenseCount > currentCount) {

    // renew old licenses
    for (let license of activeLicenses) {
      license.endDate = newEndDate(license);
      license.paymentId = paymentId;
      license.orderId = orderId;
      await license.save();
    }

    const extraLicensesNeeded = licenseCount - currentCount;

    const newLicenses = [];

    for (let i = 0; i < extraLicensesNeeded; i++) {
      newLicenses.push({
        user: userId,
        plan: plan.name,
        licenseKey: generateLicenseKey(),
        licenseName: `${plan.name}-${currentCount + i + 1}`,
        mode: "algo",
        paymentId,
        orderId,
        status: "active",
        startDate: now,
        endDate: new Date(now.getTime() + duration),
      });
    }

    const created = await License.insertMany(newLicenses);

    return [...activeLicenses, ...created];
  }

  // DOWNGRADE PLAN (LESS ACCOUNTS)
  if (licenseCount < currentCount) {

    const licensesToKeep = activeLicenses.slice(0, licenseCount);
    const licensesToDisable = activeLicenses.slice(licenseCount);

    // renew kept licenses
    for (let license of licensesToKeep) {
      license.endDate = newEndDate(license);
      license.paymentId = paymentId;
      license.orderId = orderId;
      await license.save();
    }

    // deactivate extra licenses
    for (let license of licensesToDisable) {
      license.status = "expired";
      await license.save();
    }

    return licensesToKeep;
  }
}

module.exports = createOrUpdateLicenses;