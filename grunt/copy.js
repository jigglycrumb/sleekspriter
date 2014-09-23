/** Copy various files to build directory */
module.exports = {
  browser: {
    files: [
      // fonts
      {expand: true, cwd: 'src/fonts', src: ['**'], dest: 'build/browser/fonts'},

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

      // javascript files
      {expand: true, cwd: 'src/js', src: ['**'], dest: 'build/browser/js'},

      // html files
      {src: 'src/html/browser.html', dest: 'build/browser/index.html'},

      // debugging helpers
      {
        src: 'bower_components/postal.diagnostics/src/postal.diagnostics.js',
        dest: 'build/browser/js/bower_components/postaldiagnostics.js',
      },

      // mocks
      {expand: true, cwd: 'src/mock', src: ['**'], dest: 'build/browser/mock'},
    ]
  },
}