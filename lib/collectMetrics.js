var Promise = require('bluebird');
var phantomas = require('phantomas');
var grunt = require('grunt');

module.exports = function collectMetrics (url, trials, options) {
    var metrics = [];

    function loadPage (fn) {
        phantomas(url, options, function (err, json) {

            trials--;

            if (err) {
                return grunt.fail.fatal(translateErrorNumberToString(err));
            }

            metrics.push(json.metrics);

            if (!trials) {
                return fn(metrics);
            }

            loadPage(fn);
        });
    }

    function translateErrorNumberToString(error) {
        var errorNumber = parseInt(error.toString().replace(/[^0-9]/g,'')),
          string = '';

        switch (errorNumber) {
            case 253:
                string = 'Phantomas configuration is not correct.';
                break;
            case 254:
                string = 'Page could not be loaded.';
                break;
            case 254:
                string = 'Phantomas has failed with an unknown error.';
                break;
            default: {
                string = 'Phantomas has failed with error number ' + errorNumber;
            }

        }

        return string;
    }

    return new Promise(function (res) {
        loadPage(res);
    });
};
