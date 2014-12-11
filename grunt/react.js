// compile JSX sources
module.exports = {
  browser: {
    files: [{
      expand: true,
      src: 'src/common/jsx/**/*.jsx',
      flatten: true,
      dest: 'build/browser/js/react_components',
      ext: '.js'
    }]
  },

  desktopMac: {
    files: [{
      expand: true,
      src: 'src/common/jsx/**/*.jsx',
      flatten: true,
      dest: 'build/desktop/mac/js/react_components',
      ext: '.js'
    }]
  },
};