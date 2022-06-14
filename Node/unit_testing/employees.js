/* eslint-disable */
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
chai.should();
chai.use(chaiHttp);
describe('Employees API', () => {
  describe('GET /api/employees', () => {
    it('It should get all employees', (done) => {
      chai
        .request(server)
        .get('/employees')
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('array');
          done();
        });
    });
  });
});
