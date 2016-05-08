/**
 * Created by hieuvo on 5/7/16.
 */
import {Server} from 'hapi';
import Inert from 'inert';
import Vision from 'vision';

import Webpack from 'webpack';
import HapiWebpack from 'hapi-webpack-plugin';
import WebpackConfig from '../webpack/dev.config';

import React from 'react';
import ReactDOM from 'react-dom/server';

import App from '../src/common/components/App';


const HOST = 'localhost';
const PORT = process.env.PORT || '9001';

const server = new Server();
server.connection({
  host: HOST,
  port: PORT
});

const compiler = Webpack(WebpackConfig);

const assets = {
  noInfo: true,
  publicPath: WebpackConfig.output.publicPath,
};
const hot = {
  path: '/__webpack_hmr',
  timeout: '20000',
  log: console.log,
  reload: false
};
const HapiWebpackPlugin = {
  register: HapiWebpack,
  options: {compiler, assets, hot}
};

server.register([HapiWebpackPlugin, Inert, Vision], (err) => {
  if(err) {
    throw err;
  }
  server.views({
    engines: {
      'html' : require('handlebars')
    },
    relativeTo: __dirname,
    path: '../src/browser/views/'
  });
  //Serve Static files
  server.route({
    method: 'GET',
    path: '/dist/{param*}',
    handler: {
      directory: {
        path: 'dist/'
      }
    }
  });
  server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      const reactString = ReactDOM.renderToString(<App/>);
      reply.view('index', {content: reactString});
    }
  });
  // Start the server
  server.start((err) => {
    if (err) {
      throw err;
    }
    console.log('Server running at:', server.info.uri);
  });

});
