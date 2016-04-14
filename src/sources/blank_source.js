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

}
