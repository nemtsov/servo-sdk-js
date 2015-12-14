import {stub} from 'sinon';
import proxyquire from 'proxyquire';

proxyquire.noCallThru();
const UNIT_PATH = '../src';

describe('servo-sdk', () => {
  let client, httpClient;

  beforeEach(() => {
    httpClient = {get: stub(), post: stub(), put: stub(), del: stub()};

    const createHttpClient = stub();
    createHttpClient.returns(httpClient);

    client = proxyquire(UNIT_PATH, {
      './httpClient': {createHttpClient} 
    }).createClient();
  });

  it('should call through httpClient', () => {
    Object.keys(client).forEach(name => client[name]());
    httpClient.get.callCount.should.equal(9);
    httpClient.post.callCount.should.equal(5);
    httpClient.put.callCount.should.equal(1);
    httpClient.del.callCount.should.equal(2);
  });

  it('should default to non-secret stackConfig', () => {
    client.createStackConfig();
    httpClient.post.firstCall.args[1].body.secret.should.not.be.ok();
  });

  it('should allow secret stackConfig', () => {
    client.createStackConfig('/', 'n', 'k', 'v', true);
    httpClient.post.firstCall.args[1].body.secret.should.be.ok();
  });
});
