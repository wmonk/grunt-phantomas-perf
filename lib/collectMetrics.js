var Promise = require('bluebird');
var phantomas = require('phantomas');
var grunt = require('grunt');
var errors = {
    253: 'Phantomas configuration is not correct.',
    254: 'Page could not be loaded.',
    255: 'Phantomas has failed with an unknown error.'
};

module.exports = function collectMetrics (url, trials, options) {
    var metrics = [];

    function loadPage (fn) {
        phantomas(url, options, function (err, json) {
            trials--;

            if (errors[err]) {
                return grunt.fatal.fail(errors[err]);
            }

            metrics.push(json.metrics);

            if (!trials) {
                return fn(metrics);
            }

            loadPage(fn);
        });
    }

    return new Promise(function (res) {
        loadPage(res);
    });
};
