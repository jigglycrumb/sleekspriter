module.exports = {
  options: {
    banner: ""
  },

  desktopMac: {
    src: 'build/desktop/mac/<%= package.name %>.js',
    dest: 'build/desktop/mac/<%= package.name %>.js'
  },
  desktopWindows: {
    src: 'build/desktop/windows/<%= package.name %>.js',
    dest: 'build/desktop/windows/<%= package.name %>.js'
  }
}