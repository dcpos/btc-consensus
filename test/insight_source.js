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
        describe('utxos()', function() {
            it('returns data for the address', function(done) {
                var s = new source.Insight();
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
        describe('txs()', function () {
            it('returns data for the address', function(done) {
                this.timeout(30000);
                var s = new source.Insight();
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
