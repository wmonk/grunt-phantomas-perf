var expect = require('chai').expect;
var proxyquire = require('proxyquire');

describe('Collect Metrics module', function () {
    it('should use the correct URL in phantomas', function (done) {
        var collectMetrics = proxyquire('../../lib/collectMetrics', {
            phantomas: function (url) {
                expect(url).to.equal('http://laterooms.com');

                done();
            }
        });

        collectMetrics('http://laterooms.com');
    });

    it('should collect metrics for the specified amount of trials', function (done) {
        var called = 0;
        var collectMetrics = proxyquire('../../lib/collectMetrics', {
            phantomas: function (url, options, cb) {
                called++;

                cb(null, {
                    metrics: {}
                });
            }
        });

        collectMetrics('http://laterooms.com', 10)
            .then(function () {
                expect(called).to.equal(10);

                done();
            })
            .catch(done);
    });

    it('should resolve the collected metrics', function (done) {
        var collectMetrics = proxyquire('../../lib/collectMetrics', {
            phantomas: function (url, options, cb) {
                cb(null, {
                    metrics: {
                        requests: 100
                    }
                });
            }
        });

        collectMetrics('http://laterooms.com', 3)
            .then(function (data) {
                expect(data).to.deep.equal([{
                    requests: 100
                }, {
                    requests: 100
                }, {
                    requests: 100
                }]);

                done();
            })
            .catch(done);
    });
});
