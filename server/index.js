'use strict';

// index.js
module.exports = function(app) {
  app.get('*', function(req, res, next) {
    let subpath = '/';
    if (req.headers.accept && req.headers.accept.includes('text/html') && req.path !== subpath) {
      req.url = subpath;
    }
    next();
  });
};