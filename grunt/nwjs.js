// build nwjs
module.exports = {
    options: {
      cacheDir: 'dist/cache',
      version: '0.12.1', // '0.12.3',// nwjs version to use
      appName: '<%= package.longname %>',
      appVerison: '<%= package.version %>',
    },

    desktopMac: {
      options: {
          platforms: ['osx'],
          buildDir: 'dist/desktop/mac',
          macCredits: 'build/desktop/mac/credits.html',
          // macIcns: 'src/icons/icon.icns',
      },
      src: ['build/desktop/mac/**/*']
    },
    desktopWindows: {
      options: {
          platforms: ['win'],
          buildDir: 'dist/desktop/windows',
          // winIco: 'src/icons/icon.ico',
      },
      src: ['build/desktop/windows/**/*']
    },
}