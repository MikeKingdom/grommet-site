import Express from 'express';
import React from 'react';
import Helmet from 'react-helmet';
import path from 'path';
import fs from 'fs';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import App from '../src/App';
import html from './html';

const app = Express();
const publicPath = path.resolve(__dirname, '..', 'dist');

if (!fs.existsSync(publicPath)) {
  throw new Error(
    `No distribution folder detected. Run 'yarn build' first to create the site bundle.`,
  );
}

const manifest = require(`${publicPath}/webpack-manifest.json`); // eslint-disable-line import/no-dynamic-require

app.use(Express.static(publicPath));

app.use((req, res) => {
  const sheet = new ServerStyleSheet();
  const body = renderToString(
    sheet.collectStyles(<App initialPath={req.path} />),
  );
  const helmet = Helmet.renderStatic();
  const styles = sheet.getStyleTags();
  const scripts = [manifest['main.js'], manifest['vendors~main.js']];
  const htmlString = html({ body, styles, scripts, helmet });
  res.send(htmlString);
});

app.listen('3000', () => {
  console.log('🛸 Grommet Site SSR listening on port 3000 🛸');
});