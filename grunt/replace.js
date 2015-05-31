module.exports = {
  options: {
    patterns: [
      { match: 'shortname', replacement: '<%= package.shortname %>' },
      { match: 'version', replacement: '<%= package.version %>' },
      { match: 'author', replacement: '<%= package.author %>' },
      { match: 'description', replacement: '<%= package.description %>' },
      { match: 'name', replacement: '<%= package.name %>' },
    ]
  },

  browser: {
    files: [{
      expand: true,
      cwd: 'build/browser',
      src: [ '*' ],
      dest: 'build/browser'
    }]
  },

  desktopMac: {
    files: [{
      expand: true,
      cwd: 'build/desktop/mac',
      src: [ '*' ],
      dest: 'build/desktop/mac'
    }]
  },

  desktopWindows: {
    files: [{
      expand: true,
      cwd: 'build/desktop/windows',
      src: [ '*' ],
      dest: 'build/desktop/windows'
    }]
  },

  tablet: {
    files: [{
      expand: true,
      cwd: 'build/tablet',
      src: [ '*' ],
      dest: 'build/tablet'
    }]
  },
}