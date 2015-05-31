module.exports = {
  desktopMac32: {
    options: {
      archive: 'release/<%= package.name %>-<%= package.version %>-osx32.zip',
    },
    files: [{expand: true, cwd: 'dist/desktop/mac/<%= package.name %>/osx32/', src: '**/*', dest: '.'}],
  },
  desktopMac64: {
    options: {
      archive: 'release/<%= package.name %>-<%= package.version %>-osx64.zip',
    },
    files: [{expand: true, cwd: 'dist/desktop/mac/<%= package.name %>/osx64/', src: '**/*', dest: '.'}],
  },
  desktopWin32: {
    options: {
      archive: 'release/<%= package.name %>-<%= package.version %>-win32.zip',
    },
    files: [{expand: true, cwd: 'dist/desktop/windows/<%= package.name %>/win32/', src: '**/*', dest: '.'}],
  },
  desktopWin64: {
    options: {
      archive: 'release/<%= package.name %>-<%= package.version %>-win64.zip',
    },
    files: [{expand: true, cwd: 'dist/desktop/windows/<%= package.name %>/win64/', src: '**/*', dest: '.'}],
  },
  /*
  desktopLinux32: {
    options: {
      archive: 'release/<%= package.name %>-<%= package.version %>-linux32.zip',
    },
    files: [{expand: true, cwd: 'dist/desktop/<%= package.name %>/linux32/', src: '** /*', dest: '.'}],
  },
  desktopLinux64: {
    options: {
      archive: 'release/<%= package.name %>-<%= package.version %>-linux64.zip',
    },
    files: [{expand: true, cwd: 'dist/desktop/<%= package.name %>/linux64/', src: '** /*', dest: '.'}],
  },
  */

  tablet: {
    options: {
      archive: 'dist/tablet/<%= package.name %>-<%= package.version %>.zip',
    },
    files: [{expand: true, cwd: 'build/tablet/', src: '**/*', dest: '.'}],
  },
}