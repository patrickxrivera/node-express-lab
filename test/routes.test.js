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
});
