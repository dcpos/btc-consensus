var request = require('request');

exports.BlockrDotIo = function() {

    this.address = function(addr, handler) {
        var url = "https://btc.blockr.io/api/v1/address/info/" + addr;
        request.get({
            url: url,
            json: true,
        }, function(err, response, data) {
            if (err) {
                handler(err);
            }
            if (response.statusCode != 200) {
                handle("blockr_dot_io statusCode: " + response.statusCode);
            }
            var result = {
                address: addr,
                balance_confirmed: data.data.balance * 1e8,
                is_valid: data.data.is_valid,
                total_received_net: data.data.totalreceived * 1e8,
                tx_count: data.data.nb_txs,
            };
            handler(null, result);
        });
    }

    this.utxos = function(addr, handler) {
        var url = "https://btc.blockr.io/api/v1/address/unspent/" + addr;
        request.get({
            url: url,
            json: true,
        }, function(err, response, data) {
            if (err) {
                handler(err);
            }
            if (response.statusCode != 200) {
                handle("blockr_dot_io statusCode: " + response.statusCode);
            }
            if (data.status != "success") {
                handle("blockr_dot_io status: " + data.status);
            }
            var utxos = [];
            for (var i=0; i<data.data.unspent.length; i++) {
                var dataUtxo = data.data.unspent[i];
                var utxo = {
                    tx_id: dataUtxo.tx,
                    tx_output: dataUtxo.n,
                    amount: parseFloat(dataUtxo.amount) * 1e8,
                    confirmations: dataUtxo.confirmations,
                };
                utxos.push(utxo);
            }
            // Sort oldest utxo first
            // TODO consider multiple utxos with same confirmations, and how it
            // affects sorting and thus correlation when aggregating.
            utxos.sort(function(a,b) {
                return a.confirmations < b.confirmations;
            });
            handler(null, utxos);
        });
    }

}
