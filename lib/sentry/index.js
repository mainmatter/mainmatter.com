'use strict';

module.exports = {
  name: require('./package').name,

  isDevelopingAddon() {
    return true;
  },

  contentFor(type) {
    if (type === 'body-pre-app-bundle') {
      let { SENTRY_DSN, SENTRY_ENV } = process.env;
      if (SENTRY_DSN) {
        let options = {
          dsn: SENTRY_DSN,
        };
        if (SENTRY_ENV) {
          options.environment = SENTRY_ENV;
        }
        return `
          <script src="https://browser.sentry-cdn.com/5.2.0/bundle.min.js" crossorigin="anonymous"></script>
          <script>
            Sentry.init(${JSON.stringify(options)});
          </script>
        `;
      } else {
        return '';
      }
    } else {
      return '';
    }
  },
};
