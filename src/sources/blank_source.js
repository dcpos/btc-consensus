exports.Blank = function() {

    this.address = function(addr, handler) {
        var blankResult = {
            address: addr,
            balance: 0,
            balance_confirmed: 0,
            balance_unconfirmed: 0,
            is_valid: true,
            total_received_gross: 0,
            total_received_net: 0,
            total_sent_gross: 0,
            total_sent_net: 0,
            tx_count: 0,
        };
        handler(null, blankResult);
    }

    this.utxos = function(addr, handler) {
        var blankResult = [
            {
                tx_id: "",
                tx_output: 0,
                amount: 0,
                confirmations: 2,
            },
            {
                tx_id: "",
                tx_output: 0,
                amount: 0,
                confirmations: 1,
            }
        ];
        handler(null, blankResult);
    }

    this.txs = function(addr, handler) {
        var blankResult = [
            "oldest_tx_hash",
            "newest_tx_hash",
        ];
        handler(null, blankResult);
    }

    this.tx = function(txid, handler) {
        var blankResult = {
            block_height: 0,
            block_time: 0,
            lock_time: 0,
            tx_id: "",
            fee: 0,
            inputs: [
                {
                    address: "",
                    txid: "",
                    amount: 0,
                    tx_output: 0,
                },
            ],
            outputs: [
                {
                    address: "",
                    amount: 0,
                }
            ],
        };
        handler(null, blankResult);
    }

}
