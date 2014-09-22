module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    /** Copy various files to build/tmp directory */
    copy: {
      fonts: {
        cwd: 'src/fonts',
        src: [ '**' ],
        dest: 'build/tmp/fonts',
        expand: true
      },
      bower: {
        cwd: 'bower_components',
        src: [
          'conduitjs/lib/conduit.js',
          'lodash/dist/lodash.js',
          'postal.js/lib/postal.js',
          'mousetrap/mousetrap.js',
          'react/react-with-addons.js',
          'zepto/zepto.js',
          //'underscore/underscore.js',
        ],
        dest: 'build/tmp/js/bower_components/',
        expand: true,
        flatten: true,
      },
      debug: {
        src: 'bower_components/postal.diagnostics/src/postal.diagnostics.js',
        dest: 'build/tmp/js/bower_components/postaldiagnostics.js',
      },
      scripts: {
        cwd: 'src/js',
        src: [ '**' ],
        dest: 'build/tmp/js',
        expand: true
      },
      html: {
        src: 'src/html/browser.html',
        dest: 'build/tmp/index.html'
      },

      mocks: {
        cwd: 'src/mock',
        src: [ '**' ],
        dest: 'build/tmp/mock',
        expand: true
      },
    },


    /** Javascript */
    // compile JSX sources
    react: {
      components: {
        files: [{
          expand: true,
          cwd: 'src/jsx',
          src: ['*.jsx'],
          dest: 'build/tmp/js/react_components',
          ext: '.js'
        }]
      },
    },




    /** Stylesheets */

    // compile LESS sources
    less: {
      development: {
        files: {
          // target.css file: source.less file
          "build/tmp/<%= pkg.name %>.css": "src/less/app.less"
        }
      },
    },

    // add necessary vendor prefixes to the generated CSS
    autoprefixer: {
      build: {
        expand: true,
        cwd: 'build/tmp',
        src: [ '**/*.css' ],
        dest: 'build/tmp'
      }
    },



    /*
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
    */

    concat: {
      options: {
        separator: "\n", //add a new line after each file
        banner: "", //added before everything
        footer: "" //added after everything
      },
      javascript: {
        src: [
          'build/tmp/js/bower_components/*.js',
          'build/tmp/js/lib/**/*.js',

          'build/tmp/js/strict.js',
          'build/tmp/js/react_mixins/**/*.js',
          'build/tmp/js/react_components/**/*.js',

          'build/tmp/js/classes/Point.js',
          'build/tmp/js/classes/Pixel.js',
          'build/tmp/js/classes/File.js',

          'build/tmp/js/classes/Editor.js',
          'build/tmp/js/classes/Editor.File.js',
          'build/tmp/js/classes/Editor.Frame.js',
          'build/tmp/js/classes/Editor.Layers.js',
          'build/tmp/js/classes/Editor.Pixels.js',
          'build/tmp/js/classes/Editor.Palettes.js',
          'build/tmp/js/classes/Editor.Selection.js',
          'build/tmp/js/classes/Editor.BrightnessTool.js',
          'build/tmp/js/classes/Editor.Zoom.js',
          'build/tmp/js/classes/Editor.Grid.js',
          'build/tmp/js/classes/Editor.Cursor.js',
          'build/tmp/js/classes/Editor.Color.js',
          'build/tmp/js/classes/Editor.Background.js',
          'build/tmp/js/classes/Editor.Tool.js',

          'build/tmp/js/classes/Hotkeys.js',
          'build/tmp/js/classes/Workspace.js',
          'build/tmp/js/index.js',
        ],
        // the location of the resulting JS file
        dest: 'build/tmp/<%= pkg.name %>.js'
      }
    },

    /*
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
    */


    /** Other tasks */

    replace: {
      build: {
        options: {
          patterns: [
            { match: 'app', replacement: '<%= pkg.name %>' },
            { match: 'version', replacement: '<%= pkg.version %>' },
            { match: 'author', replacement: '<%= pkg.author %>' }
          ]
        },
        files: [{
          expand: true,
          cwd: 'build/tmp',
          src: [ '**/*' ],
          dest: 'build/tmp'
        }]
      }
    },

    /*
    watch: {
      styles: {
        // Which files to watch (all .less files recursively in the less directory)
        files: ['less/** /*.less'],
        tasks: ['less:development'],
      },
      react: {
        files: ['js/** /*.jsx'],
        tasks: ['react']
      },
      scripts: {
        files: ['js/** /*.js'],
        tasks: ['concat']
      },
      livereload: {
        // Here we watch the files the less task will compile to
        // These files are sent to the live reload server after less compiles to them
        options: { livereload: true },
        files: ['dist/** /*'],
      },
    },

    plato: {
      report: {
        files: {
          'report': ['js/** /*.js', 'js/** /*.jsx']
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
    */

    clean: {
      tmp: {
        src: 'build/tmp'
      },
      js: {
        src: 'build/tmp/js'
      },
      build: {
        src: 'build/**/*'
      },
      dist: {
        src: 'dist/**/*'
      },
      all: {
        src: ['build/**/*', 'dist/**/*']
      }
    },

  });

  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');;
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-plato');
  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-replace');

  var baseTasks = ['copy', 'react', 'replace', 'concat', 'less', 'autoprefixer', 'clean:js' ];

  grunt.registerTask('default', baseTasks);

  grunt.registerTask('tmp', ['copy', 'react', 'replace', 'concat', 'less', 'autoprefixer']);

  //grunt.registerTask('build', ['copy', 'react', 'less', 'autoprefixer', 'replace']);
   //  'concat', 'uglify', 'plato', 'jsdoc']);
};