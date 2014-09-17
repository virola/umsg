module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks("grunt-extend-config");

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            }
        }
    });

    
    grunt.extendConfig({
        'watch': {
            'page': {
                files: [
                    'src/**/*'
                ],
                'tasks': ['page']
            }
        },
        'less': {
            'page': {
                files: {
                    'asset/css/main.css': 'src/css/main.less'
                }
            }
        },
        'cssmin': {
            'page': {
                files: {
                    'asset/css/page.css': 'asset/css/page.css'
                }
            }
        },
        'concat': {
            'page': {
                files: {
                    'asset/js/main.js': [
                        'src/js/common.js'
                    ]
                }
            }
        },
        'uglify': {
            'options': {
                'mangle': {
                    'except': ['require', 'define', 'export']
                }
            },
            'page': {
                files: {
                    'asset/js/main.js': ['asset/js/main.js']
                }
            }
        },
        'clean': {
            'page': [
                'asset/js/main.js',
                'asset/css/main.css'
            ]
        }
    });


    // 通用模块 
    grunt.registerTask('page', [
        'less:page',
        'concat:page'
    ]);

    grunt.registerTask('page-release', [
        'less:page',
        'concat:page',
        'uglify:page'
    ]);

    grunt.registerTask('default', 'Log some stuff.', function() {
        grunt.log.write('Logging some stuff...').ok();
    });


};