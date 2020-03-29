var request = require('request')
var chai = require('chai')
var sinon = require('sinon')
var sinonChai = require('sinon-chai')

var assert = chai.assert;
var expect = chai.expect;
chai.use(sinonChai);

var Kiwicoin = require('../kiwicoin')

describe('internal functions', () => {

    var kiwicoin;

    beforeEach(() => {
        // kiwicoin = new Kiwicoin('userId', 'apiKey', 'secret');
        // sinon.stub(kiwicoin, '_dispatchRequest').yields(new Error(), null);
    })

    afterEach(() => {
        kiwicoin._dispatchRequest.restore && kiwicoin._dispatchRequest.restore();
    })

    describe('_doPrivateRequest required params validation', () => {

        // const callback = (err, response) => {
        //     assert(err instanceof Error, 'err expected an instance of Error');
        //     assert(response == null, 'Response is not null');
        // };
        const callback = () => {}

        describe('when userId is null', () => {
            it('should return an Error for services that require authentication', () => {
                kiwicoin = new Kiwicoin(null, 'apiKey', 'secret');
                sinon.stub(kiwicoin, '_dispatchRequest').yields(new Error(), null);
                kiwicoin._doPrivateRequest('fake_service', [], callback);
                expect(kiwicoin._dispatchRequest).to.have.not.been.called;
            })
        })

        describe('when apiKey is null', () => {
            it('should return an Error for services that require authentication', () => {
                kiwicoin = new Kiwicoin('userId', null, 'secret');
                sinon.stub(kiwicoin, '_dispatchRequest').yields(new Error(), null);
                kiwicoin._doPrivateRequest('fake_service', [], callback);
                expect(kiwicoin._dispatchRequest).to.have.not.been.called;
            })
        })

        describe('when secret is null', () => {
            it('should return an Error for services that require authentication', () => {
                kiwicoin = new Kiwicoin('userId', 'apiKey', null);
                sinon.stub(kiwicoin, '_dispatchRequest').yields(new Error(), null);
                kiwicoin._doPrivateRequest('fake_service', [], callback);
                expect(kiwicoin._dispatchRequest).to.have.not.been.called;
            })
        })

    })

    describe('when a nonce function is provided as options', () => {
        it('should be called', () => {
            var nonce_toString = sinon.stub(String.prototype, "toString").returns("mynonce");
            var nonce_callback = sinon.spy(nonce_toString);
            kiwicoin = new Kiwicoin('userId', 'apiKey', 'secret', nonce_callback);
            sinon.stub(kiwicoin, '_dispatchRequest').yields(null, {});
            callback = () => { }
            
            kiwicoin._doPrivateRequest('fake_service', [], callback);
            
            assert(nonce_callback.calledOnce, 'Callback was not called once');
            assert(nonce_toString.called);
            nonce_toString.restore();
        })
    })

    describe('when a nonce function is provided in the options', () => {
        it('should be called', () => {
            var nonce_toString = sinon.stub(String.prototype, "toString").returns("mynonce");
            var options = {
                nonce: nonce_toString
            };
            kiwicoin = new Kiwicoin('userId', 'apiKey', 'secret', options);
            sinon.stub(kiwicoin, '_dispatchRequest').yields(null, {});
            callback = () => { }
            
            kiwicoin._doPrivateRequest('fake_service', [], callback);
            
            assert(nonce_toString.called);
            nonce_toString.restore();
        })
    })

})

describe('without credentials provided', () => {

    var kiwicoin;

    beforeEach(function () {
        kiwicoin = new Kiwicoin();
        sinon.stub(kiwicoin, '_doPublicRequest').yields(null, {});
        sinon.stub(kiwicoin, '_doPrivateRequest').yields(null, {});
    });

    afterEach(() => {
        kiwicoin._doPublicRequest.restore && kiwicoin._doPublicRequest.restore();
        kiwicoin._doPrivateRequest.restore && kiwicoin._doPrivateRequest.restore();
    });

    it('should instantiate', () => {
        chai.expect(kiwicoin).to.be.instanceOf(Kiwicoin);
    });

    it('should call ticker() successfully', () => {
        const callback = () => { };
        kiwicoin.ticker(callback);
        expect(kiwicoin._doPublicRequest).to.have.been.calledOnceWith('ticker', callback);
    });

    it('should call orderBook() successfully', () => {
        const callback = () => { };
        kiwicoin.orderBook(callback);
        expect(kiwicoin._doPublicRequest).to.have.been.calledOnceWith('order_book', callback);
    });

    it('should fail to call any srvice that requires authentication', () => {

        kiwicoin._doPrivateRequest.restore();

        const callback = (err, response) => {
            assert(err instanceof Error, 'err expected an instance of Error');
            assert(response == null, 'Response is not null');
        };

        kiwicoin.balance(callback);
        kiwicoin.openOrders(callback);
        kiwicoin.cancelOrder(123, callback);
        kiwicoin.buy(10000, 10, callback);
        kiwicoin.sell(20000, 10, callback);

        expect(kiwicoin._doPublicRequest).to.have.not.been.called;
    });
})

describe('with credentials provided', () => {

    var kiwicoin;

    beforeEach(function () {
        kiwicoin = new Kiwicoin('userId', 'apiKey', 'secret');
        sinon.stub(kiwicoin, '_doPublicRequest').yields(null, {});
        sinon.stub(kiwicoin, '_doPrivateRequest').yields(null, {});
    });

    afterEach(() => {
        kiwicoin._doPublicRequest.restore && kiwicoin._doPublicRequest.restore();
        kiwicoin._doPrivateRequest.restore && kiwicoin._doPrivateRequest.restore();
    });

    it('should instantiate', () => {
        chai.expect(kiwicoin).to.be.instanceOf(Kiwicoin);
    });

    it('should call ticker() successfully', () => {
        const callback = () => { };
        kiwicoin.ticker(callback);
        expect(kiwicoin._doPublicRequest).to.have.been.calledOnceWith('ticker', callback);
    });

    it('should call orderBook() successfully', () => {
        const callback = () => { };
        kiwicoin.orderBook(callback);
        expect(kiwicoin._doPublicRequest).to.have.been.calledOnceWith('order_book', callback);
    });

    it('should call balance() successfully', () => {
        const callback = () => { };
        kiwicoin.balance(callback);
        expect(kiwicoin._doPrivateRequest).to.have.been.calledOnceWith('balance', [], callback);
    });

    it('should call openOrders() successfully', () => {
        const callback = () => { };
        kiwicoin.openOrders(callback);
        expect(kiwicoin._doPrivateRequest).to.have.been.calledOnceWith('open_orders', [], callback);
    });

    it('should call cancelOrder() successfully', () => {
        const callback = () => { };
        kiwicoin.cancelOrder(123, callback);
        expect(kiwicoin._doPrivateRequest).to.have.been.calledOnceWith('cancel_order', [['id', 123]], callback);
    });

})