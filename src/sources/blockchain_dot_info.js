var request = require('request');

exports.BlockchainDotInfo = function() {

    this.address = function(addr, handler) {
        var url = "https://blockchain.info/address/" + addr + "?format=json";
        request.get({
            url: url,
            json: true,
        }, function(err, response, data) {
            if (err) {
                handler(err);
            }
            if (response.statusCode != 200) {
                handle("blockchain_dot_info statusCode: " + response.statusCode);
            }
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
