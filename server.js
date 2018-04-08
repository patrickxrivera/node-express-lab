import bodyParser from 'body-parser';
import express from 'express';
import { isEmpty } from 'ramda';

import { createPost, handleGetReq } from './utils/helpers';
import * as code from './utils/statusCodes';
import db from './data/db.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/posts', async (req, res) => {
  await handleGetReq(res);
});

app.post('/api/posts/new', (req, res) => {
  createPost(req, res);
});

app.delete('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  const postToDelete = await db.findById(id);

  if (isEmpty(postToDelete)) {
    const errorMessage = 'The post with the specified ID does not exist.';
    res.status(code.STATUS_NOT_FOUND).json({ errorMessage });
    return;
  }

  await db.remove(id);
  res.status(code.STATUS_OK).json(postToDelete[0]);
});

app.put('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  const updatedPost = req.body;
  db.update(id, updatedPost);
  res.status(code.STATUS_OK).json(updatedPost);
});

if (!module.parent) {
  app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  });
}

module.exports = app;
