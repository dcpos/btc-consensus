var source = require('../src/sources/blockchain_dot_info.js');
var assert = require('chai').assert;

describe('BlockchainDotInfo', function() {
    describe('address()', function () {
        it('returns data for the address', function(done) {
            var s = new source.BlockchainDotInfo();
            // Not great to have to use the internet to test...
            var testAddr = "173MjkFkm1iCYTkW7fBZj5EoPHb5JWhyYJ";
            s.address(testAddr, function(err, data) {
                // No error
                assert.equal(err, null);
                // Contains data
                assert.isAtLeast(data.tx_count, 43);
                // Uses net amounts
                assert.isAtLeast(data.total_received_net, 462477517);
                assert.isAtLeast(data.total_sent_net, 462477517);
                // Does not use gross amounts
                assert.equal("total_received_gross" in data, false);
                assert.equal("total_sent_gross" in data, false);
                done();
            });
        });
    });
});
