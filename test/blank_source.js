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
                "txid",
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
    describe('txs()', function() {
        it('returns an object', function(done) {
            var s = new source.Blank();
            var testAddr = "any bitcoin address";
            s.txs(testAddr, function(err, data) {
                // is a list of tx hashes
                assert.isAtLeast(data.length, 1);
                // oldest tx first (more confirmations means older tx)
                assert.equal(data[0], "oldest_tx_hash");
                assert.equal(data[1], "newest_tx_hash");
                done();
            });
        });
    });
    describe('tx()', function () {
        it('returns an object', function(done) {
            var s = new source.Blank();
            var testTxid = "any tx id";
            var keys = [
                "block_height",
                "block_time",
                "lock_time",
                "txid",
                "fee",
                "inputs",
                "outputs",
            ];
            s.tx(testTxid, function(err, data) {
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
