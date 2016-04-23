module.exports = {
  build: {
    src: 'build'
  },
  dist: {
    src: 'dist'
  },
  postbuild: {
    src: [
      'build/browser/js',
      'build/desktop/mac/js',
      'build/desktop/windows/js',
      'build/tablet/js',
      'build/bundle.js',
    ]
  },
  all: {
    src: [
      'build', 'dist'
    ],
  },
};
