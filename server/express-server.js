/**
 * Created by hieuvo on 5/7/16.
 */

import path from 'path'
import Express from 'express'
import exphbs from 'express-handlebars';

import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackConfig from '../webpack/dev.config'

import React from 'react'
import {renderToString} from 'react-dom/server'

import App from '../src/common/components/App';

const app = new Express();
const port = 3000

// Use this middleware to set up hot module reloading via webpack.
const compiler = webpack(webpackConfig)
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }))
app.use(webpackHotMiddleware(compiler));

//Set view engine
app.engine('html', exphbs());
app.set('views', path.join(__dirname,'../src/browser/views'));
app.set('view engine', 'html');


//Serving static files
app.use(Express.static(path.join(__dirname, '../static'),
  {
    dotfiles: 'ignore',
    extensions: [ 'htm', 'html' ],
    index: false
  }));
// This is fired every time the server side receives a request
app.use(handleRender);

function handleRender (req, res) {
  const html = renderToString(<App />);

  res.render('index.html', {content: html});
}

app.listen(port, (error) => {
  if (error) {
    console.error(error)
  } else {
    console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`)
  }
})
