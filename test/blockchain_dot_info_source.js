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
    describe('utxo()', function() {
        it('returns data for the address', function(done) {
            var s = new source.BlockchainDotInfo();
            // Not great to have to use the internet to test...
            var testAddr = "1BitcoinEaterAddressDontSendf59kuE";
            s.utxos(testAddr, function(err, data) {
                // No error
                assert.equal(err, null);
                // Contains data
                assert.isAtLeast(data.length, 165);
                // Uses satoshis
                assert.isAtLeast(data[0].amount, 1000);
                // Oldest first
                assert.isAbove(data[0].confirmations, data[data.length-1].confirmations);
                done();
            });
        });
    });
    describe('txs()', function () {
        it('returns data for the address', function(done) {
            var s = new source.BlockchainDotInfo();
            // Not great to have to use the internet to test...
            var testAddr = "1BitcoinEaterAddressDontSendf59kuE";
            s.txs(testAddr, function(err, data) {
                // No error
                assert.equal(err, null);
                // Contains data
                assert.isAtLeast(data.length, 202);
                // Oldest is first
                assert.equal(data[0], "369d241af595fc253479abe394e2f21fda05820a0416942f63266dd793035cf1");
                done();
            });
        });
    });
});
