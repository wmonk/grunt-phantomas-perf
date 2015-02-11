var olympic = require('./olympic');

module.exports = function createAverages (aggregate) {
    var vals = aggregate.length;
    var average = {};

    this.assertionKeys.forEach(function (assertionKey) {
        var assert = average[assertionKey] = {
            raw: []
        };

        for (var i = 0; i < vals; i++) {
            assert.raw.push(aggregate[i][assertionKey]);
        }

        var averaged = olympic(assert.raw).reduce(function (total, num) {
            return total + num;
        });

        assert.average = Math.round(averaged / (vals - 2));
    });

    return average;
};
