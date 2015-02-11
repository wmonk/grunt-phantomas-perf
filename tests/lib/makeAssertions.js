var expect = require('chai').expect;
var proxyquire = require('proxyquire');

describe('Make Assertions module', function () {
    var self;

    beforeEach(function () {
        self = {
            assertions: {
                requests: 1313
            }
        };
    });

    it('should log ok to grunt if the assertion passes', function (done) {
        var makeAssertions = proxyquire('../../lib/makeAssertions', {
            grunt: {
                log: {
                    ok: function () {
                        done();
                    },
                    writeln: function () {}
                }
            }
        });

        makeAssertions.call(self, {
            requests: {
                average: 500,
                raw: []
            }
        });
    });

    it('should log error to grunt if the assertion passes', function (done) {
        var makeAssertions = proxyquire('../../lib/makeAssertions', {
            grunt: {
                log: {
                    error: function () {
                        done();
                    },
                    writeln: function () {}
                }
            }
        });

        makeAssertions.call(self, {
            requests: {
                average: 5000,
                raw: []
            }
        });
    });

    it('should return false if the assertions pass', function (done) {
        var makeAssertions = proxyquire('../../lib/makeAssertions', {
            grunt: {
                log: {
                    ok: function () {},
                    writeln: function () {}
                }
            }
        });

        var failed = makeAssertions.call(self, {
            requests: {
                average: 100,
                raw: []
            }
        });

        expect(failed).to.be.false;
        done();
    });

    it('should return true if the assertions fail', function (done) {
        var makeAssertions = proxyquire('../../lib/makeAssertions', {
            grunt: {
                log: {
                    error: function () {},
                    writeln: function () {}
                }
            }
        });

        var failed = makeAssertions.call(self, {
            requests: {
                average: 10000,
                raw: []
            }
        });

        expect(failed).to.be.true;
        done();
    });
});
