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
});
