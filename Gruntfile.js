module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),



    less: {
      development: {
        files: {
          // target.css file: source.less file
          "dist/<%= pkg.name %>.css": "less/app.less"
        }
      },
      production: {
        options: {
          compress: true,
          cleancss: true,
        },
        files: {
          // target.css file: source.less file
          "dist/<%= pkg.name %>-min.css": "less/app.less"
        }
      }
    },



    react: {

      concat: {
        files: {
          'js/build/react-components.js': [
            'js/mixins/*.jsx',
            'js/components/*.jsx',
            'js/index.jsx',
          ]
        }
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
          'bower_components/underscore/underscore.js',
          'bower_components/postal.js/lib/postal.js',
          'bower_components/postal.diagnostics/src/postal.diagnostics.js',
          'bower_components/mousetrap/mousetrap.js',
          'bower_components/react/react.js',
          'js/lib/color.js',
          'js/lib/tween.js',


          'js/strict.js',
          'js/classes/Point.js',
          'js/classes/Pixel.js',
          'js/classes/File.js',
          'js/classes/Stage.js',


          'js/classes/Editor.js',
          'js/classes/Editor.Layers.js',
          'js/classes/Editor.Palettes.js',
          'js/classes/Editor.Selection.js',
          'js/classes/Editor.BrightnessTool.js',

          'js/classes/Hotkeys.js',
          'js/classes/Workspace.js',

          'js/build/react-components.js',
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
        dest: 'dist/<%= pkg.name %>-min.js'
      }
    },


    watch: {
      styles: {
        // Which files to watch (all .less files recursively in the less directory)
        files: ['less/**/*.less'],
        tasks: ['less:development'],
      },
      react: {
        files: ['js/**/*.jsx'],
        tasks: ['react']
      },
      scripts: {
        files: ['js/**/*.js'],
        tasks: ['concat']
      },
      /*
      uglify: {
        files: ['dist/<%= pkg.name %>.js'],
        tasks: ['uglify']
      },
      */
      livereload: {
        // Here we watch the files the less task will compile to
        // These files are sent to the live reload server after less compiles to them
        options: { livereload: true },
        files: ['dist/**/*'],
      },
    },


    plato: {
      report: {
        files: {
          'report': ['js/**/*.js', 'js/**/*.jsx']
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-plato');
  grunt.loadNpmTasks('grunt-react');

  grunt.registerTask('default', ['watch']);
  grunt.registerTask('css', ['less']);
  grunt.registerTask('jsx', ['react']);
  grunt.registerTask('js', ['concat']);
  grunt.registerTask('min', ['uglify']);
  grunt.registerTask('report', ['plato']);
  grunt.registerTask('build', ['concat', 'uglify']);
};