var expect = require('chai').expect;
var olympic = require('../../lib/olympic');

describe('Olympic module', function () {
    it('should remove the highest and lowest values', function (done) {
        var vals = olympic([1000, 33, 500, 523]);
        expect(vals).to.deep.equal([500, 523]);

        done();
    });
});
