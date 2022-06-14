import React, { useState } from 'react';
import {
  Form,
  FormText,
  FormGroup,
  Input,
  Button,
  Container,
  Row,
  Col,
  Spinner,
  Label,
} from 'reactstrap';
import { useFormik } from 'formik';
import { BsPersonLinesFill, BsFillKeyFill } from 'react-icons/bs';
import axios from 'axios';
import useLocalStorage from 'use-local-storage';
import login from './images/login.png';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [, setToken] = useLocalStorage('token', '');
  const [, setLoginUser] = useLocalStorage('loginUser', '');
  const [, setLogin] = useLocalStorage('isLogin', false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.post('/users/login', {
          username: values.username,
          password: values.password,
        });
        setToken(res.data.jwt);
        setLoginUser(res.data.user);
        setLogin(true);
        setLoginSuccess(true);
        setTimeout(() => {
          setLoading(false);
          window.location.pathname = '/';
        }, 3000);
      } catch (err) {
        setError(err.response.Error.error);
        setLoading(false);
      }
    },
    validate() {
      const errors = {};
      if (formik.values.username.length < 4) {
        errors.username = 'username should have more than 4 characters';
      }
      if (formik.values.password.length < 4) {
        errors.password = 'password should have more than 4 characters';
      }
      return errors;
    },
  });

  return (
    <Container fluid className="min-vh-100 login-page text-white">
      <h1 className="fst-italic text-decoration-underline text-center p-2">
        Employee App
      </h1>
      <Row>
        <Col
          xs={11}
          sm={10}
          md={6}
          lg={5}
          xl={4}
          className="m-auto mt-5 login-box border bg-dark shadow"
        >
          <Form className="p-5" onSubmit={formik.handleSubmit}>
            <FormGroup>
              <img
                src={login}
                alt="login user"
                height={100}
                width={100}
                className="login-logo border border-white rounded-circle p-1 bg-dark"
              />
            </FormGroup>
            <h2 className="text-center mb-4">Login</h2>
            <FormGroup className="m-1">
              <Row>
                <Col xs={2} sm={2} md={2} lg={2} xl={2} className="">
                  <BsPersonLinesFill className="bg-success icons border border-white p-1" />
                </Col>
                <Col>
                  <Input
                    type="text"
                    placeholder="Username"
                    name="username"
                    onBlur={formik.handleBlur}
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    invalid={formik.errors.username && formik.touched.username}
                    required
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  {formik.errors.username && formik.touched.username ? (
                    <FormText color="danger">{formik.errors.username}</FormText>
                  ) : null}
                </Col>
              </Row>
            </FormGroup>
            <FormGroup className="m-1">
              <Row>
                <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                  <BsFillKeyFill className="bg-success icons border border-white p-1" />
                </Col>
                <Col>
                  <Input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={formik.errors.password && formik.touched.password}
                    required
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  {formik.errors.password && formik.touched.password ? (
                    <FormText color="danger">{formik.errors.password}</FormText>
                  ) : null}
                </Col>
              </Row>
            </FormGroup>
            <FormGroup className="text-center m-1">
              <Button
                type="submit"
                color="primary"
                className="border border-secondary w-100 mt-4"
              >
                Login
              </Button>
              {loading ? (
                <div className="w-100 mt-4">
                  {loginSuccess ? (
                    <FormText>Redirecting to homepage please wait..</FormText>
                  ) : null}
                  <Spinner size="sm" type="grow" className="ml-1" />
                  <Spinner size="sm" type="grow" className="ml-1" />
                  <Spinner size="sm" type="grow" className="ml-1" />
                  <Spinner size="sm" type="grow" className="ml-1" />
                  <Spinner size="sm" type="grow" className="ml-1" />
                </div>
              ) : null}
            </FormGroup>
            <div className="text-center">
              <Label className="bg-danger text-white px-2 rounded">
                {error}
              </Label>
              {loginSuccess ? (
                <Label className="bg-success text-white px-2 rounded">
                  Login Success!
                </Label>
              ) : null}
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
