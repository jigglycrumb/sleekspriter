/** Copy various files to build directory */
function sources(target) {
  var s = [];

  // common files
  s.push({expand: true, cwd: 'src/common', src: ['fonts/**', 'js/**', 'json/**'], dest: 'build/'+target });

  if(target == 'desktop/mac' || target == 'desktop/windows') {
    s.push({src: 'src/'+target+'/credits.html', dest: 'build/'+target+'/credits.html'});
  }

  return s;
}

module.exports = {
  browser: {
    files: sources('browser').concat([
      // html files
      {src: 'src/browser/index.html', dest: 'build/browser/index.html'},

      // utilities
      {src: 'src/browser/PlatformUtils.js', dest: 'build/browser/js/classes/PlatformUtils.js'},

      // file handlers
      {src: 'src/browser/loadfile.php', dest: 'build/browser/loadfile.php'},
    ])
  },
  desktopMac: {
    files: sources('desktop/mac').concat([
      // html files
      {src: 'src/desktop/index.html', dest: 'build/desktop/mac/index.html'},

      // utilities
      {src: 'src/desktop/PlatformUtils.js', dest: 'build/desktop/mac/js/classes/PlatformUtils.js'},

      // workers
      {expand: true, cwd: 'src/common/js', src: ['workers/**'], dest: 'build/desktop/mac'},

      // package.json
      {src: 'src/desktop/package.json', dest: 'build/desktop/mac/package.json'},

      // menu script
      {src: 'src/desktop/menu.js', dest: 'build/desktop/mac/js/menu.js'},

      {src: 'src/common/js/lib/gif.worker.js', dest: 'build/desktop/mac/gif.worker.js'},
    ])
  },
  desktopWindows: {
    files: sources('desktop/windows').concat([
      // html files
      {src: 'src/desktop/index.html', dest: 'build/desktop/windows/index.html'},

      // utilities
      {src: 'src/desktop/PlatformUtils.js', dest: 'build/desktop/windows/js/classes/PlatformUtils.js'},

      // workers
      {expand: true, cwd: 'src/common/js', src: ['workers/**'], dest: 'build/desktop/windows'},

      // package.json
      {src: 'src/desktop/package.json', dest: 'build/desktop/windows/package.json'},

      // menu script
      {src: 'src/desktop/menu.js', dest: 'build/desktop/windows/js/menu.js'},

      {src: 'src/common/js/lib/gif.worker.js', dest: 'build/desktop/windows/gif.worker.js'},
    ])
  },
  tablet: {
    files: sources('tablet').concat([
      // html files
      {src: 'src/tablet/index.html', dest: 'build/tablet/index.html'},
      // {src: 'src/tablet/credits.html', dest: 'build/tablet/credits.html'},

      // utilities
      {src: 'src/tablet/PlatformUtils.js', dest: 'build/tablet/js/classes/PlatformUtils.js'},

      {src: 'src/common/js/lib/gif.worker.js', dest: 'build/tablet/gif.worker.js'},

      // phonegap config
      {src: 'src/tablet/config.xml', dest: 'build/tablet/config.xml'},
    ])
  },
};
