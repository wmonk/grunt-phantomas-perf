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

function olympic(values) {
    var results = values;
    var max, min;

    // Find and remove the maximum.
    max = Math.max.apply(null, results);
    results.splice(results.indexOf(max), 1);

    // Find and remove the minimum.
    min = Math.min.apply(null, results);
    results.splice(results.indexOf(min), 1);

    return results;
}

function createAverage(aggregate) {
    var vals = (aggregate.length) || 1;
    var average = {};

    Object.keys(aggregate[0]).forEach(function (metric) {
        average[metric] = [];

        for (var i = 0; i < vals; i++) {
            average[metric].push(aggregate[i][metric]);
        }

        average[metric] = olympic(average[metric]);

        average[metric] = average[metric].reduce(function (total, num) {
            return total + num;
        });

        average[metric] = Math.round(average[metric] / (vals - 2));
    });

    return average;
}

function testPage(args) {
    var url = args[0],
        assertions = args[1].assertions,
        trials = args[1].trials,
        options = args[1].phantomasOptions,
        grunt = args[2];

    return new Promise(function (res) {
        console.log('');
        grunt.log.writeln('Analysing ' + chalk.bold(url));

        var assertFailed = false;
        var trial = 0;

        Promise.map(_.range(trials), function () {
            return new Promise(function (res, rej) {
                trial++;
                phantomas(url, options, function (err, json) {
                    if (err && err !== 252) {
                        grunt.fail.fatal(errors[err] || errors[255]);
                        return rej(err);
                    }

                    if (err === 252) {
                        grunt.log.error('Your page did not finish doing things in less than ' + options.timeout + ' seconds');
                    }

                    res(json.metrics);
                }).progress(function (progress) {
                    var percent = Math.floor(((progress / trials) * 100) + ((100 / trials) * (trial - 1)));
                    process.stdout.clearLine();
                    process.stdout.cursorTo(0);
                    process.stdout.write('Loading page: ' + percent + '%');
                });
            });
        }, { concurrency: 1 })
            .then(createAverage)
            .then(function (metrics) {
                console.log('\n');
                Object.keys(assertions).forEach(function (assertion) {
                    if (metrics[assertion] > assertions[assertion]) {
                        assertFailed = true;
                        grunt.log.error(assertion + ' failed');
                        console.log('  ', chalk.gray('Wanted:'), assertions[assertion], chalk.gray('Got:'), metrics[assertion]);
                    } else {
                        grunt.log.ok(assertion + ' passed');
                        console.log('  ', chalk.gray('Wanted:'), assertions[assertion], chalk.gray('Got:'), metrics[assertion]);
                    }
                });

                res(!assertFailed);
            });
    });
}

module.exports = function (grunt) {
    grunt.registerMultiTask('perf', function () {
        var done = this.async();
        var options = _.assign({
            urls: [],
            phantomasOptions: {
                timeout: 10
            },
            trials: 1
        }, this.options());

        options.trials = options.trials + 2;

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

        Promise.map(generated, testPage, {
            concurrency: 1
        })
        .then(function (data) {
            if (data.length !== 0 && data.filter(function (x) {
                return x;
            }).length !== data.length) {
                return grunt.fail.fatal('Some assertions did not pass');
            }

            done();
        });
    });
};
