var source = require('../src/sources/blockr_dot_io.js');
var assert = require('chai').assert;

describe('BlockrDotIo', function() {
    describe('address()', function () {
        it('returns data for the address', function(done) {
            var s = new source.BlockrDotIo();
            // Not great to have to use the internet to test...
            var testAddr = "173MjkFkm1iCYTkW7fBZj5EoPHb5JWhyYJ";
            s.address(testAddr, function(err, data) {
                // No error
                assert.equal(err, null);
                // Contains data
                assert.isAtLeast(data.tx_count, 43);
                // Uses net amounts
                assert.isAtLeast(data.total_received_net, 462477517);
                // Does not use gross amounts
                assert.equal("total_received_gross" in data, false);
                done();
            });
        });
    });
    describe('utxos()', function() {
        it('returns data for the address', function(done) {
            this.timeout(3000); // blockr.io takes 2.29s to serve this
            var s = new source.BlockrDotIo();
            // Not great to have to use the internet to test...
            var testAddr = "1BitcoinEaterAddressDontSendf59kuE";
            s.utxos(testAddr, function(err, data) {
                // No error
                assert.equal(err, null);
                // Contains data
                assert.isAtLeast(data.length, 201);
                // Uses satoshis
                assert.isAtLeast(data[0].amount, 1000);
                // Oldest first
                assert.isAbove(data[0].confirmations, data[data.length-1].confirmations);
                done();
            });
        });
    });
});
