# Under Development

This is *not ready for production*. It is currently under development.

# About

`btc-consensus` is a javascript library for reading the blockchain. It aggregates multiple public blockchains into what appears to be a single blockchain source. This allows users to trust the received data without running their own blockchain.

# Quick Start

## Node

```
$ npm install --save btc-consensus
```

```
btcConsensus = require('btc-consensus');

btc = new btcConsensus.Blockchain([
    new btcConsensus.Sources.Insight(),
    new btcConsensus.Sources.BlockchainDotInfo(),
    new btcConsensus.Sources.Insight("https://blockexplorer.com"),
    // ... add more if desired
]);

btc.address("173MjkFkm1iCYTkW7fBZj5EoPHb5JWhyYJ", function(err, data) {
    if (err) {
        console.log(err);
    }
    console.log(data.tx_count);
});
```

## Browser

Download the latest version [minified](https://github.com/dcpos/btc-consensus/raw/master/btc-consensus.min.js) for production or [unminified](https://github.com/dcpos/btc-consensus/raw/master/btc-consensus.js) for development.

On your webpage include the tag

```
<script src="/path/to/js/btc-consensus.min.js"></script>
<script>
btc = new btcConsensus.Blockchain([
    new btcConsensus.Sources.Insight(),
    new btcConsensus.Sources.BlockchainDotInfo(),
    new btcConsensus.Sources.Insight("https://blockexplorer.com"),
    // ... add more if desired
]);

btc.address("173MjkFkm1iCYTkW7fBZj5EoPHb5JWhyYJ", function(err, data) {
    if (err) {
        console.log(err);
    }
    console.log(data.tx_count);
});
</script>
```

# Tests

```
$ npm install -g mocha chai
$ cd path/to/btc-consensus
$ npm test
```

# Compile

```
$ npm install -g browserify uglify-js
$ npm install --dev
$ cd path/to/btc-consensus
$ npm run-script compile
$ npm run-script minify
```

# Supported Blockchains

* blockchain.info
* blockr.io
* insight
  * insight.bitpay.com
  * blockexplorer.com

# Response Formats

This is specified formally in `BlankSource` and the assosciated tests.

All money amounts are in satoshis and are integer values.

## address()

```
{
    address: "",
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
```

Notes:

`total_received_gross` includes amounts sent from this address to itself (ie
reusing addresses for change).

`total_received_net` excludes amounts sent from this address to itself. The
reason is discussed in
[this issue](https://github.com/bitpay/insight-api/issues/31).

`balance` is the combined balance of `balance_confirmed` and
`balance_unconfirmed`. `balance_confirmed` is all balances from transactions
with at least one confirmation. `balance_unconfirmed` is from transactions with
no confirmations.

Unless specifically stated, unconfirmed transactions are included.

## utxos()

```
[
    {
        tx_id: "",
        tx_output: 0,
        amount: 0,
        confirmations: 0,
    }
]
```

Notes:

Ordered by oldest utxo first, where oldest is determined by highest
confirmations.
