import {stub} from 'sinon';
import should from 'should';
import proxyquire from 'proxyquire';

proxyquire.noCallThru();
const UNIT_PATH = '../src/httpClient';

describe('httpClient', () => {
  let unit, rp, promise;

  beforeEach(() => {
    promise = {then: stub(), catch: stub()};
    promise.then.returns(promise);
    promise.catch.returns(promise);

    rp = {get: stub(), post: stub(), put: stub(), del: stub()};
    Object.keys(rp).forEach(name => rp[name].returns(promise));

    unit = proxyquire(UNIT_PATH, {
      'request-promise': rp
    }).createHttpClient;
  });

  describe('createHttpClient', () => {
    let client;

    beforeEach(() => {
      client = unit({url: 'u', token: 't'});
    });

    it('should work without options', () => {
      client.get('').then.should.be.type('function');
      client.post('').then.should.be.type('function');
      client.put('').then.should.be.type('function');
      client.del('').then.should.be.type('function');
    });

    it('should combine base url and path with config', () => {
      client.get('/p', {nice: true});
      rp.get.firstCall.args[0].should.eql({
        headers: {token: 't'},
        url: 'u/p',
        nice: true,
        path: '/p',
        json: true
      });
    });

    it('should combine headers', () => {
      client.get('/p', {headers: {a: 3}});
      rp.get.firstCall.args[0].headers.should.eql({
        token: 't',
        a: 3
      });
    });

    describe('notFoundToNull', () => {
      let notFound;

      beforeEach(() => {
        notFound = client.get().catch.firstCall.args[0];
      });

      it('should return null for 404 errors', () => {
        const err = new Error('e1');
        err.statusCode = 404;
        should(notFound(err)).be.null();
      });

      it('should rethrow for non 404 errors', () => {
        (function () {
          notFound(new Error('e1'));
        }).should.throw(/e1/);
      });
    });

    describe('wrapError', () => {
      let wrapError;

      beforeEach(() => {
        wrapError = client.post().catch.firstCall.args[0];
      });

      it('should rethrow for non http errors', () => {
        (function () {
          wrapError(new Error('e1'));
        }).should.throw(/e1/);
      });

      it('should wrap http errors', () => {
        const err = new Error('e1');
        err.statusCode = 409;
        err.error = {error: 'inner-message'};
        err.options = {path: '/p'};
        err.response = {request: {method: 'POST'}};
        (function () {
          wrapError(err);
        }).should.throw(/409 - POST \/p; Cause: inner-message/);
      });
    });
  });
});
