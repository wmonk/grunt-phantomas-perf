var collectMetrics = require('./collectMetrics');
var createAverages = require('./createAverages');
var makeAssertions = require('./makeAssertions');

module.exports = function testPage(url, options, assertions) {
    this.url = url;
    this.assertions = assertions;
    this.assertionKeys = Object.keys(assertions);
    this.assertFailed = false;

    return collectMetrics(url, options.trials, options.phantomasOptions)
        .bind(this)
        .then(createAverages)
        .then(makeAssertions);
};
