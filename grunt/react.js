// compile JSX sources
module.exports = {
  browser: {
    files: [{
      expand: true,
      src: 'src/common/jsx/**/*.jsx',
      flatten: true,
      dest: 'build/browser/js/react_components',
      ext: '.js'
    },
    {
      expand: true,
      src: 'src/browser/jsx/**/*.jsx',
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
    },
    {
      expand: true,
      src: 'src/desktop/jsx/*.jsx',
      flatten: true,
      dest: 'build/desktop/mac/js/react_components',
      ext: '.js'
    }]
  },

  desktopWindows: {
    files: [{
      expand: true,
      src: 'src/common/jsx/**/*.jsx',
      flatten: true,
      dest: 'build/desktop/windows/js/react_components',
      ext: '.js'
    },
    {
      expand: true,
      src: 'src/desktop/jsx/*.jsx',
      flatten: true,
      dest: 'build/desktop/windows/js/react_components',
      ext: '.js'
    }]
  },

  tablet: {
    files: [{
      expand: true,
      src: 'src/common/jsx/**/*.jsx',
      flatten: true,
      dest: 'build/tablet/js/react_components',
      ext: '.js'
    },
    {
      expand: true,
      src: 'src/tablet/jsx/*.jsx',
      flatten: true,
      dest: 'build/tablet/js/react_components',
      ext: '.js'
    }]
  },
};