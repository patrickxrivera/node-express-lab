import chai from 'chai';
import chaiHttp from 'chai-http';
import * as code from '../utils/statusCodes';

const server = require('../server.js');

const expect = chai.expect;

chai.use(chaiHttp);

describe('API ROUTES', () => {
  describe('POST /api/posts/new', () => {
    it('should create a new post', async () => {
      const route = '/api/posts/new';
      const post = {
        title: 'I love software engineering',
        contents:
          'It can be very difficult at times. But thats what makes it so rewarding :)'
      };

      const res = await chai
        .request(server)
        .post(route)
        .send(post);

      expect(res).to.have.status(code.STATUS_CREATED);
      expect(res.body).to.have.property('id');
      expect(res.body.id).to.be.a('number');
    });

    it('should send an error if the title or contents fields are missing', async () => {
      const route = '/api/posts/new';
      const post = {
        title: '',
        contents:
          'It can be very difficult at times. But thats what makes it so rewarding :)'
      };

      const res = await chai
        .request(server)
        .post(route)
        .send(post);

      expect(res).to.have.status(code.STATUS_BAD_REQUEST);
      expect(res.body).to.have.property('errorMessage');
      expect(res.body.errorMessage).to.eql(
        'Please provide title and contents for the post.'
      );
    });
  });

  describe('GET /api/posts', () => {
    it('should return all posts', async () => {
      const route = '/api/posts';

      const res = await chai.request(server).get(route);

      expect(res).to.have.status(code.STATUS_OK);
      expect(res.body).to.be.a('array');
      expect(res.body[0]).to.have.property('id');
      expect(res.body[0]).to.have.property('title');
      expect(res.body[0]).to.have.property('contents');
    });
  });

  describe('DELETE /api/posts/:id', () => {
    beforeEach(async () => {
      const route = '/api/posts/new';
      const post = {
        title: 'I love software engineering',
        contents:
          'It can be very difficult at times. But thats what makes it so rewarding :)'
      };

      await chai
        .request(server)
        .post(route)
        .send(post);
    });
    it('should delete a post with the given id', async () => {
      const route = '/api/posts/0';
      const deletedPost = {
        id: 0,
        title: 'I love software engineering',
        contents:
          'It can be very difficult at times. But thats what makes it so rewarding :)'
      };

      const res = await chai.request(server).delete(route);

      expect(res).to.have.status(code.STATUS_OK);
      expect(res.body).to.be.a('object');
      expect(res.body).to.include(deletedPost);
    });

    it(`should return an error message when the given id isn't found`, async () => {
      const route = '/api/posts/20';
      const errorMessage = 'The post with the specified ID does not exist.';
      const res = await chai.request(server).delete(route);

      expect(res).to.have.status(code.STATUS_NOT_FOUND);
      expect(res.body).to.be.a('object');
      expect(res.body.errorMessage).to.equal(errorMessage);
    });
  });

  describe('PUT /api/posts/:id', () => {
    it('should update a post', async () => {
      const route = '/api/posts/1';
      const updatedPost = {
        title: 'Updated post',
        contents: 'This is an update'
      };

      const res = await chai
        .request(server)
        .put(route)
        .send(updatedPost);

      expect(res).to.have.status(code.STATUS_OK);
      expect(res.body).to.be.a('object');
      expect(res.body).to.include(updatedPost);
    });
  });
});
