// compile JSX sources
module.exports = {
  browser: {
    files: [{
      expand: true,
      cwd: 'src/jsx',
      src: ['*.jsx'],
      dest: 'build/browser/js/react_components',
      ext: '.js'
    }]
  },
};