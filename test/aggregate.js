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
        it('retains all values', function() {
            var arrays = [
                [0,1,2],
                [0,1,2],
                [3,4,5],
            ];
            var a = aggregate(arrays);
            assert.isAtLeast(a.indexOf(0), 0);
            assert.isAtLeast(a.indexOf(1), 0);
            assert.isAtLeast(a.indexOf(2), 0);
            assert.isAtLeast(a.indexOf(3), 0);
            assert.isAtLeast(a.indexOf(4), 0);
            assert.isAtLeast(a.indexOf(5), 0);
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
        it('returns an array', function() {
            var arrays = [
                [0],
                [0],
            ];
            var a = aggregate(arrays);
            assert.equal(Object.prototype.toString.call(a), '[object Array]');
        });
        it('combines arrays of objects', function() {
            var arrays = [
                [{x:2,y:1}],
                [{x:1,y:1}],
                [{x:1,y:1}],
            ];
            var a = aggregate(arrays);
            assert.equal(a.length, 2);
            assert.equal(a[0].x, 2);
            assert.equal(a[0].y, 1);
            assert.equal(a[1].x, 1);
            assert.equal(a[1].y, 1);
        });
        it('retains the order for different lengthed arrays', function() {
            var arrays = [
                [0,1,2,3,5,6,7,8,9],
                [0,1,2,3,4,5,6,7,8,9],
            ];
            var a = aggregate(arrays);
            for (var i=0; i<=9; i++) {
                assert.equal(a[i], i);
            }
        });
        it('retains the order for very different lengthed arrays', function() {
            var arrays = [
                [0,9],
                [0,1,2,3,4,5,6,7,8,9],
            ];
            var a = aggregate(arrays);
            for (var i=0; i<=9; i++) {
                assert.equal(a[i], i);
            }
        });
        it('does not understand original ordering conditions', function(done) {
            // ordering of each response is lowest to highest, but the result
            // will not be lowest to highest (in this particular case it will
            // be 0,2,1,3 even though we would expect 0,1,2,3 if the original
            // ordering conditions were known to the aggregator).
            var arrays = [
                [0,1],
                [2,3],
            ];
            var a = aggregate(arrays);
            // expect 0,1,2,3 if ordering method for each response array is
            // used, but with no way to know the ordering algo, there can be no
            // way to order the aggregated response. Hence the aggregate
            // appears 'incorrectly' ordered as 0,2,1,3.
            assert.equal(a.length, 4);
            for (var i=0; i<a.length; i++) {
                if (a[i] != i) {
                    done();
                    return;
                }
            }
            assert.fail('ordering has been magically understood');
        });
    });
});
