module.exports = {
  build: {
    src: 'build/**'
  },
  postbuild: {
    src: [
      'build/browser/js',
      'build/desktop/mac/js',
    ]
  },
}