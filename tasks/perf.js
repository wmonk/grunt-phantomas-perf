'use strict';

var Promise = require('bluebird');
var phantomas = require('phantomas');
var chalk = require('chalk');
var _ = require('lodash');

var errors = {
    253: 'Phantomas configuration is not correct.',
    254: 'Page could not be loaded.',
    255: 'Phantomas has failed with an unknown error.'
};

function testPage (args) {
    var url = args[0], options = args[1], grunt = args[2];

    return new Promise(function (res, rej) {
        console.log('');
        grunt.log.writeln('Analysing ' + chalk.bold(url));
        console.log('');

        var assertFailed = false;

        phantomas(url, options.phantomasOptionsn, function (err, json) {
            if (err && err !== 252) {
                grunt.fail.fatal(errors[err] || errors[255]);
                return rej(err);
            }

            var metrics = json.metrics;

            Object.keys(options.assertions).forEach(function (assertion) {
                if (metrics[assertion] > options.assertions[assertion]) {
                    assertFailed = true;
                    grunt.log.error(assertion + ' failed');
                    console.log('  ', chalk.gray('Wanted:'), options.assertions[assertion], chalk.gray('Got:'), metrics[assertion]);
                } else {
                    grunt.log.ok(assertion + ' passed');
                    console.log('  ', chalk.gray('Wanted:'), options.assertions[assertion], chalk.gray('Got:'), metrics[assertion]);
                }
            });

            res(!assertFailed);
        })
        .progress(function (progress) {
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            process.stdout.write('Loading page: ' + (progress * 100) + '%');

            if (progress === 1) {
                process.stdout.write('\n\n');
            }
        });
    });
}

module.exports = function (grunt) {
    grunt.registerMultiTask('perf', function () {
        var done = this.async();
        var options = _.assign({
            urls: [],
            phantomasOptions: {}
        }, this.options());

        if (typeof options.url === 'string') {
            options.urls.push(options.url);
        }

        if (options.urls.length === 0) {
            return grunt.fail.fatal('You must specify at least one URL');
        }

        var generated = options.urls.map(function (url) {
            if (_.isObject(url)) {
                return [url.url, {
                    phantomasOptions: options.phantomasOptions,
                    assertions: url.assertions || options.assertions
                }, grunt];
            }

            return [url, options, grunt];
        });

        Promise.map(generated, testPage, { concurrency: 1 })
            .then(function (data) {
                if (data.length !== 0 && data.filter(function (x) { return x; }).length !== data.length) {
                    return grunt.fail.fatal('Some assertions did not pass');
                }

                done();
            });
    });
};
