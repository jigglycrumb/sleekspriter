// add necessary vendor prefixes to the generated CSS
module.exports = {
  browser: {
    expand: true,
    cwd: 'build/browser',
    src: [ '**/*.css' ],
    dest: 'build/browser'
  }
}