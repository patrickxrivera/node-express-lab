import { pipe, curry, isEmpty } from 'ramda';

import * as code from './statusCodes';
import db from '../data/db.js';

let newId = 2381472;

// ******* createPost ******* //

const sendPost = curry((res, newPost) => {
  res.status(code.STATUS_CREATED).json(newPost);
});

const handleDbError = (res) => {
  const errorMessage = 'Please provide title and contents for the post.';
  res.status(code.STATUS_BAD_REQUEST).json({ errorMessage });
};

const addToDb = curry((res, newPost) => {
  /* SIDE EFFECTS! */
  try {
    db.insert(newPost);
    newId++;
    return newPost;
  } catch (err) {
    // console.log(err);
    // handleDbError(res);
  }
});

const formatPost = (req) => ({ id: newId, ...req.body });

const handleReqError = (res) => {
  const errorMessage = 'Please provide title and contents for the post.';
  res.status(code.STATUS_BAD_REQUEST).json({ errorMessage });
};

const validatePost = curry(
  (res, req) =>
    isEmpty(req.body.title) || isEmpty(req.body.contents)
      ? handleReqError(res)
      : req
);

export const createPost = (req, res) =>
  pipe(validatePost(res), formatPost, addToDb(res), sendPost(res))(req);

// ******* createPost ******* //

const getPosts = async (res) => {
  const posts = await db.find();
  res.status(code.STATUS_OK).json(posts);
};

export const handleGetReq = async (res) => {
  try {
    await getPosts(res);
  } catch (err) {
    console.log(err);
    handleDbError(res);
  }
};
