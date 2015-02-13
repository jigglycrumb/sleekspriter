module.exports = {
  build: {
    src: 'build'
  },
  postbuild: {
    src: [
      'build/browser/js',
      'build/desktop/mac/js',
      'build/desktop/windows/js',
    ]
  },
  dist: {
    src: 'dist'
  },
  all: {
    src: [
      'build', 'dist'
    ],
  },
}