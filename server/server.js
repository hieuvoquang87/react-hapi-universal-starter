/**
 * Created by hieuvo on 5/7/16.
 */
import {Server} from 'hapi';
import Inert from 'inert';
import Vision from 'vision';

import React from 'react';
import ReactDOM from 'react-dom/server';

import App from '../common/components/App';


const HOST = 'localhost';
const PORT = process.env.PORT || '9001';

const server = new Server();
server.connection({
  host: HOST,
  port: PORT
});

server.register([Inert, Vision], (err) => {
  if(err) {
    throw err;
  }
  server.views({
    engines: {
      'html' : require('handlebars')
    },
    relativeTo: __dirname,
    path: '../browser/views/'
  });
  //Serve Static files
  server.route({
    method: 'GET',
    path: '/dist/{param*}',
    handler: {
      directory: {
        path: 'public/dist/'
      }
    }
  });
  server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      const app = <App/>;
      const reactString = ReactDOM.renderToString(app);
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
