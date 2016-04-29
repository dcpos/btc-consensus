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
                handler("blockr_dot_io statusCode: " + response.statusCode);
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
                handler("blockr_dot_io statusCode: " + response.statusCode);
            }
            if (data.status != "success") {
                handler("blockr_dot_io status: " + data.status);
            }
            var utxos = [];
            for (var i=0; i<data.data.unspent.length; i++) {
                var dataUtxo = data.data.unspent[i];
                var utxo = {
                    tx_id: dataUtxo.tx,
                    tx_output: dataUtxo.n,
                    amount: toSatoshis(dataUtxo.amount),
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

    this.txs = function(addr, handler) {
        var url = "https://btc.blockr.io/api/v1/address/txs/" + addr;
        request.get({
            url: url,
            json: true,
        }, function(err, response, data) {
            if (err) {
                handler(err);
            }
            if (response.statusCode != 200) {
                handler("blockr_dot_io statusCode: " + response.statusCode);
            }
            var txHashes = data.data.txs.map(function(t) { return t.tx; });
            var oldestFirst = txHashes.reverse();
            handler(null, oldestFirst);
        });
    }

    this.tx = function(txid, handler) {
        var url = "https://btc.blockr.io/api/v1/tx/info/" + txid;
        request.get({
            url: url,
            json: true,
        }, function(err, response, data) {
            if (err) {
                handler(err);
            }
            if (response.statusCode != 200) {
                handler("blockr_dot_io statusCode: " + response.statusCode);
            }
            var result = {
                block_height: data.data.block,
                block_time: new Date(data.data.time_utc).getTime() / 1000,
                tx_id: data.data.tx,
                fee: toSatoshis(data.data.fee),
                inputs: [],
                outputs: [],
            }
            // inputs
            result.inputs = data.data.vins.map(function(input) {
                return {
                    address: input.address,
                    txid: input.vout_tx,
                    amount: toSatoshis(input.amount),
                    tx_output: input.n,
                }
            });
            // outputs
            result.outputs = data.data.vouts.map(function(output) {
                return {
                    address: output.address,
                    amount: toSatoshis(output.amount),
                }
            });
            handler(null, result);
        });
    }

    function toSatoshis(btcStr) {
        var btc = parseFloat(btcStr);
        var satoshis = Math.round(btc * 1e8);
        var positive = Math.abs(satoshis);
        return positive;
    }

}
