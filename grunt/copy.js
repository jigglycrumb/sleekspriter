/** Copy various files to build directory */
module.exports = {
  browser: {
    files: [
      // common files
      {expand: true, cwd: 'src/common', src: ['fonts/**', 'js/**', 'json/**'], dest: 'build/browser'},

      // bower components
      {expand: true, flatten: true, cwd: 'src/common/bower_components',
        src: [
          'classnames/index.js',
          'conduitjs/lib/conduit.js',
          'fluxxor/build/fluxxor.js',
          'lodash/dist/lodash.js',
          'mousetrap/mousetrap.js',
          'postal.js/lib/postal.js',
          'react/react-with-addons.js',
          'zepto/zepto.js',
        ],
        dest: 'build/browser/js/bower_components/',
      },

      // html files
      {src: 'src/browser/index.html', dest: 'build/browser/index.html'},
      // {src: 'src/common/credits.html', dest: 'build/browser/credits.html'},

      // debugging helpers
      {
        src: 'src/common/bower_components/postal.diagnostics/src/postal.diagnostics.js',
        dest: 'build/browser/js/bower_components/postaldiagnostics.js',
      },

      // platform utils
      {src: 'src/browser/PlatformUtils.js', dest: 'build/browser/js/classes/PlatformUtils.js'},


      // file handlers
      {src: 'src/browser/loadfile.php', dest: 'build/browser/loadfile.php'},
      {src: 'src/browser/File.extensions.js', dest: 'build/browser/js/classes/File.extensions.js'},

      // index script
      {src: 'src/browser/index.extensions.js', dest: 'build/browser/js/index.extensions.js'},
    ]
  },
  desktopMac: {
    files: [
      // common files
      {expand: true, cwd: 'src/common', src: ['fonts/**', 'js/**', 'json/**'], dest: 'build/desktop/mac'},

      // bower components
      {expand: true, flatten: true, cwd: 'src/common/bower_components',
        src: [
          'classnames/index.js',
          'conduitjs/lib/conduit.js',
          'fluxxor/build/fluxxor.js',
          'lodash/dist/lodash.js',
          'postal.js/lib/postal.js',
          'mousetrap/mousetrap.js',
          'react/react-with-addons.js',
          'zepto/zepto.js',
        ],
        dest: 'build/desktop/mac/js/bower_components/',
      },

      // html files
      {src: 'src/desktop/index.html', dest: 'build/desktop/mac/index.html'},
      {src: 'src/desktop/mac/credits.html', dest: 'build/desktop/mac/credits.html'},

      // debugging helpers
      {
        src: 'src/common/bower_components/postal.diagnostics/src/postal.diagnostics.js',
        dest: 'build/desktop/mac/js/bower_components/postaldiagnostics.js',
      },

      // platform utils
      {src: 'src/desktop/PlatformUtils.js', dest: 'build/desktop/mac/js/classes/PlatformUtils.js'},

      // package.json
      {
        src: 'src/desktop/package.json',
        dest: 'build/desktop/mac/package.json',
      },

      // file handlers
      {src: 'src/desktop/File.extensions.js', dest: 'build/desktop/mac/js/classes/File.extensions.js'},

      // menu script
      {src: 'src/desktop/menu.js', dest: 'build/desktop/mac/js/menu.js'},

      // index script
      {src: 'src/desktop/index.extensions.js', dest: 'build/desktop/mac/js/index.extensions.js'},

      {src: 'src/common/bower_components/gif.js/dist/gif.worker.js', dest: 'build/desktop/mac/gif.worker.js'},
    ]
  },
  desktopWindows: {
    files: [
      // common files
      {expand: true, cwd: 'src/common', src: ['fonts/**', 'js/**', 'json/**'], dest: 'build/desktop/windows'},

      // bower components
      {expand: true, flatten: true, cwd: 'src/common/bower_components',
        src: [
          'classnames/index.js',
          'conduitjs/lib/conduit.js',
          'fluxxor/build/fluxxor.js',
          'lodash/dist/lodash.js',
          'postal.js/lib/postal.js',
          'mousetrap/mousetrap.js',
          'react/react-with-addons.js',
          'zepto/zepto.js',
        ],
        dest: 'build/desktop/windows/js/bower_components/',
      },

      // html files
      {src: 'src/desktop/index.html', dest: 'build/desktop/windows/index.html'},
      {src: 'src/desktop/windows/credits.html', dest: 'build/desktop/windows/credits.html'},

      // debugging helpers
      {
        src: 'src/common/bower_components/postal.diagnostics/src/postal.diagnostics.js',
        dest: 'build/desktop/windows/js/bower_components/postaldiagnostics.js',
      },

      // platform utils
      {src: 'src/desktop/PlatformUtils.js', dest: 'build/desktop/windows/js/classes/PlatformUtils.js'},

      // package.json
      {
        src: 'src/desktop/package.json',
        dest: 'build/desktop/windows/package.json',
      },

      // file handlers
      {src: 'src/desktop/File.extensions.js', dest: 'build/desktop/windows/js/classes/File.extensions.js'},

      // menu script
      {src: 'src/desktop/menu.js', dest: 'build/desktop/windows/js/menu.js'},

      // index script
      {src: 'src/desktop/index.extensions.js', dest: 'build/desktop/windows/js/index.extensions.js'},

      {src: 'src/common/bower_components/gif.js/dist/gif.worker.js', dest: 'build/desktop/windows/gif.worker.js'},
    ]
  },
  tablet: {
    files: [
      // common files
      {expand: true, cwd: 'src/common', src: ['fonts/**', 'js/**', 'json/**'], dest: 'build/tablet'},

      // bower components
      {expand: true, flatten: true, cwd: 'src/common/bower_components',
        src: [
          'classnames/index.js',
          'conduitjs/lib/conduit.js',
          'fluxxor/build/fluxxor.js',
          'lodash/dist/lodash.js',
          'postal.js/lib/postal.js',
          'mousetrap/mousetrap.js',
          'react/react-with-addons.js',
          'zepto/zepto.js',
        ],
        dest: 'build/tablet/js/bower_components/',
      },

      // html files
      {src: 'src/tablet/index.html', dest: 'build/tablet/index.html'},
      //{src: 'src/tablet/credits.html', dest: 'build/tablet/credits.html'},

      // debugging helpers
      {
        src: 'src/common/bower_components/postal.diagnostics/src/postal.diagnostics.js',
        dest: 'build/tablet/js/bower_components/postaldiagnostics.js',
      },

      // platform utils
      {src: 'src/tablet/PlatformUtils.js', dest: 'build/tablet/js/classes/PlatformUtils.js'},

      // file handlers
      {src: 'src/tablet/File.extensions.js', dest: 'build/tablet/js/classes/File.extensions.js'},

      // index script
      {src: 'src/tablet/index.extensions.js', dest: 'build/tablet/js/index.extensions.js'},

      {src: 'src/common/bower_components/gif.js/dist/gif.worker.js', dest: 'build/tablet/gif.worker.js'},

      // phonegap config
      {src: 'src/tablet/config.xml', dest: 'build/tablet/config.xml'},
    ]
  },
}