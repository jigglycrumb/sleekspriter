module.exports = {
  desktopMac32: {
    options: {
      archive: 'release/<%= package.name %>-<%= package.version %>-osx32.zip',
    },
    files: [{expand: true, cwd: 'dist/desktop/<%= package.name %>/osx32/', src: '**/*', dest: './'}],
  },
  desktopMac64: {
    options: {
      archive: 'release/<%= package.name %>-<%= package.version %>-osx64.zip',
    },
    files: [{expand: true, cwd: 'dist/desktop/<%= package.name %>/osx64/', src: '**/*', dest: './'}],
  },
  desktopWin32: {
    options: {
      archive: 'release/<%= package.name %>-<%= package.version %>-win32.zip',
    },
    files: [{expand: true, cwd: 'dist/desktop/<%= package.name %>/win32/', src: '**/*', dest: '<%= package.name %>/'}],
  },
  desktopWin64: {
    options: {
      archive: 'release/<%= package.name %>-<%= package.version %>-win64.zip',
    },
    files: [{expand: true, cwd: 'dist/desktop/<%= package.name %>/win64/', src: '**/*', dest: '<%= package.name %>/'}],
  },
  desktopLinux32: {
    options: {
      archive: 'release/<%= package.name %>-<%= package.version %>-linux32.zip',
    },
    files: [{expand: true, cwd: 'dist/desktop/<%= package.name %>/linux32/', src: '**/*', dest: '<%= package.name %>/'}],
  },
  desktopLinux64: {
    options: {
      archive: 'release/<%= package.name %>-<%= package.version %>-linux64.zip',
    },
    files: [{expand: true, cwd: 'dist/desktop/<%= package.name %>/linux64/', src: '**/*', dest: '<%= package.name %>/'}],
  },
}