module.exports = {
  options: {
    separator: "\n", //add a new line after each file
    banner: "", //added before everything
    footer: "" //added after everything
  },
  browser: {
    src: [
      'build/browser/js/bower_components/*.js',
      'build/browser/js/lib/**/*.js',

      'build/browser/js/strict.js',
      'build/browser/js/react_mixins/**/*.js',
      'build/browser/js/react_components/**/*.js',

      'build/browser/js/classes/Point.js',
      'build/browser/js/classes/Pixel.js',
      'build/browser/js/classes/File.js',
      'build/browser/js/classes/File.load.js',

      'build/browser/js/classes/Editor.js',
      'build/browser/js/classes/Editor.File.js',
      'build/browser/js/classes/Editor.Frame.js',
      'build/browser/js/classes/Editor.Layers.js',
      'build/browser/js/classes/Editor.Pixels.js',
      'build/browser/js/classes/Editor.Palettes.js',
      'build/browser/js/classes/Editor.Selection.js',
      'build/browser/js/classes/Editor.BrightnessTool.js',
      'build/browser/js/classes/Editor.PaintBucket.js',
      'build/browser/js/classes/Editor.Zoom.js',
      'build/browser/js/classes/Editor.Grid.js',
      'build/browser/js/classes/Editor.Cursor.js',
      'build/browser/js/classes/Editor.Color.js',
      'build/browser/js/classes/Editor.Background.js',
      'build/browser/js/classes/Editor.Tool.js',
      'build/browser/js/classes/Editor.Animations.js',

      'build/browser/js/classes/Hotkeys.js',
      'build/browser/js/classes/Workspace.js',
      'build/browser/js/index.js',
    ],
    // the location of the resulting JS file
    dest: 'build/browser/<%= package.name %>.js'
  },
  desktopMac: {
    src: [
      'build/desktop/mac/js/bower_components/*.js',
      'build/desktop/mac/js/lib/**/*.js',

      'build/desktop/mac/js/strict.js',
      'build/desktop/mac/js/react_mixins/**/*.js',
      'build/desktop/mac/js/react_components/**/*.js',

      'build/desktop/mac/js/classes/Point.js',
      'build/desktop/mac/js/classes/Pixel.js',
      'build/desktop/mac/js/classes/File.js',
      'build/desktop/mac/js/classes/File.load.js',

      'build/desktop/mac/js/classes/Editor.js',
      'build/desktop/mac/js/classes/Editor.File.js',
      'build/desktop/mac/js/classes/Editor.Frame.js',
      'build/desktop/mac/js/classes/Editor.Layers.js',
      'build/desktop/mac/js/classes/Editor.Pixels.js',
      'build/desktop/mac/js/classes/Editor.Palettes.js',
      'build/desktop/mac/js/classes/Editor.Selection.js',
      'build/desktop/mac/js/classes/Editor.BrightnessTool.js',
      'build/desktop/mac/js/classes/Editor.PaintBucket.js',
      'build/desktop/mac/js/classes/Editor.Zoom.js',
      'build/desktop/mac/js/classes/Editor.Grid.js',
      'build/desktop/mac/js/classes/Editor.Cursor.js',
      'build/desktop/mac/js/classes/Editor.Color.js',
      'build/desktop/mac/js/classes/Editor.Background.js',
      'build/desktop/mac/js/classes/Editor.Tool.js',
      'build/desktop/mac/js/classes/Editor.Animations.js',

      'build/desktop/mac/js/classes/Hotkeys.js',
      'build/desktop/mac/js/classes/Workspace.js',
      'build/desktop/mac/js/index.js',
    ],
    // the location of the resulting JS file
    dest: 'build/desktop/mac/<%= package.name %>.js'
  }
}