# Servo SDK for JS
[![Build Status](https://secure.travis-ci.org/dowjones/servo-sdk-js.png)](http://travis-ci.org/dowjones/servo-sdk-js) [![NPM version](https://badge.fury.io/js/servo-sdk-js.svg)](http://badge.fury.io/js/servo-sdk-js)

Servo SDK for JavaScript.


## Usage Example

```js
import {createClient} from 'servo-sdk';

const client = createClient({
  url: 'https://virginia.myservo.com',
  token: 'fa3234sdf234sdfd3244322bdfa',
});

async function getAppId() {
  const app = await client.getApp('my_amazing_app');
  return app.id;
}
```

## API

```js
// App
createApp: (name, source)
getApp: (appName)
getApps: (options)

// Build
createBuild: (appName, commit)
getBuild: (appName, buildId)
getBuilds: (appName, options)

// Stack
createStack: (appName, name)
deleteStack: (appName, name)
getStack: (appName, name)
getStacks: (appName, options)

// Stack/Config
createStackConfig: (appName, name, key, value, {secret, md5} = {})
deleteStackConfig: (appName, name, configId)
getStackConfig: (appName, name)
updateStackConfig: (appName, name, configId, value)

// Deployment
createDeployment: (appName, stackName, buildId)
getDeployment: (appName, stackName, deploymentId)
getDeployments: (appName, stackName, options)
```

## License

[MIT](/LICENSE)
