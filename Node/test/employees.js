/* eslint-disable */
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
chai.should();
chai.use(chaiHttp);
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoidXNlcjJ1c2VyMiJ9LCJpYXQiOjE2NTI5NDc4NTIsImV4cCI6MTY1Mjk0OTA1Mn0.gK2CjNEKcY86YUUM3gGarh-SeR8_bQ1S0Tq9Wwu5BM8';
describe('Employees API', () => {
  //Testing Get Api

  describe('GET /employees', () => {
    it('It should get all employees', (done) => {
      chai
        .request(server)
        .get('/employees')
        .set({ token })
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('array');
          done();
        });
    });
    it('Token Expired', (done) => {
      chai
        .request(server)
        .get('/employees')
        .set({ token: 'ujhgyghg' })
        .end((err, response) => {
          response.should.have.status(401);
          response.body.should.be.a('object');
          response.body.should.have
            .property('error')
            .eq('invalid token/token expired');
          done();
        });
    });
    it('Token Not Sent', (done) => {
      chai
        .request(server)
        .get('/employees')
        .end((err, response) => {
          response.should.have.status(401);
          response.body.should.be.a('object');
          response.body.should.have
            .property('error')
            .eq('please send the token');
          done();
        });
    });
  });
  describe('GET /employees/:id', () => {
    it('Token Not Sent', (done) => {
      chai
        .request(server)
        .get('/employees/1')
        .end((err, response) => {
          response.should.have.status(401);
          response.body.should.be.a('object');
          response.body.should.have
            .property('error')
            .eq('please send the token');
          done();
        });
    });
    it('Token Expired', (done) => {
      chai
        .request(server)
        .get('/employees/1')
        .set({ token: 'ujhgyghg' })
        .end((err, response) => {
          response.should.have.status(401);
          response.body.should.be.a('object');
          response.body.should.have
            .property('error')
            .eq('invalid token/token expired');
          done();
        });
    });
    it('It should get single employee object', (done) => {
      chai
        .request(server)
        .get('/employees/1')
        .set({ token })
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.should.have.property('id');
          response.body.should.have.property('id').eq(1);
          done();
        });
    });

    it('Id not found', (done) => {
      chai
        .request(server)
        .get('/employees/123')
        .set({ token })
        .end((err, response) => {
          response.should.have.status(400);
          response.body.should.be.a('object');
          response.body.should.have.property('msg');
          response.body.should.have
            .property('msg')
            .eq('employee with id 123 not found');
          done();
        });
    });
  });

  //Testing POST Api

  describe('POST /employees', () => {
    const employeeObj = {
      firstname: 'karunasree',
      lastname: 'ramisetty',
      email: 'ka09hkhyyga123@gmail.com',
      phone: '9010024567',
      gender: 'Female',
      hire_date: '2022-02-02',
      address: 'Andhrapradesh',
      department: 7,
      status: 'active',
    };
    it('Token Not Sent', (done) => {
      chai
        .request(server)
        .post('/employees')
        .send(employeeObj)
        .end((err, response) => {
          response.should.have.status(401);
          response.body.should.be.a('object');
          response.body.should.have
            .property('error')
            .eq('please send the token');
          done();
        });
    });
    it('It should Post an employee object', (done) => {
      chai
        .request(server)
        .post('/employees')
        .send(employeeObj)
        .set({ token })
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.should.have.property('msg');
          response.body.should.have
            .property('msg')
            .eq('added employee successfully');
          done();
        });
    });
    it('Token Expired', (done) => {
      chai
        .request(server)
        .get('/employees')
        .set({ token: 'ujhgyghg' })
        .send(employeeObj)
        .end((err, response) => {
          response.should.have.status(401);
          response.body.should.be.a('object');
          response.body.should.have
            .property('error')
            .eq('invalid token/token expired');
          done();
        });
    });
    it('It should Not Post an employee object', (done) => {
      chai
        .request(server)
        .post('/employees')
        .send({})
        .set({ token })
        .end((err, response) => {
          response.should.have.status(400);
          response.body.should.be.a('object');
          response.body.should.have.property('msg');
          response.body.should.have.property('msg').eq('validation error');
          done();
        });
    });
  });

  //Testing PUT Api

  describe('PUT /employees/:id', () => {
    const employeeObj = {
      firstname: 'karunasree',
      lastname: 'ramisetty',
      email: 'kagfrunbhhha123@gmail.com',
      phone: '9010024567',
      gender: 'Female',
      hire_date: '2022-02-02',
      address: 'Andhrapradesh',
      department: 7,
      status: 'active',
    };
    it('Token Not Sent', (done) => {
      chai
        .request(server)
        .put('/employees/1')
        .send(employeeObj)
        .end((err, response) => {
          response.should.have.status(401);
          response.body.should.be.a('object');
          response.body.should.have
            .property('error')
            .eq('please send the token');
          done();
        });
    });
    it('Token Expired', (done) => {
      chai
        .request(server)
        .put('/employees/1')
        .set({ token: 'ujhgyghg' })
        .send(employeeObj)
        .end((err, response) => {
          response.should.have.status(401);
          response.body.should.be.a('object');
          response.body.should.have
            .property('error')
            .eq('invalid token/token expired');
          done();
        });
    });
    it('It should Update an employee object', (done) => {
      chai
        .request(server)
        .put('/employees/1')
        .send(employeeObj)
        .set({ token })
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.should.have.property('msg');
          response.body.should.have
            .property('msg')
            .eq('updated employee details successfully');
          done();
        });
    });
    it('It should Not Update an employee object', (done) => {
      chai
        .request(server)
        .put('/employees/1')
        .send({})
        .set({ token })
        .end((err, response) => {
          response.should.have.status(400);
          response.body.should.be.a('object');
          response.body.should.have.property('msg');
          response.body.should.have.property('msg').eq('validation error');
          done();
        });
    });
    it('Id not found', (done) => {
      chai
        .request(server)
        .put('/employees/909')
        .send(employeeObj)
        .set({ token })
        .end((err, response) => {
          response.should.have.status(400);
          response.body.should.be.a('object');
          response.body.should.have.property('msg');
          response.body.should.have
            .property('msg')
            .eq('Employee with id 909 not Found');
          done();
        });
    });
  });

  //Testing DELETE Api

  describe('DELETE /employees/:id', () => {
    it('Token Not Sent', (done) => {
      chai
        .request(server)
        .delete('/employees/3')
        .end((err, response) => {
          response.should.have.status(401);
          response.body.should.be.a('object');
          response.body.should.have
            .property('error')
            .eq('please send the token');
          done();
        });
    });
    it('Token Expired', (done) => {
      chai
        .request(server)
        .delete('/employees/3')
        .set({ token: 'ujhgyghg' })
        .end((err, response) => {
          response.should.have.status(401);
          response.body.should.be.a('object');
          response.body.should.have
            .property('error')
            .eq('invalid token/token expired');
          done();
        });
    });
    it('It should Delete an employee object', (done) => {
      chai
        .request(server)
        .delete('/employees/3')
        .set({ token })
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.should.have.property('msg');
          response.body.should.have
            .property('msg')
            .eq('deleted employee successfully');
          done();
        });
    });
    it('ID not found', (done) => {
      chai
        .request(server)
        .delete('/employees/189')
        .set({ token })
        .end((err, response) => {
          response.should.have.status(400);
          response.body.should.be.a('object');
          response.body.should.have.property('msg');
          response.body.should.have
            .property('msg')
            .eq('employee with id 189 not found');
          done();
        });
    });
  });
  describe('DELETE /employees', () => {
    it('It should Delete all employees', (done) => {
      chai
        .request(server)
        .delete('/employees')
        .set({ token })
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.should.have.property('msg');
          response.body.should.have.property('msg').eq('deleted all employees');
          done();
        });
    });
  });
});
