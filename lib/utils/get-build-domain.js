module.exports = function getBuildDomain() {
  if (process.env.CONTEXT === 'production') {
    return 'https://simplabs.com';
  } else {
    return process.env.DEPLOY_PRIME_URL || process.env.LOCAL_URL || 'https://simplabs.com';
  }
};
