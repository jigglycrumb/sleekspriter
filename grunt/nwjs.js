// build nwjs
module.exports = {
    options: {
      cacheDir: 'dist/cache',
      // version: '0.12.3', // nwjs version to use
      appName: '<%= package.longname %>',
      appVerison: '<%= package.version %>',
    },

    desktopMac: {
      options: {
          platforms: ['osx64'],
          buildDir: 'dist/desktop/mac',
          macCredits: 'build/desktop/mac/credits.html',
          // macIcns: 'src/icons/icon.icns',
      },
      src: ['build/desktop/mac/**/*']
    },
    // desktopWindows: {
    //   options: {
    //       platforms: ['win64'],
    //       buildDir: 'dist/desktop/windows',
    //       // winIco: 'src/icons/icon.ico',
    //   },
    //   src: ['build/desktop/windows/**/*']
    // },
};
