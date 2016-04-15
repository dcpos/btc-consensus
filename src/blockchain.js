module.exports.Blockchain = function(sources, options) {

    if (!sources || !sources.length) {
        throw ("new Blockchain requires sources input parameter");
    }

    this.address = function(addr, handler) {
        var responses = [];
        // Get address data from each source
        for (var i=0; i<sources.length; i++) {
            (function(index) {
                var source = sources[index];
                source.address(addr, function(err, data) {
                    // Handle error if it exists
                    if (err) {
                        responses[index] = {}; // result is in but is meaningless
                    }
                    else {
                        responses[index] = data; // cache this result
                    }
                    // See if ready to aggregate responses
                    for (var j=0; j<responses.length; j++) {
                        if (typeof responses[j] == "undefined") {
                            // Not ready to aggregate
                            return;
                        }
                    }
                    // Aggregate the responses
                    var response = aggregate(responses);
                    handler(null, response);
                });
            })(i);
        }
    }

    this.utxos = function(addr, handler) {
        var responses = [];
        // Get utxo data from each source
        for (var i=0; i<sources.length; i++) {
            (function(index) {
                var source = sources[index];
                source.utxos(addr, function(err, data) {
                    // Handle error if it exists
                    if (err) {
                        responses[index] = {}; // result is in but is meaningless
                    }
                    else {
                        responses[index] = data; // cache this result
                    }
                    // See if ready to aggregate responses
                    for (var j=0; j<responses.length; j++) {
                        if (typeof responses[j] == "undefined") {
                            // Not ready to aggregate
                            return;
                        }
                    }
                    // Aggregate the responses
                    var response = aggregate(responses);
                    handler(null, response);
                });
            })(i);
        }
    }

}

// Collapse multiple responses into a single response.
function aggregate(responses) {
    var firstResponse = responses[0];
    if (isArray(firstResponse)) {
        return aggregateArrays(responses);
    }
    else {
        return aggregateObjects(responses);
    }
}
module.exports.aggregate = aggregate; // ugly, but exporting aids testing

// Aggregates a number of objects into a single object with the most common
// value for each key.
function aggregateObjects(responses) {
    // Group all values for different keys together
    var collated = {};
    for (var i=0; i<responses.length; i++) {
        var response = responses[i];
        for (var key in response) {
            if (!(key in collated)) {
                collated[key] = [];
            }
            var value = response[key];
            collated[key].push(value);
        }
    }
    // For each key's group of values, use the mode
    var modes = {};
    for (var key in collated) {
        var values = collated[key];
        var value = statisticalMode(values);
        modes[key] = value;
    }
    return modes;
}

// Deduplicates array items whilst retaining the correct order
function aggregateArrays(responses) {
    var values = [];
    // Attempt to retain correct ordering by starting with longest response
    responses.sort(function(a, b) {
        return a.length < b.length; // longest first
    });
    // Track entries to avoid duplicates
    var deduped = {};
    var longestResponse = responses[0];
    for (var i=0; i<longestResponse.length; i++) {
        // Store this value
        var value = longestResponse[i];
        if (!(value in deduped)) {
            values.push(value);
            deduped[value] = true;
        }
        // Work out how far through processing we've gone
        var progress = i / (longestResponse.length-1);
        // Store the equivalent value from every other response. This is
        // calculated by going 'equally far along' the array compared to our
        // progress along the longest response.
        for (var j=1; j<responses.length; j++) {
            var otherResponse = responses[j];
            var otherResponseProgress = progress * (otherResponse.length-1);
            var otherResponseIndex = Math.round(otherResponseProgress);
            var value = otherResponse[otherResponseIndex];
            if (!(value in deduped)) {
                values.push(value);
                deduped[value] = true;
            }
        }
    }
    return values;
}

function isArray(val) {
    return Object.prototype.toString.call(val) === '[object Array]';
}

function statisticalMode(values) {
    // multimodal values are handled by using the first instance
    // eg [1,2] returns 1 as the mode
    var valCounts = {};
    var commonestVal = null;
    var commonestValCount = 0;
    // Count instances of each value
    for (var i=0; i<values.length; i++) {
        var value = values[i];
        if (!(value in valCounts)) {
            valCounts[value] = 0;
        }
        valCounts[value]++;
        // Track most common value
        if (valCounts[value] > commonestValCount) {
            commonestValCount = valCounts[value];
            commonestVal = value;
        }
    }
    return commonestVal;
}

module.exports.Sources = {};
module.exports.Sources.Blank = require("./sources/blank_source.js").Blank;
module.exports.Sources.BlockchainDotInfo = require("./sources/blockchain_dot_info.js").BlockchainDotInfo;
module.exports.Sources.BlockrDotIo = require("./sources/blockr_dot_io.js").BlockrDotIo;
module.exports.Sources.Insight = require("./sources/insight.js").Insight;
