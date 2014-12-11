/** Copy various files to build directory */
module.exports = {
  browser: {
    files: [
      // common files
      {expand: true, cwd: 'src/common', src: ['fonts/**', 'js/**'], dest: 'build/browser'},

      // bower components
      {expand: true, flatten: true, cwd: 'bower_components',
        src: [
          'conduitjs/lib/conduit.js',
          'lodash/dist/lodash.js',
          'postal.js/lib/postal.js',
          'mousetrap/mousetrap.js',
          'react/react-with-addons.js',
          'zepto/zepto.js',
        ],
        dest: 'build/browser/js/bower_components/',
      },

      // html files
      {src: 'src/browser/index.html', dest: 'build/browser/index.html'},

      // debugging helpers
      {
        src: 'bower_components/postal.diagnostics/src/postal.diagnostics.js',
        dest: 'build/browser/js/bower_components/postaldiagnostics.js',
      },

      // mocks
      {expand: true, cwd: 'src/browser/mock', src: ['**'], dest: 'build/browser/mock'},
    ]
  },
  desktopMac: {
    files: [
      // common files
      {expand: true, cwd: 'src/common', src: ['fonts/**', 'js/**'], dest: 'build/desktop/mac'},

      // bower components
      {expand: true, flatten: true, cwd: 'bower_components',
        src: [
          'conduitjs/lib/conduit.js',
          'lodash/dist/lodash.js',
          'postal.js/lib/postal.js',
          'mousetrap/mousetrap.js',
          'react/react-with-addons.js',
          'zepto/zepto.js',
        ],
        dest: 'build/desktop/mac/js/bower_components/',
      },

      // html files
      {src: 'src/desktop/mac/index.html', dest: 'build/desktop/mac/index.html'},

      // debugging helpers
      {
        src: 'bower_components/postal.diagnostics/src/postal.diagnostics.js',
        dest: 'build/desktop/mac/js/bower_components/postaldiagnostics.js',
      },

      // package.json
      {
        src: 'src/desktop/package.json',
        dest: 'build/desktop/mac/package.json',
      },

      // mocks
      // {expand: true, cwd: 'src/mock', src: ['**'], dest: 'build/desktop/mac/mock'},
    ]
  },
}