var source = require('../src/sources/insight.js');
var assert = require('chai').assert;

describe('Insight', function() {
    context('with default root', function() {
        describe('address()', function () {
            it('returns data for the address', function(done) {
                var s = new source.Insight();
                // Not great to have to use the internet to test...
                var testAddr = "173MjkFkm1iCYTkW7fBZj5EoPHb5JWhyYJ";
                s.address(testAddr, function(err, data) {
                    // No error
                    assert.equal(err, null);
                    // Contains data
                    assert.isAtLeast(data.tx_count, 43);
                    // Uses gross amounts
                    assert.isAtLeast(data.total_received_gross, 835757472);
                    assert.isAtLeast(data.total_sent_gross, 835757472);
                    // Does not use net amounts
                    assert.equal("total_received_net" in data, false);
                    assert.equal("total_sent_net" in data, false);
                    done();
                });
            });
        });
    });
    context('with custom root', function() {
        it('returns data', function(done) {
            var blockExplorer = "https://blockexplorer.com";
            var s = new source.Insight(blockExplorer);
            // Not great to have to use the internet to test...
            var testAddr = "173MjkFkm1iCYTkW7fBZj5EoPHb5JWhyYJ";
            s.address(testAddr, function(err, data) {
                // No error
                assert.equal(err, null);
                // Contains data
                assert.isAtLeast(data.tx_count, 43);
                done();
            });
        });
    });
});
