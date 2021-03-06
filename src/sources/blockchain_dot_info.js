var request = require('request');

exports.BlockchainDotInfo = function() {

    var self = this;

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
                handler("blockchain_dot_info statusCode: " + response.statusCode);
            }
            // TODO use data.txs to calculate
            // balance_confirmed and balance_unconfirmed
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

    this.utxos = function(addr, handler) {
        var url = "https://blockchain.info/unspent?active=" + addr;
        request.get({
            url: url,
            json: true,
        }, function(err, response, data) {
            if (err) {
                handler(err);
            }
            if (response.statusCode != 200) {
                handler("blockchain_dot_info statusCode: " + response.statusCode);
            }
            if ("notice" in data) {
                // eg "This wallet contains a very large number of small unspent inputs. Ignoring some."
                // for 1BitcoinEaterAddressDontSendf59kuE
                // TODO handle this situation
            }
            var utxos = [];
            for (var i=0; i<data.unspent_outputs.length; i++) {
                var dataUtxo = data.unspent_outputs[i];
                var utxo = {
                    txid: dataUtxo.tx_hash,
                    tx_output: dataUtxo.tx_output_n,
                    amount: dataUtxo.value,
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

    this.txs = function(addr, handler, offset, result) {
        var maxTxCount = 1e5; // circuit-breaker
        var txPerPage = 50;
        var url = "https://blockchain.info/address/" + addr + "?format=json";
        if (offset) {
            url = url + "&offset=" + offset;
        }
        else {
            offset = 0;
        }
        if (!result) {
            result = [];
        }
        request.get({
            url: url,
            json: true,
        }, function(err, response, data) {
            if (err) {
                handler(err);
            }
            if (response.statusCode != 200) {
                handler("blockchain_dot_info statusCode: " + response.statusCode);
            }
            // Save these tx hashes to the result
            var txHashes = data.txs.map(function(t) { return t.hash; });
            var oldestFirst = txHashes.reverse();
            result = oldestFirst.concat(result);
            // Get more if required due to pagination
            var hasAllTxs = result.length >= data.n_tx;
            var belowMaxTxs = offset < maxTxCount;
            if (!hasAllTxs && belowMaxTxs) {
                var nextOffset = offset + txPerPage;
                self.txs(addr, handler, nextOffset, result);
            }
            else {
                handler(null, result);
            }
        });
    }

    this.tx = function(txid, handler) {
        var url = "https://blockchain.info/tx/" + txid + "?format=json";
        request.get({
            url: url,
            json: true,
        }, function(err, response, data) {
            if (err) {
                handler(err);
            }
            if (response.statusCode != 200) {
                handler("blockchain_dot_info statusCode: " + response.statusCode);
            }
            var result = {
                block_height: data.block_height,
                lock_time: data.lock_time,
                txid: data.hash,
                inputs: [],
                outputs: [],
            }
            // inputs
            result.inputs = data.inputs.map(function(input) {
                return {
                    address: input.prev_out.addr,
                    // txid: from tx_index but needs another request
                    amount: input.prev_out.value,
                    tx_output: input.prev_out.n,
                }
            });
            // outputs
            result.outputs = data.out.map(function(output) {
                return {
                    address: output.addr,
                    amount: output.value,
                }
            });
            // fee
            var totalIn = 0;
            for (var i=0; i<result.inputs.length; i++) {
                totalIn += result.inputs[i].amount;
            }
            var totalOut = 0;
            for (var i=0; i<result.outputs.length; i++) {
                totalOut += result.outputs[i].amount;
            }
            result.fee = totalIn - totalOut;
            handler(null, result);
        });
    }

}
