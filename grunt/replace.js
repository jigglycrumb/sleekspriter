module.exports = {
  options: {
    patterns: [
      { match: 'app', replacement: '<%= package.name %>' },
      { match: 'version', replacement: '<%= package.version %>' },
      { match: 'author', replacement: '<%= package.author %>' }
    ]
  },

  browser: {
    files: [{
      expand: true,
      cwd: 'build/browser',
      src: [ '**/*' ],
      dest: 'build/browser'
    }]
  },

  desktopMac: {
    files: [{
      expand: true,
      cwd: 'build/desktop/mac',
      src: [ '**/*' ],
      dest: 'build/desktop/mac'
    }]
  },

}