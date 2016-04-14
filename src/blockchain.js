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
                        responses[index] = {}; // result exists but is meaningless
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

// Aggregates a number of array into a single array with the most common
// value for each index. Assumes sorting is consistent for all arrays.
function aggregateArrays(responses) {
    // Group all values for each index together.
    // Assumes that each response is sorted in the same order.
    var collated = {};
    for (var i=0; i<responses.length; i++) {
        var response = responses[i];
        for (var j=0; j<response.length; j++) {
            if (!(j in collated)) {
                collated[j] = [];
            }
            var value = response[j];
            collated[j].push(value);
        }
    }
    // For each index's group of values, use the mode
    var modes = [];
    for (var key in collated) {
        var values = collated[key];
        var value = statisticalMode(values);
        modes[key] = value;
    }
    return modes;
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
