// browserify
module.exports = {
  dist: {
    files: {
      'build/bundle.js': ['src/common/js/bundle.js']
    },
    options: {
      transform: [
        ['babelify']
      ]
    }
  }
};
