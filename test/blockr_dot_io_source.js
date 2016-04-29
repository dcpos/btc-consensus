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
    describe('txs()', function () {
        it('returns data for the address', function(done) {
            var s = new source.BlockrDotIo();
            // Not great to have to use the internet to test...
            var testAddr = "1BitcoinEaterAddressDontSendf59kuE";
            s.txs(testAddr, function(err, data) {
                // No error
                assert.equal(err, null);
                // Contains data
                assert.isAtLeast(data.length, 200); // Limit of 200
                // Oldest is first
                var older = "d4117e9b8212c2316fe3305c65434117ad3317251213736d1c8039600e321c03";
                var olderIndex = data.indexOf(older);
                var newer = "83a23fcf32c5f4d65d707890c52a7807bdae0d7573b2348d6df25773ba4a4a87";
                var newerIndex = data.indexOf(newer);
                // This pair of txs may no longer be in the list if more than
                // 200 transactions have been made since this test was written.
                // If so, log a warning.
                if (olderIndex > -1) {
                    assert.isBelow(olderIndex, newerIndex);
                }
                else {
                    console.warn("\033[31m  *** Update txids in BlockrDotIo.txs() test *** \033[91m");
                }
                done();
            });
        });
    });
    describe('tx()', function () {
        it('returns data for the txid', function(done) {
            var s = new source.BlockrDotIo();
            // Not great to have to use the internet to test...
            var testTxid = "764ca541aa1027e4dfb68d296c3e7f94dc679b434920d193ba36e2da25363dc3";
            s.tx(testTxid, function(err, data) {
                // No error
                assert.equal(err, null);
                // Contains data
                assert.equal(data.block_height, 409351);
                assert.equal(data.block_time, 1461898842);
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
                assert.isFalse("lock_time" in data);
                done();
            });
        });
    });
});
