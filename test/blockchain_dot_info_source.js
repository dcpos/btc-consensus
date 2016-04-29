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
    describe('tx()', function () {
        it('returns data for the txid', function(done) {
            var s = new source.BlockchainDotInfo();
            // Not great to have to use the internet to test...
            var testTxid = "764ca541aa1027e4dfb68d296c3e7f94dc679b434920d193ba36e2da25363dc3";
            s.tx(testTxid, function(err, data) {
                // No error
                assert.equal(err, null);
                // Contains data
                assert.equal(data.block_height, 409351);
                assert.equal(data.lock_time, 409339);
                assert.equal(data.tx_id, testTxid);
                assert.equal(data.fee, 50000);
                assert.equal(data.inputs.length, 1);
                assert.equal(data.outputs.length, 2);
                // Does not contain some data
                assert.isFalse("block_time" in data);
                done();
            });
        });
    });
});
