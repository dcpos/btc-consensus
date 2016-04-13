var request = require('request');

exports.BlockrDotIo = function() {

    this.address = function(addr, handler) {
        var url = "https://btc.blockr.io/api/v1/address/info/" + addr;
        request(url, function(err, response, body) {
            var data = JSON.parse(body);
            var result = {
                address: addr,
                balance: data.data.balance * 1e8,
                is_valid: data.data.is_valid,
                total_received_net: data.data.totalreceived * 1e8,
                tx_count: data.data.nb_txs,
            };
            handler(null, result);
        });
    }

}
