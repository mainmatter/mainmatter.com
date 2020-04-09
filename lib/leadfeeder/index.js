'use strict';

module.exports = {
  name: require('./package').name,

  isDevelopingAddon() {
    return true;
  },

  contentFor(type) {
    if (process.env.EMBER_ENV === 'development') {
      return '';
    }

    if (type === 'body-footer') {
      return `
        <script>
          if (location.hostname === 'simplabs.com') {
            (function(){
              window.ldfdr = window.ldfdr || {};
              (function(d, s, ss, fs){
                fs = d.getElementsByTagName(s)[0];
                function ce(src){
                  var cs  = d.createElement(s);
                  cs.src = src;
                  setTimeout(function(){fs.parentNode.insertBefore(cs,fs)}, 1);
                }
                ce(ss);
              })(document, 'script', 'https://sc.lfeeder.com/lftracker_v1_lYNOR8xWVYgaWQJZ.js');
            })();
          }
        </script>
      `;
    }

    return '';
  },
};
