// build nodewebkit
module.exports = {
    desktopMac: {
      options: {
          platforms: ['osx'],
          cacheDir: 'dist/cache',
          buildDir: 'dist/desktop/mac',
          macCredits: 'src/common/credits.html',
      },
      src: ['build/desktop/mac/**/*']
    },
    desktopWindows: {
      options: {
          platforms: ['win'],
          cacheDir: 'dist/cache',
          buildDir: 'dist/desktop/windows',
      },
      src: ['build/desktop/windows/**/*']
    },
}