var expect = require('chai').expect;
var createAverages = require('../../lib/createAverages');
var proxyquire = require('proxyquire');

describe('Average module', function () {
    var self;
    var averages;

    beforeEach(function () {
        self = {
            assertionKeys: ['DOMReady']
        };

        averages = [{
            DOMReady: 983,
            requests: 13
        }, {
            DOMReady: 1002,
            requests: 13
        }, {
            DOMReady: 1241,
            requests: 13
        }, {
            DOMReady: 4123,
            requests: 13
        }];
    });

    it('should keep the raw values', function (done) {
        var averaged = createAverages.call(self, averages);

        expect(averaged.DOMReady.raw).to.deep.equal([983, 1002, 1241, 4123]);

        done();
    });

    it('should create an average', function (done) {
        var averaged = createAverages.call(self, averages);

        expect(averaged.DOMReady.average).to.equal(1122);

        done();
    });

    it('should only average specified assertions', function (done) {
        var averaged = createAverages.call(self, averages);

        expect(averaged.requests).to.be.undefined;

        done();
    });

    it('should use olympic averaging', function (done) {
        createAverages = proxyquire('../../lib/createAverages', {
            './olympic': function (nums) {
                done();

                return nums;
            }
        });

        createAverages.call(self, averages);
    });
});
