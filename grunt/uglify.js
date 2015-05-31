module.exports = {
  options: {
    banner: ""
  },

  desktopMac: {
    src: 'build/desktop/mac/<%= package.shortname %>.js',
    dest: 'build/desktop/mac/<%= package.shortname %>.js'
  },
  desktopWindows: {
    src: 'build/desktop/windows/<%= package.shortname %>.js',
    dest: 'build/desktop/windows/<%= package.shortname %>.js'
  },
  tablet: {
    src: 'build/tablet/<%= package.shortname %>.js',
    dest: 'build/tablet/<%= package.shortname %>.js'
  }
}