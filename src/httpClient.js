import rp from 'request-promise';
import createDebug from 'debug';

const debug = createDebug('servo-sdk');

export function createHttpClient({url, token}) {
  const client = {};

  ['get', 'post', 'put', 'del'].forEach(name => {
    client[name] = (path, options={}) => {
      debug(name + ' ' + path, options);

      options.url = url + path;
      options.path = path;
      options.headers = options.headers || {};
      options.headers.token = token;
      options.json = true;

      let promise = rp[name](options);

      promise = (name === 'get') ? promise.catch(notFoundToNull) : promise;
      promise = promise.catch(wrapError);

      return promise;
    };
  });

  return client;
}

function notFoundToNull(e) {
  if (e.statusCode && e.statusCode === 404) return null;
  throw e;
}

function wrapError(e) {
  if (!e.statusCode) throw e;

  const {statusCode} = e;
  const causeMessage = e.error.error;
  const path = e.options.path;
  const method = e.response.request.method;

  const error = new Error(`${statusCode} - ${method} ` +
    `${path}; Cause: ${causeMessage}`);

  error.name = 'ServoClientError';
  error.statusCode = statusCode;
  error.path = path;

  throw error;
}
