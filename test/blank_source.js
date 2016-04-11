var source = require('../src/blank_source.js');
var assert = require('chai').assert;

describe('BlankSource', function() {
    describe('address()', function () {
        it('returns an object', function(done) {
            var s = new source.Blank();
            var testAddr = "any bitcoin addresss";
            var keys = [
                "address",
                "balance",
                "balance_confirmed",
                "balance_unconfirmed",
                "is_valid",
                "total_received_gross",
                "total_received_net",
                "total_sent",
                "tx_count",
                "txs",
                "utxos",
            ];
            s.address(testAddr, function(err, data) {
                // has all desired keys
                for (var i=0; i<keys.length; i++) {
                    var key = keys[i];
                    assert.equal(key in data, true, "missing key " + key);
                }
                // no additional keys
                for (var key in data) {
                    assert.isAbove(keys.indexOf(key), -1, "additional key " + key);
                }
                done();
            });
        });
    });
});
