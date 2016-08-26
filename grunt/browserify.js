// browserify
module.exports = {
  // dist: {
  //   files: {
  //     'build/bundle.js': ['src/common/js/bundle.js']
  //   },
  //   options: {
  //     transform: [
  //       ['babelify']
  //     ]
  //   }
  // },

  browser: {
    files: {
      'build/browser/js/browserify-bundle.js': ['build/browser/js/bundle.js']
    },
    options: {
      transform: [
        ['babelify']
      ]
    }
  },
  desktopMac: {
    files: {
      'build/desktop/mac/js/browserify-bundle.js': ['build/desktop/mac/js/bundle.js']
    },
    options: {
      transform: [
        ['babelify']
      ]
    }
  },
  desktopWindows: {
    files: {
      'build/desktop/windows/js/browserify-bundle.js': ['build/desktop/windows/bundle.js']
    },
    options: {
      transform: [
        ['babelify']
      ]
    }
  },
};
