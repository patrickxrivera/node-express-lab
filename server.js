import bodyParser from 'body-parser';
import express from 'express';
import { createPost, handleGetReq } from './utils/helpers';

import * as code from './utils/statusCodes';
import db from './data/db.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const handleDbError = (res) => {
  const errorMessage = 'The posts information could not be retrieved.';
  res.status(code.STATUS_SERVER_ERROR).json({ errorMessage });
};

app.get('/api/posts', async (req, res) => {
  await handleGetReq(res);
});

app.post('/api/posts/new', (req, res) => {
  createPost(req, res);
});

if (!module.parent) {
  app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  });
}

module.exports = app;
