// compile JSX sources
module.exports = {
  browser: {
    files: [
      {
        expand: true,
        src: 'src/jsx/common/**/*.jsx',
        flatten: true,
        dest: 'build/browser/js/react_components',
        ext: '.js'
      },
      {src: 'src/jsx/browser.jsx', dest: 'build/browser/js/react_components/App.js'},
    ]
  },
};