var request = require('request');

exports.BlockchainDotInfo = function() {

    this.address = function(addr, handler) {
        var url = "https://blockchain.info/address/" + addr + "?format=json";
        request(url, function(err, response, body) {
            var data = JSON.parse(body);
            var result = {
                address: addr,
                balance: data.final_balance,
                total_received_net: data.total_received,
                total_sent_net: data.total_sent,
                tx_count: data.n_tx,
            };
            handler(null, result);
        });
    }

}
