var btc = require('../src/blockchain');
var assert = require('chai').assert;
var expect = require('chai').expect;

describe('Blockchain', function() {
    describe('construction', function () {
        context('with no sources parameter', function() {
            it('should throw an error', function () {
                expect(function() {
                    new btc.Blockchain();
                }).to.throw();
            });
        });
        context('with empty sources parameter', function() {
            it('should throw an error', function () {
                expect(function() {
                    var sources = [];
                    new btc.Blockchain(sources);
                }).to.throw();
            });
        });
    });

    describe('address', function() {
        b = new btc.Blockchain([
            new btc.Sources.Blank(),
            new btc.Sources.Blank(),
        ]);
        it("returns a aggregated result", function() {
            var addr = "any address";
            b.address(addr, function(err, data) {
                assert.equal(err, null);
                assert.equal(data.address, addr);
                assert.equal(data.tx_count, 0);
            });
        });
    });
});

describe('Source creation', function() {
    describe('blank source', function() {
        it('can be created', function() {
            expect(function() {
                new btc.Sources.Blank();
            }).to.not.throw();
        });
    });
    describe('blockchain_dot_info source', function() {
        it('can be created', function() {
            expect(function() {
                new btc.Sources.BlockchainDotInfo();
            }).to.not.throw();
        });
    });
    describe('blockr_dot_io source', function() {
        it('can be created', function() {
            expect(function() {
                new btc.Sources.BlockrDotIo();
            }).to.not.throw();
        });
    });
    describe('insight source', function() {
        it('can be created', function() {
            expect(function() {
                new btc.Sources.Insight();
            }).to.not.throw();
        });
    });
});
