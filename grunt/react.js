// compile JSX sources
module.exports = {
  browser: {
    files: [
      {
        expand: true,
        cwd: 'src/jsx/common',
        src: ['*.jsx'],
        dest: 'build/browser/js/react_components',
        ext: '.js'
      },
      {src: 'src/jsx/browser.jsx', dest: 'build/browser/js/react_components/App.js'},
    ]
  },
};