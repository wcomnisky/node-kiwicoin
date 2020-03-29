# node-kiwicoin
[Kiwi-Coin.com](https://kiwi-coin.com) API client for Node.js.

[![Coverage Status](https://coveralls.io/repos/github/wcomnisky/node-kiwicoin/badge.svg?branch=fix/unit-tests)](https://coveralls.io/github/wcomnisky/node-kiwicoin?branch=fix/unit-tests)
[![Build Status](https://travis-ci.org/wcomnisky/node-kiwicoin.svg?branch=master)](https://travis-ci.org/wcomnisky/node-kiwicoin)

## Installation

The package is available on [NPM](https://www.npmjs.com/package/kiwicoin) as **`kiwicoin`**.

```Shell
npm install kiwicoin
```
## Kiwi-Coin API

* [Official Kiwi-Coin documentation](https://kiwi-coin.com/help.html#!/api-description/)

The API has 2 groups of services (or functions):

* **Public**: does not require authentication;
* **Private**: requires authentication (based on your User ID, API key and secret)
  * [Where can I find my User ID?](docs/kiwi-coin/README.md)
  * [How to create, find or enable the API key?](docs/kiwi-coin/README.md)

## Usage

Using the private services from Kiwi-Coin API (they require authentication):

```javascript
// Usage example for the Balance service:
// --------------------------------------

var Kiwicoin = require('kiwicoin');

var kiwiClient = new Kiwicoin("YourUserId", "YourApiKey", "YourSecret");

kiwiClient.balance(function(err, info) {
    console.log(err, info);
  });
```

If you just want to use the public services you __don't need__ to provide the credentials (UserId, API Key and secret).

The public services are:

* Ticker (`ticker`)
* Order book (`order_book`)

```javascript
// Usage example for the Ticker service:
// -------------------------------------

var Kiwicoin = require('kiwicoin');

var kiwiClient = new Kiwicoin();

kiwiClient.ticker(function(err, info) {
    console.log(err, info);
  });
```
## License

[MIT](LICENSE)
