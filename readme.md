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

Download the latest version [minified](#) for production or [unminified](#) for development.

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
