/* eslint-disable react/jsx-no-useless-fragment */
import React, { useContext } from 'react';
import { Button, Container, Col, Row, Spinner } from 'reactstrap';
import { BsBoxArrowInRight, BsPower } from 'react-icons/bs';
import company from './images/company.png';
import Employees from './Employees';
import expiredGif from './images/expired.gif';
import EmployeesContext from './EmployeesContext';

function Home() {
  const { state } = useContext(EmployeesContext);
  const toLoginPage = () => {
    localStorage.clear();
    window.location.pathname = '/login';
  };
  if (!state.login) {
    setTimeout(() => {
      window.location.pathname = '/login';
    }, 3000);
  }
  return (
    <>
      {state.login ? (
        <Container fluid className="min-vh-100">
          <Row className="bg-info p-1">
            <Col xs={9} sm={9} md={9} lg={10} xl={10} className="d-flex">
              <img src={company} alt="company-logo" className="company-logo" />
              <h2 className="my-auto text-dark fw-bold p-2 shadow rounded">
                West Agile Labs
              </h2>
            </Col>
            <Col className="d-flex">
              {state.expired ? (
                <Button
                  color="success"
                  className="m-auto"
                  onClick={toLoginPage}
                >
                  <b>
                    <BsBoxArrowInRight className="fw-bold fs-4 login-icon" />
                  </b>
                  <b className="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline">
                    Login
                  </b>
                </Button>
              ) : (
                <Button
                  color="dark"
                  className="m-auto"
                  onClick={() => {
                    // eslint-disable-next-line no-restricted-globals
                    const logout = confirm('Do you want to logout for sure?');
                    if (logout) {
                      toLoginPage();
                    }
                  }}
                >
                  <b className="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline">
                    Logout
                  </b>
                  <b>
                    <BsPower className="fw-bold fs-4 logout-icon" />
                  </b>
                </Button>
              )}
            </Col>
          </Row>
          {state.expired ? (
            <div className="d-flex">
              <img src={expiredGif} alt="expired" className="expired-gif" />
              <div className="m-auto">
                <h1>Session Expired....</h1>
                <h1>Please Login Again....</h1>
              </div>
            </div>
          ) : (
            <Employees />
          )}
        </Container>
      ) : (
        <div className="d-flex mt-5">
          <div className="m-auto">
            <h1>You have not Logged In </h1>
            <h1>PLease Login...</h1>
            <Spinner type="grow" color="primary" className="m-2" />
            <Spinner type="grow" color="primary" className="m-2" />
            <Spinner type="grow" color="primary" className="m-2" />
            <Spinner type="grow" color="primary" className="m-2" />
            <h2>Redirecting to login Page.....</h2>
          </div>
        </div>
      )}
    </>
  );
}
export default Home;
