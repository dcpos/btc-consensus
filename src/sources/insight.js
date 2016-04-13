var request = require('request');

exports.Insight = function(root) {

    // Default to bitpay version of insight[ they are the creators and host the
    // source code.
    if (typeof root === "undefined") {
        root = "https://insight.bitpay.com";
    }
    // remove trailing slashes from root
    root = root.replace(/\/+$/g, "");

    this.address = function(addr, handler) {
        var url = root + "/api/addr/" + addr;
        request(url, function(err, response, body) {
            var data = JSON.parse(body);
            var result = {
                address: addr,
                balance: data.balanceSat,
                balance_unconfirmed: data.unconfirmedBalanceSat,
                total_received_gross: data.totalReceivedSat,
                total_sent_gross: data.totalSentSat,
                tx_count: data.txApperances,
            };
            handler(null, result);
        });
    }

}
