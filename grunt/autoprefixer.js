// add necessary vendor prefixes to the generated CSS
module.exports = {
  browser: {
    expand: true,
    cwd: 'build/browser',
    src: [ '**/*.css' ],
    dest: 'build/browser'
  },
  desktopMac: {
    options: {
      browsers: ['last 2 Chrome versions']
    },
    files: [{
      expand: true,
      cwd: 'build/desktop/mac',
      src: [ '**/*.css' ],
      dest: 'build/desktop/mac'
    }],
  },
  desktopWindows: {
    options: {
      browsers: ['last 2 Chrome versions']
    },
    files: [{
      expand: true,
      cwd: 'build/desktop/windows',
      src: [ '**/*.css' ],
      dest: 'build/desktop/windows'
    }],
  },
}