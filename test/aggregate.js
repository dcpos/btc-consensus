var aggregate = require("../src/blockchain.js").aggregate;
var assert = require('chai').assert;

describe("aggregate", function() {
    describe('objects', function() {
        it('combines keys to most common value', function() {
            var objects = [
                { x: 1, },
                { x: 1, },
                { x: 2, },
            ];
            var a = aggregate(objects);
            assert.equal(a.x, 1);
        });
        it('is indifferent to ordering', function() {
            var objects = [
                { x: 2, },
                { x: 1, },
                { x: 1, },
            ];
            var a = aggregate(objects);
            assert.equal(a.x, 1);
        });
        it('retains different keys', function() {
            var objects = [
                { x: 1, },
                { y: "a", },
            ];
            var a = aggregate(objects);
            assert.equal(a.x, 1);
            assert.equal(a.y, "a");
        });
        it('uses the first value for equally common values', function() {
            var objects = [
                { x: 1, },
                { x: 2, },
            ];
            var a = aggregate(objects);
            assert.equal(a.x, 1);
        });
        it('combines arrays', function() {
            var objects = [
                { x: [2], },
                { x: [1], },
                { x: [1], },
            ];
            var a = aggregate(objects);
            assert.equal(a.x[0], 1);
        });
        it('combines objects', function() {
            var objects = [
                { x: {b:2}, },
                { x: {a:1}, },
                { x: {a:1}, },
            ];
            var a = aggregate(objects);
            assert.equal(a.x["a"], 1);
        });
        it('returns an object', function() {
            var objects = [
                { x: 1, },
                { x: 1, },
            ];
            var a = aggregate(objects);
            assert.equal(Object.prototype.toString.call(a), '[object Object]');
        });
    });
    describe('arrays', function() {
        it('combines indexes to most common value', function() {
            var arrays = [
                [0,1,2],
                [0,1,2],
                [3,4,5],
            ];
            var a = aggregate(arrays);
            assert.equal(a[0], 0);
            assert.equal(a[1], 1);
            assert.equal(a[2], 2);
        });
        it('handles arrays of different lengths', function() {
            var arrays = [
                [0,1],
                [0,1,2],
            ];
            var a = aggregate(arrays);
            assert.equal(a[0], 0);
            assert.equal(a[1], 1);
            assert.equal(a[2], 2);
        });
        it('uses the first value for equally common values', function() {
            var arrays = [
                [0],
                [1],
            ];
            var a = aggregate(arrays);
            assert.equal(a[0], 0);
        });
        it('returns an array', function() {
            var arrays = [
                [0],
                [0],
            ];
            var a = aggregate(arrays);
            assert.equal(Object.prototype.toString.call(a), '[object Array]');
        });
        it('treats each index individually', function() {
            var arrays = [
                [1,3],
                [0,1,5],
                [1,2],
                [4,3,2],
            ];
            var a = aggregate(arrays);
            assert.equal(a[0], 1);
            assert.equal(a[1], 3);
            assert.equal(a[2], 5);
        });
        it('combines arrays of objects', function() {
            var arrays = [
                [{x:2}],
                [{x:1}],
                [{x:1}],
            ];
            var a = aggregate(arrays);
            assert.equal(a[0].x, 1);
        });
    });
});
