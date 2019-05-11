'use strict';
var request = require('request'),
    crypto = require('crypto'),
    querystring = require('querystring');

var Kiwicoin = function (userId, apiKey, secret, options) {
    this.url = 'https://kiwi-coin.com/api';
    this.timeout = 5000;
    this.userId = userId;
    this.apiKey = apiKey;
    this.secret = secret;
    this._strictSSL = true;

    if (typeof options === 'function') {
        this.nonce = options;
    } else if (options) {
        this.nonce = options.nonce;
        this.agent = options.agent;

        if (typeof options.timeout !== 'undefined') {
            this.timeout = options.timeout;
        }

        if (typeof options.url !== 'undefined') {
            this.url = options.url;
        }

        if (typeof options.strict_ssl !== 'undefined') {
            this._strictSSL = !!options.strict_ssl;
        }
    }
};

Kiwicoin.prototype._doPublicRequest = function (service, params, callback) {
    this._sendRequest({
        url: this.url + '/' + service
    }, callback);
};

Kiwicoin.prototype._doPrivateRequest = function (service, params, callback) {

    var self = this;

    if (!self.userId || !self.apiKey || !self.secret) {
        return callback(new Error('The UserID, API key and secret must be provided'));
    }

    var nonce = new Date().getTime();
    if (self.nonce) {
        nonce = self.nonce();
    }

    var message = nonce.toString() + self.userId.toString() + self.apiKey.toString() + ';' + service;

    var formData = {};
    for (var i = 0; i < params.length; i++) {
        message = message + ',' + params[i][1]
        formData[params[i][0]] = params[i][1]
    }

    let buf;
    if (Buffer.from && Buffer.from !== Uint8Array.from) {
        buf = Buffer.from(message);
    } else {
        if (typeof message === 'number') {
            throw new Error('The "size" argument must be not of type number.');
        }
        buf = new Buffer(message);
    }

    var fullSignature = crypto.createHmac('sha256', self.secret).update(buf).digest('hex').toString().toUpperCase();

    var formDataB = {};
    formDataB.key = self.apiKey;
    formDataB.signature = fullSignature;
    formDataB.nonce = nonce;

    var form = querystring.stringify(formDataB) + "&" + querystring.stringify(formData);

    self._sendRequest({
        url: self.url + '/' + service,
        method: 'POST',
        form: form
    }, callback);
};

Kiwicoin.prototype._sendRequest = function (options, callback) {

    var self = this;

    var requestOptions = {
        timeout: self.timeout,
        agent: self.agent,
        strictSSL: self._strictSSL
    };

    for (var key in options) {
        requestOptions[key] = options[key];
    }

    request(requestOptions, function (err, response, body) {
        if (err || response.statusCode !== 200) {
            console.error("Code: " + response.statusCode + "; response: " + response.body);
            return callback(new Error(err || response.statusCode));
        }

        var result;
        try {
            result = JSON.parse(body);
        } catch (error) {
            return callback(error);
        }

        if (result.error) {
            return callback(new Error(result.error));
        }

        callback(null, result);
    });
};


Kiwicoin.prototype.ticker = function (callback) {
    this._doPublicRequest('ticker', {}, callback);
};

Kiwicoin.prototype.orderBook = function (callback) {
    this._doPublicRequest('order_book', {}, callback);
};

Kiwicoin.prototype.balance = function (callback) {
    this._doPrivateRequest('balance', {}, callback);
};

Kiwicoin.prototype.openOrders = function (callback) {
    this._doPrivateRequest('open_orders', {}, callback);
};

Kiwicoin.prototype.cancelOrder = function (orderId, callback) {
    var param = [
        ['id', orderId]
    ]
    this._doPrivateRequest('cancel_order', param, callback);
};

Kiwicoin.prototype.buy = function (price, amount, callback) {
    var params = [
        ['price', price],
        ['amount', amount]
    ]
    this._doPrivateRequest('buy', params, callback);
};

Kiwicoin.prototype.sell = function (price, amount, callback) {
    var params = [
        ['price', price],
        ['amount', amount]
    ]
    this._doPrivateRequest('sell', params, callback);
};

module.exports = Kiwicoin;
