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
        describe('tx()', function () {
            it('returns data for the txid', function(done) {
                var s = new source.Insight();
                // Not great to have to use the internet to test...
                var testTxid = "764ca541aa1027e4dfb68d296c3e7f94dc679b434920d193ba36e2da25363dc3";
                s.tx(testTxid, function(err, data) {
                    // No error
                    assert.equal(err, null);
                    // Contains data
                    assert.equal(data.block_time, 1461898842);
                    assert.equal(data.lock_time, 409339);
                    assert.equal(data.tx_id, testTxid);
                    assert.equal(data.fee, 50000);
                    // Inputs
                    assert.equal(data.inputs.length, 1);
                    assert.equal(data.inputs[0].address, "1NuujRCgZQ5SK3MdXzyPobiNTEAY9GfR7e");
                    assert.equal(data.inputs[0].txid, "557ef753bf6bcf311960aea05f3f6bd7b763fca7b8274b5c0ca89b784f7a9c76");
                    assert.equal(data.inputs[0].amount, 17008201487);
                    assert.equal(data.inputs[0].tx_output, 1);
                    // Outputs
                    assert.equal(data.outputs.length, 2);
                    assert.equal(data.outputs[0].address, "1BRtJ4oem96XnMC6a4iDHmG5Dfizn5ZSuF");
                    assert.equal(data.outputs[0].amount, 16558713487);
                    assert.equal(data.outputs[1].address, "3Qtod6NVjSsK873mSA7HVGv3F1M7N22VhE");
                    assert.equal(data.outputs[1].amount, 449438000);
                    // Does not contain some data
                    assert.isFalse("block_height" in data);
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
