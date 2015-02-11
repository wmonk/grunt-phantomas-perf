module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('lint', ['jscs', 'jshint']);

    grunt.initConfig({
        mochaTest: {
            src: ['./tests/**/*.js']
        },
        jscs: {
            src: ['./lib/**/*.js', './tasks/*.js', './tests/*.js']
        },
        jshint: {
            src: ['./lib/**/*.js', './tasks/*.js', './tests/*.js'],
            options: {
                jshintrc: true,
                reporter: require('jshint-stylish')
            }
        }
    });
};
