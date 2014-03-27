module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    less: {
      development: {
        options: {
          compress: false,
          yuicompress: false
        },
        files: {
          // target.css file: source.less file
          "dist/<%= pkg.name %>.css": "less/app.less"
        }
      },
      production: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          // target.css file: source.less file
          "dist/<%= pkg.name %>.css": "less/app.less"
        }
      }
    },
    watch: {
      styles: {
        // Which files to watch (all .less files recursively in the less directory)
        files: ['less/**/*.less'],
        tasks: ['less:development'],
      },
      scripts: {
        files: ['js/**/*.js'],
        tasks: ['concat:js']
      },
      livereload: {
        // Here we watch the files the less task will compile to
        // These files are sent to the live reload server after less compiles to them
        options: { livereload: true },
        files: ['dist/**/*'],
      },
    },
    concat: {
      options: {
        separator: "\n", //add a new line after each file
        banner: "", //added before everything
        footer: "" //added after everything
      },
      js: {
        // the files to concatenate
        src: [
          'js/jsx-header.js',

          'js/classes/color.js',

          'js/strict.js',
          'js/classes/Signal.js',
          'js/classes/File.js',
          'js/classes/Editor.js',
          'js/classes/Stage.js',

          'js/mixins/FoldableMixin.js',
          'js/mixins/CopyFrameMixin.js',

          'js/components/App.js',
          'js/components/ToolContainer.js',

          'js/components/BrushTool.js',
          'js/components/EraserTool.js',
          'js/components/EyedropperTool.js',
          'js/components/BrightnessTool.js',
          'js/components/ZoomTool.js',

          'js/components/StageBox.js',
          'js/components/StageBoxLayer.js',
          'js/components/StageBoxToolsLayer.js',

          'js/components/ToolBox.js',
          'js/components/ToolBoxTool.js',

          'js/components/PreviewBox.js',
          'js/components/PreviewBoxPreview.js',

          'js/components/FrameBox.js',
          'js/components/FrameBoxFrame.js',

          'js/components/LayerBox.js',
          'js/components/LayerBoxLayer.js',
          'js/components/LayerBoxLayerPreview.js',

          //'js/components/HandTool.js',

          'js/components/StatusBar.js',

          'js/components/OffscreenFrameCanvas.js',


          'js/index.js'
        ],
        // the location of the resulting JS file
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: ""
      },
      build: {
        src: 'dist/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['watch']);
  grunt.registerTask('build', ['concat', 'uglify']);
};