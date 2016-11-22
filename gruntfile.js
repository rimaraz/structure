var fs = require('fs');

module.exports = function (grunt){
	'use strict';

	require('load-grunt-tasks')(grunt);

	// Configurable paths
    var config = {
        app: 'app',
        dist: 'dist'
    };

	grunt.initConfig({
		
		// Project settings
        config: config,

		clean: {
		  folder: ['<%= config.dist %>/*']
		},

		jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
            	'<%= config.app %>/js/own/**/*.js',
            ]
        },

		sass:{
			dist: {
				files : {
					'<%= config.dist %>/css/libraries.css' : '<%= config.app %>/sass/libraries.scss',
					'<%= config.dist %>/css/styles.css' : '<%= config.app %>/sass/styles.scss'
				}
			}
		},

		concat: {
			js: {
				files: {
					'<%= config.dist %>/js/libraries.js' : [
						'<%= config.app %>/js/vendor/jquery/jquery-1.11.1.min.js',
						'<%= config.app %>/js/vendor/bootstrap/bootstrap.min.js'
					],
					'<%= config.dist %>/js/script.js' : [
						'<%= config.app %>/js/own/**/*.js'
					]
				}
			}
		},

		uglify: {
			dist: {
				files : {
					'<%= config.dist %>/js/main.min.js' : [
						'<%= config.dist %>/js/libraries.js',
						'<%= config.dist %>/js/script.js'
					]
				}
			}
		},

		cssmin: {
			dist: {
				files : {
					'<%= config.dist %>/css/styles.min.css' : 'dist/css/**/*.css'
				}
			}
		},

		compass: {
            dev: {
                options: {
                    noLineComments: false,
					sassDir: '<%= config.app %>/sass',
					cssDir: '<%= config.dist %>/css'
                }
            }
        },
        handlebarslayouts: {
			dev: {
				files: {
					'<%= config.dist %>/*.html': '<%= config.app %>/views/pages/*.html'
				},
				options: {
					partials: ['<%= config.app %>/views/partials/**/*.html', '<%= config.app %>/views/templates/layout.html'],
					basePath: '<%= config.app %>/views',
					context: {
						title: 'Layout Test',
						projectName: 'Grunt handlebars layout',
						items: [
							'apple',
							'orange',
							'banana'
						]
					}
				}
			}
		},
		copy: {
            fonts:{
            	expand: true,
                dot: true,
                cwd: '<%= config.app %>/fonts/',
                dest: '<%= config.dist %>/fonts/',
                src: '**'
            },
            images: {
                expand: true,
                dot: true,
                cwd: '<%= config.app %>/img/',
                dest: '<%= config.dist %>/img/',
                src: '**'
            },
            videos: {
                expand: true,
                dot: true,
                cwd: '<%= config.app %>/video/',
                dest: '<%= config.dist %>/video/',
                src: '**'
            }
		},
		connect: {
            server: {
                options: {
                	hossname: 'localhost',
                	port: 3000,
                    base: '<%= config.dist %>/',
                    livereload: true,
                    open: true
                }
            }
        },
		watch: {
			options:{
				livereload: true,
				dateFormat: function(time){
					grunt.log.writeln('Waiting for more change..');
				}
			},
		   	js: {
                files: ['<%= config.app %>/js/**/*.js'],
                tasks: ['js:all']
            },
           	css: {
                files: '<%= config.app %>/sass/**/*.{scss,sass,css}',
                tasks: ['css:all']
            },
            copy: {
                files: ['<%= config.app %>/img/**','<%= config.app %>/fonts/**','<%= config.app %>/videos/**'],
                tasks: ['copy:all']
            },
            layout: {
		       	files: '<%= config.app %>/views/templates/layout.html',
		        tasks: 'handlebarslayouts:dev'
		    },
		    hsb: {
		        files: '<%= config.app %>/views/**/*.html',
		        tasks: 'handlebarslayouts:dev'
		    }
		}
	});


	grunt.registerTask('css:build', ['sass']);
    grunt.registerTask('css:optimize', ['cssmin']);
    grunt.registerTask('css:all', ['css:build', 'css:optimize','compass:dev']);
    grunt.registerTask('js:build', ['jshint', 'concat:js']);
    grunt.registerTask('js:optimize', ['uglify']);
    grunt.registerTask('js:all', ['js:build', 'js:optimize']);
    grunt.registerTask('copy:all', ['copy:fonts','copy:images','copy:videos']);

	grunt.registerTask('default',['clean','js:all','css:all','copy','handlebarslayouts','connect', 'watch']);
}