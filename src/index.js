import {createHttpClient} from './httpClient';

export function createClient(config) {
  const c = createHttpClient(config);

  return {
    // App
    createApp: (name, source) => c.post(`/apps`, {body: {name, source}}),
    getApp: (appName) => c.get(`/apps/${appName}`),
    getApps: (options) => c.get(`/apps`, {qs: options}),

    // Build
    createBuild: (appName, commit) => c.post(`/apps/${appName}/builds`, {body: {commit}}),
    getBuild: (appName, buildId) => c.get(`/apps/${appName}/builds/${buildId}`),
    getBuilds: (appName, options) => c.get(`/apps/${appName}/builds`, {qs: options}),

    // Stack
    createStack: (appName, name) => c.post(`/apps/${appName}/stacks`, {body: {name}}),
    deleteStack: (appName, name) => c.del(`/apps/${appName}/stacks/${name}`),
    getStack: (appName, name) => c.get(`/apps/${appName}/stacks/${name}`),
    getStacks: (appName, options) => c.get(`/apps/${appName}/stacks`, {qs: options}),

    // Stack/Config
    createStackConfig: (appName, name, key, value, {secret, md5} = {}) =>
      c.post(`/apps/${appName}/stacks/${name}/config`, {body: {key, value, secret, md5}}),
    deleteStackConfig: (appName, name, configId) =>
      c.del(`/apps/${appName}/stacks/${name}/config/${configId}`),
    getStackConfig: (appName, name) => c.get(`/apps/${appName}/stacks/${name}/config`),
    updateStackConfig: (appName, name, configId, value) =>
      c.put(`/apps/${appName}/stacks/${name}/config/${configId}`, {body: {value}}),

    // Deployment
    createDeployment: (appName, stackName, buildId) =>
      c.post(`/apps/${appName}/stacks/${stackName}/deploys`, {body: {buildId}}),
    getDeployment: (appName, stackName, deploymentId) =>
      c.get(`/apps/${appName}` + `/stacks/${stackName}/deploys/${deploymentId}`),
    getDeployments: (appName, stackName, options) =>
      c.get(`/apps/${appName}/stacks/${stackName}/deploys`, {qs: options})
  };
}
