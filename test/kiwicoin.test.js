var request = require('request')
var chai = require('chai')
var sinon = require('sinon')
var sinonChai = require('sinon-chai')

var assert = chai.assert;
var expect = chai.expect;
chai.use(sinonChai);

var Kiwicoin = require('../kiwicoin')

describe('without credentials provided', function() {

    var kiwicoin;

    beforeEach(function(){
        kiwicoin = new Kiwicoin();
        sinon.stub(kiwicoin, '_doPublicRequest').yields(null, {});
        sinon.stub(kiwicoin, '_doPrivateRequest').yields(null, {});
    });

    afterEach(() => {
        kiwicoin._doPublicRequest.restore && kiwicoin._doPublicRequest.restore();
        kiwicoin._doPrivateRequest.restore && kiwicoin._doPrivateRequest.restore();
    });    

    it('should instantiate', function() {      
        chai.expect(kiwicoin).to.be.instanceOf(Kiwicoin);
    });

    it('should call ticker() successfully', function() {         
        const callback = () => {}; 
        kiwicoin.ticker(callback);
        expect(kiwicoin._doPublicRequest).to.have.been.calledOnceWith('ticker', callback);
    });

    it('should call orderBook() successfully', function() {           
        const callback = () => {}; 
        kiwicoin.orderBook(callback);
         expect(kiwicoin._doPublicRequest).to.have.been.calledOnceWith('order_book', callback);
    });

    it('should fail to call any srvice that requires authentication', function() {  
        
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

describe('with credentials provided', function() {

    var kiwicoin;

    beforeEach(function(){
        kiwicoin = new Kiwicoin('userId', 'apiKey', 'secret');
        sinon.stub(kiwicoin, '_doPublicRequest').yields(null, {});
        sinon.stub(kiwicoin, '_doPrivateRequest').yields(null, {});
    });

    afterEach(() => {
        kiwicoin._doPublicRequest.restore && kiwicoin._doPublicRequest.restore();
        kiwicoin._doPrivateRequest.restore && kiwicoin._doPrivateRequest.restore();
    });    

    it('should instantiate', function() {      
        chai.expect(kiwicoin).to.be.instanceOf(Kiwicoin);
    });

    it('should call ticker() successfully', function() {         
        const callback = () => {}; 
        kiwicoin.ticker(callback);
        expect(kiwicoin._doPublicRequest).to.have.been.calledOnceWith('ticker', callback);
    });

    it('should call orderBook() successfully', function() {           
        const callback = () => {}; 
        kiwicoin.orderBook(callback);
        expect(kiwicoin._doPublicRequest).to.have.been.calledOnceWith('order_book', callback);
    });

    it('should call balance() successfully', function() {           
        const callback = () => {}; 
        kiwicoin.balance(callback);
        expect(kiwicoin._doPrivateRequest).to.have.been.calledOnceWith('balance', [], callback);
    });

    it('should call openOrders() successfully', function() {           
        const callback = () => {}; 
        kiwicoin.openOrders(callback);
        expect(kiwicoin._doPrivateRequest).to.have.been.calledOnceWith('open_orders', [], callback);
    });

    it('should call cancelOrder() successfully', function() {           
        const callback = () => {}; 
        kiwicoin.cancelOrder(123, callback);
        expect(kiwicoin._doPrivateRequest).to.have.been.calledOnceWith('cancel_order', [['id', 123]], callback);
    });

    // kiwicoin.openOrders(callback);
        // kiwicoin.cancelOrder(123, callback);
        // kiwicoin.buy(10000, 10, callback);
        // kiwicoin.sell(20000, 10, callback);
})