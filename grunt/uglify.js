module.exports = {
  options: {
    banner: ""
  },
  build: {
    src: 'dist/<%= package.name %>.js',
    dest: 'dist/<%= package.name %>-min.js'
  }
}