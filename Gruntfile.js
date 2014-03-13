module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          // target.css file: source.less file
          "css/app.css": "css/app.less"
        }
      }
    },
    watch: {
      styles: {
        // Which files to watch (all .less files recursively in the less directory)
        files: ['css/**/*.less'],
        tasks: ['less'],
        options: {
          atBegin: true
        }
      },
      scripts: {
        files: ['js/**/*.js'],
        tasks: ['concat']
      }
    },
    concat: {
      options: {
        separator: "\n", //add a new line after each file
        banner: "", //added before everything
        footer: "" //added after everything
      },
      dist: {
        // the files to concatenate
        src: [
          'js/jsx-header.js',
          'js/classes/color-0.4.4.js',
          'js/classes/Signal.js',
          'js/classes/IO.js',
          'js/classes/Editor.js',
          'js/classes/Canvas.js',
          'js/components/App.js',
          'js/components/StageBox.js',
          'js/components/StageBoxLayer.js',
          'js/components/StageBoxToolsLayer.js',
          'js/components/ToolBox.js',
          'js/components/ToolBoxTool.js',
          'js/components/LayerBox.js',
          'js/components/LayerBoxLayer.js',
          'js/components/LayerBoxLayerPreview.js',
          'js/components/BrushTool.js',
          'js/components/EraserTool.js',
          'js/components/HandTool.js',
          'js/components/ZoomTool.js',
          'js/components/StatusBar.js',
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

  grunt.registerTask('default', ['watch', 'concat']);
  grunt.registerTask('build', ['concat', 'uglify']);
};