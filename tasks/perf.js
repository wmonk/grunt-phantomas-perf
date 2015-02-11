'use strict';

var Promise = require('bluebird');
var _ = require('lodash');
var extraAverageTests = 2;
var testPage = require('../lib/testPage');

module.exports = function (grunt) {

    grunt.registerMultiTask('perf', function () {
        var done = this.async();
        var options = _.assign({
            urls: [],
            phantomasOptions: {
                timeout: 15
            },
            trials: 1
        }, this.options());

        options.trials = options.trials + extraAverageTests;

        if (options.urls.length === 0) {
            return grunt.fail.fatal('You must specify at least one URL');
        }

        var generated = options.urls.map(function (url) {
            if (_.isObject(url)) {
                return testPage(url.url, options, (url.assertions || options.assertions));
            }

            return testPage(url, options, options.assertions);
        });

        Promise.all(generated)
            .then(function (data) {
                var failedAssertions = data.filter(function (x) { return x; }).length;
                if (failedAssertions !== 0) {
                    return grunt.fail.fatal(failedAssertions, 'of your assertions passed');
                }

                done();
            });
    });
};
