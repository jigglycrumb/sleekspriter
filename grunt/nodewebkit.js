// build nodewebkit
module.exports = {
    desktopMac: {
      options: {
          platforms: ['osx'],
          cacheDir: 'dist/cache',
          buildDir: 'dist/desktop/mac',
          macCredits: 'build/desktop/mac/credits.html',
          version: '0.12.1', // nodewebkit version to use
      },
      src: ['build/desktop/mac/**/*']
    },
    desktopWindows: {
      options: {
          platforms: ['win'],
          cacheDir: 'dist/cache',
          buildDir: 'dist/desktop/windows',
          version: '0.12.1', // nodewebkit version to use
      },
      src: ['build/desktop/windows/**/*']
    },
}