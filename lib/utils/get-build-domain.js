module.exports = function getBuildDomain() {
  return process.env.DEPLOY_PRIME_URL || process.env.LOCAL_URL || 'https://simplabs.com';
};
