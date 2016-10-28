module.exports = {
  // desktopMac32: {
  //   options: {
  //     archive: 'release/<%= package.version %>/<%= package.longname %>-<%= package.version %>-osx32.zip',
  //   },
  //   files: [{expand: true, cwd: 'dist/desktop/mac/<%= package.longname %>/osx32/', src: '**/*', dest: '.'}],
  // },
  desktopMac64: {
    options: {
      archive: 'release/<%= package.version %>/<%= package.longname %>-<%= package.version %>-osx64.zip',
    },
    files: [{expand: true, cwd: 'dist/desktop/mac/<%= package.longname %>/osx64/', src: '**/*', dest: '.'}],
  },
  // desktopWin32: {
  //   options: {
  //     archive: 'release/<%= package.version %>/<%= package.longname %>-<%= package.version %>-win32.zip',
  //   },
  //   files: [{expand: true, cwd: 'dist/desktop/windows/<%= package.longname %>/win32/', src: '**/*', dest: '.'}],
  // },
  desktopWin64: {
    options: {
      archive: 'release/<%= package.version %>/<%= package.longname %>-<%= package.version %>-win64.zip',
    },
    files: [{expand: true, cwd: 'dist/desktop/windows/<%= package.longname %>/win64/', src: '**/*', dest: '.'}],
  },
  /*
  desktopLinux32: {
    options: {
      archive: 'release/<%= package.version %>/<%= package.longname %>-<%= package.version %>-linux32.zip',
    },
    files: [{expand: true, cwd: 'dist/desktop/<%= package.longname %>/linux32/', src: '** /*', dest: '.'}],
  },
  desktopLinux64: {
    options: {
      archive: 'release/<%= package.version %>/<%= package.longname %>-<%= package.version %>-linux64.zip',
    },
    files: [{expand: true, cwd: 'dist/desktop/<%= package.longname %>/linux64/', src: '** /*', dest: '.'}],
  },
  */

  tablet: {
    options: {
      archive: 'dist/tablet/<%= package.longname %>-<%= package.version %>.zip',
    },
    files: [{expand: true, cwd: 'build/tablet/', src: '**/*', dest: '.'}],
  },
}
