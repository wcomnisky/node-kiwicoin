# node-kiwicoin
Unofficial [Kiwi-Coin.com](https://kiwi-coin.com) API client for Node.js.

## Installation

The package is available on [NPM](https://www.npmjs.com/package/kiwicoin) as `kiwicoin`.

```Shell
npm install kiwicoin
```

## Usage

Using the private services:

```javascript
var Kiwicoin = require('kiwicoin');

var kiwiClient = new Kiwicoin("YourUserId", "YourApiKey", "YourSecret");
kiwiClient.balance(function(err, info) {
    console.log(err, info);
  });
```

Take a look on the wiki to get instructions on how to:

* [Find my userId](<https://github.com/wcomnisky/node-kiwicoin/wiki/Kiwi-Coin#how-to-find-the-userid>)
* [Create/Enable my API Key and Secret](<https://github.com/wcomnisky/node-kiwicoin/wiki/Kiwi-Coin#how-to-createfindenable-the-api-key>)

If you just want to use the public services you __don't need__ to provide the userID / API Key / Secret.

The public services are:

* Ticker (`ticker`)
* Order book (`order_book`)

```javascript
var Kiwicoin = require('kiwicoin');

var kiwiClient = new Kiwicoin();
kiwiClient.ticker(function(err, info) {
    console.log(err, info);
  });
```

### Kiwi-Coin Request limits

Be aware about their limits:

> _Do not make more than 600 requests per 10 minutes or we will ban your IP address._

## License

[MIT](LICENSE)
