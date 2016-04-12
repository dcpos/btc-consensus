module.exports.Blockchain = function(sources, options) {

    if (!sources || !sources.length) {
        throw ("new Blockchain requires sources input parameter");
    }

    this.address = function(addr, handler) {
        var responses = [];
        // Get address data from each source
        for (var i=0; i<sources.length; i++) {
            (function() {
                var source = sources[i];
                source.address(addr, function(err, data) {
                    // Handle error if it exists
                    if (err) {
                        responses[i] = {}; // result exists but is meaningless
                    }
                    else {
                        responses[i] = data; // cache this result
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
            })();
        }
    }
}

function aggregate(responses) {
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

function statisticalMode(values) {
    // TODO handle multimodal values
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
