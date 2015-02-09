'use strict';

var phantomas = require('phantomas');
var chalk = require('chalk');
var _ = require('lodash');

var errors = {
    253: 'Phantomas configuration is not correct.',
    254: 'URL could not be loaded.',
    255: 'Phantomas has failed with an unknown error.'
};

module.exports = function (grunt) {
    grunt.registerMultiTask('perf', function () {
        var done = this.async();
        var options = _.assign({
            phantomasOptions: {}
        }, this.options());
        var assertFailed = false;

        console.log('');
        grunt.log.ok('Hitting ' + chalk.bold(options.url));
        console.log('');

        phantomas(options.url, options.phantomasOptions, function (err, json) {
            if (err && err !== 252) {
                grunt.fail.fatal(errors[err] || errors[255]);
                return done(err);
            }

            var metrics = json.metrics;

            Object.keys(options.assertions).forEach(function (assertion) {
                if (metrics[assertion] > options.assertions[assertion]) {
                    assertFailed = true;
                    grunt.log.error(chalk.yellow(assertion) + ' failed', metrics[assertion], chalk.gray('>'), options.assertions[assertion]);
                } else {
                    grunt.log.ok(chalk.green(assertion) + ' passed');
                    console.log('  ', chalk.gray('Wanted:'), options.assertions[assertion], chalk.gray('Got:'), metrics[assertion]);
                    console.log('');
                }
            });

            if (assertFailed) {
                grunt.fail.warn('Some of your assertions failed');
            }

            done();
        });
    });
};
