var requireConfigs = require('./public/javascripts/main');

module.exports = function(grunt) {

    var config = {
        pkg: grunt.file.readJSON('package.json'),
        options: {
            deploy: 'deploy/',
            src: 'public/',
            staticUrl: grunt.option('staticUrl') ? grunt.option('staticUrl') : '/'
        },
        // compile .scss/.sass to .css using Compass
        // http://compass-style.org/help/tutorials/configuration-reference/#configuration-properties
        // https://github.com/gruntjs/grunt-contrib-compass
        compass: {
            options: {
                sassDir: 'sass',
                httpImagesPath: '<%= options.staticUrl %>images',
                httpGeneratedImagesPath: '<%= options.staticUrl %>images/generated',
                httpFontsPath: '<%= options.staticUrl %>fonts',
                relativeAssets: false,
                assetCacheBuster: false
            },
            deploy: {
                options: {
                    fontsDir: '<%= options.deploy %>fonts',
                    imagesDir: '<%= options.deploy %>images',
                    cssDir: '<%= options.deploy %>stylesheets',
                    outputStyle: 'compressed',
                    noLineComments: true
                }
            },
            dev: {
                options: {
                    debugInfo: true,
                    cssDir: '<%= options.src %>stylesheets',
                    fontsDir: '<%= options.src %>fonts',
                    imagesDir: '<%= options.src %>images'
                }
            }
        },
        // specifying JSHint options and globals
        // http://jshint.org
        // https://github.com/gruntjs/grunt-contrib-jshint
        jshint: {
            all: [
                'Gruntfile.js',
                '<%= options.src %>javascripts/*.js',
                '<%= options.src %>javascripts/**/*.js',
                //ignore vendor libraries
                '!<%= options.src %>javascripts/vendor/*.js',
                '!<%= options.src %>javascripts/vendor/**/*.js'
            ],
            options: {
                camelcase: true, //force all variable names to either cameCalse or UPPER_CASE
                curly: false, //use curly braces even on one-liners
                eqeqeq: true, //use strict equality (===, !==)
                immed: true, //wrap self-invoking functions in parentheses
                newcap: true, //capitalize first letter of all constructor functions (i.e. new MyObject())
                noarg: true, //prohibit the use of arguments.caller & arguments.callee (which are forbidden in strict mode of es5+)
                sub: true, //supress warnings for using brace syntax instead of dot syntax on objects
                undef: true, //prohibit the use of undeclared variables (spot leaks + globals)
                eqnull: true, //suppress warnings about using "== null"
                browser: true, //define globals exposed by modern browsers
                maxlen: 150, //generously allowing 150 characters per line, try to stick to standard gutter of 80
                globals: {
                    module: true, //commonjs global
                    define: true, //AMD global
                    require: true, //AMD + CommonJS global
                    requirejs: true, // AMD global
                    console: true //turn this to false when supporting real-old browsers
                }
            }
        },
        // compile requirejs files for production
        // http://requirejs.org
        // https://github.com/gruntjs/grunt-contrib-requirejs
        requirejs: {
            compile: {
                options: {
                    baseUrl: '<%= options.src %>javascripts',
                    out: '<%= options.deploy %>javascripts/main.js',
                    preserveLicenseComments: false,
                    name: 'main',
                    include: 'vendor/almond',
                    pragmasOnSave: {},
                    paths: requireConfigs.paths,
                    shim: requireConfigs.shim
                }
            }
        },
        // use the jade template engine to stay DRY
        // http://jade-lang.com
        // https://github.com/gruntjs/grunt-contrib-jade
        jade: {
            //these are any client-side templates you choose to have,
            //they become one AMD module at javascripts/templates.js
            pages: {
                files: {
                    //add every page of the site here:
                    //'<%= options.src %>output-file.html': ['views/input-file.jade']
                    '<%= options.src %>index.html': ['views/index.jade']
                },
                options: {
                    //the data for every template is read from a locals module
                    data: function( dest, src ){
                        var locals = require('./locals');
                        locals.staticUrl = config.options.staticUrl;
                        return locals;
                    }
                }
            },
            deploy: {
                files: {
                    //add every page of the site here:
                    //'<%= options.src %>output-file.html': ['views/input-file.jade']
                    '<%= options.deploy %>index.html': ['views/index.jade']
                },
                options: {
                    //the data for every template is read from a locals module
                    data: function( dest, src ){
                        var locals = require('./locals');
                        locals.staticUrl = config.options.staticUrl;
                        locals.deploy = true;
                        return locals;
                    }
                }
            }
        },
        // start file-servers for your files
        // https://github.com/gruntjs/grunt-contrib-connect
        connect: {
            dev: {
                options: {
                    port: 2000,
                    base: 'public',
                    keepalive: true,
                    hostname: "*"
                }
            },
            deploy: {
                options: {
                    port: 2001,
                    base: 'deploy',
                    keepalive: true
                }
            }
        },
        // watch your files for changes
        // https://github.com/gruntjs/grunt-contrib-watch
        watch: {
            stylesheets: {
                files: [ 'sass/**/*.{scss,sass}' ],
                tasks: 'compass:dev'
            },
            views: {
                files: [ 'views/*' ],
                tasks: [ 'jade:pages' ]
            },
            livereload: {
                //watch the output files, not the pre-processed
                files: ['<%= options.src %>/**/*.css','<%= Object.keys(jade.pages.files) %>'],
                options: {
                    livereload: true
                }
            },
            hint: {
                files: [ '<%= options.src %>javascripts/app/**/*.js' ],
                tasks: 'jshint'
            }
        },

        clean: {
            build: ['<%= options.deploy %>']
        },

        copy: {
            build: {
                expand: true,
                cwd: '<%= options.src %>',
                src: [
                    'images/**',
                    'videos/**',
                    'fonts/**',
                    'audio/**',
                    'favicon.ico',
                    'robots.txt'
                ],
                dest: '<%= options.deploy %>'
            }
        }
    };


    grunt.initConfig(config);

    //load all of the NPM Tasks out of the package.json
    Object.keys(require('./package.json').devDependencies).forEach(function(dep){
        if( dep.match(/grunt-/) ){
            grunt.loadNpmTasks(dep);
        }
    });

    grunt.registerTask('default', ['compass:dev', 'jade:pages' ]);
    grunt.registerTask('build', ['clean', 'copy', 'compass:deploy', 'jade:deploy', 'requirejs']);

};
