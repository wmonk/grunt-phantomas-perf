var _ = require('lodash');

module.exports = function olympic(values) {
    var results = _.clone(values);
    var max, min;

    // Find and remove the maximum.
    max = Math.max.apply(null, results);
    results.splice(results.indexOf(max), 1);

    // Find and remove the minimum.
    min = Math.min.apply(null, results);
    results.splice(results.indexOf(min), 1);

    return results;
};
