module.exports = {
  styles: {
    // Which files to watch (all .less files recursively in the less directory)
    files: ['less/** /*.less'],
    tasks: ['less:development'],
  },
  react: {
    files: ['js/** /*.jsx'],
    tasks: ['react']
  },
  scripts: {
    files: ['js/** /*.js'],
    tasks: ['concat']
  },
  livereload: {
    // Here we watch the files the less task will compile to
    // These files are sent to the live reload server after less compiles to them
    options: { livereload: true },
    files: ['dist/** /*'],
  },
}