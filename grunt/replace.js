module.exports = {
  browser: {
    options: {
      patterns: [
        { match: 'app', replacement: '<%= package.name %>' },
        { match: 'version', replacement: '<%= package.version %>' },
        { match: 'author', replacement: '<%= package.author %>' }
      ]
    },
    files: [{
      expand: true,
      cwd: 'build/browser',
      src: [ '**/*' ],
      dest: 'build/browser'
    }]
  }
}