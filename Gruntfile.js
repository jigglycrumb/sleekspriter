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



    csslint: {
      strict: {
        options: {
          import: 2
        },
        src: ['dist/<%= pkg.name %>.css']
      },
      lax: {
        options: {
          import: false
        },
        src: ['dist/<%= pkg.name %>.css']
      }
    },



    react: {
      mixins: {
        files: {
          'build/js/react-mixins.js': [
            'js/mixins/*.js',
            'js/mixins/*.jsx',
          ]
        }
      },
      components: {
        files: {
          'build/js/react-components.js': ['js/components/*.jsx']
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
          'bower_components/react/react-with-addons.js',
          'bower_components/zepto/zepto.js',

          'js/lib/color.js',
          'js/lib/tween.js',

          'js/strict.js',
          'js/classes/Point.js',
          'js/classes/Pixel.js',
          'js/classes/File.js',

          'js/classes/Editor.js',
          'js/classes/Editor.File.js',
          'js/classes/Editor.Frame.js',
          'js/classes/Editor.Layers.js',
          'js/classes/Editor.Pixels.js',
          'js/classes/Editor.Palettes.js',
          'js/classes/Editor.Selection.js',
          'js/classes/Editor.BrightnessTool.js',
          'js/classes/Editor.Zoom.js',
          'js/classes/Editor.Grid.js',
          'js/classes/Editor.Cursor.js',
          'js/classes/Editor.Color.js',
          'js/classes/Editor.Background.js',
          'js/classes/Editor.Tool.js',

          'js/classes/Hotkeys.js',
          'js/classes/Workspace.js',

          'build/js/react-mixins.js',
          'build/js/react-components.js',
          'js/index.js',
        ],
        // the location of the resulting JS file
        dest: 'dist/<%= pkg.name %>.js'
      }
    },


    jshint: {
      dist: ['dist/<%= pkg.name %>.js']
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

    jsdoc : {
      dist : {
        src: ['js/classes/*.js'],
        options: {
          destination: 'doc'
        }
      }
    },
  });


  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-plato');
  grunt.loadNpmTasks('grunt-react');

  grunt.registerTask('default', ['watch']);
  grunt.registerTask('dev', ['less', 'react', 'concat']);
  grunt.registerTask('build', ['less', 'react', 'concat', 'uglify', 'plato', 'jsdoc']);
};