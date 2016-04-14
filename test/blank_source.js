var source = require('../src/sources/blank_source.js');
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
                "total_sent_gross",
                "total_sent_net",
                "tx_count",
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
    describe('utxos()', function() {
        it('returns an object', function(done) {
            var s = new source.Blank();
            var testAddr = "any bitcoin addresss";
            var keys = [
                "tx_id",
                "tx_output",
                "amount",
                "confirmations",
            ];
            s.utxos(testAddr, function(err, data) {
                // is a list of utxos
                assert.isAtLeast(data.length, 1);
                var utxo = data[0];
                // has all desired keys
                for (var i=0; i<keys.length; i++) {
                    var key = keys[i];
                    assert.equal(key in utxo, true, "missing key " + key);
                }
                // no additional keys
                for (var key in utxo) {
                    assert.isAbove(keys.indexOf(key), -1, "additional key " + key);
                }
                // oldest utxos first (more confirmations means older utxo)
                var firstUtxo = data[0];
                var lastUtxo = data[data.length-1];
                assert.isTrue(firstUtxo.confirmations > lastUtxo.confirmations);
                done();
            });
        });
    });
});
