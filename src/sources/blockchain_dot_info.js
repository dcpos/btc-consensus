var request = require('request');

exports.BlockchainDotInfo = function() {

    this.address = function(addr, handler) {
        var url = "https://blockchain.info/address/" + addr + "?format=json";
        request(url, function(err, response, body) {
            var result = {
                address: addr,
                balance: body.final_balance,
                total_received_net: body.total_received,
                total_sent_net: body.total_sent,
                tx_count: body.n_tx,
                txs: [], // TODO
                utxos: [], // TODO
            };
            handler(null, result);
        });
    }

}
