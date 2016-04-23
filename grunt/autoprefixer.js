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
      browsers: ['Chrome >= 40']
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
      browsers: ['Chrome >= 40']
    },
    files: [{
      expand: true,
      cwd: 'build/desktop/windows',
      src: [ '**/*.css' ],
      dest: 'build/desktop/windows'
    }],
  },
  tablet: {
    files: [{
      expand: true,
      cwd: 'build/tablet',
      src: [ '**/*.css' ],
      dest: 'build/tablet'
    }],
  },
};
