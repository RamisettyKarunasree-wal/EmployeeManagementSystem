import React, { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import {
  Form,
  FormGroup,
  Input,
  Button,
  Label,
  FormText,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
} from 'reactstrap';
import { BsArrowLeftCircleFill } from 'react-icons/bs';
import login from './images/login.png';
import EmployeesContext from './EmployeesContext';

// eslint-disable-next-line react/prop-types
export default function AddEmployee({ setAdd }) {
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [file, setFile] = useState('');
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { state, dispatch, getEmployees } = useContext(EmployeesContext);
  const [toggle, setToggle] = useState(true);
  const getDepartments = async () => {
    try {
      const res = axios.get('/departments', {
        headers: {
          token: state.token,
        },
      });
      setDepartments(res.data);
    } catch (err) {
      if (err.response.status === 500) {
        dispatch({ status: err.response.status, error: err });
        window.location.pathname = '/';
      } else {
        console.log(err);
      }
    }
  };
  useEffect(() => {
    getDepartments();
  }, []);
  const formik = useFormik({
    initialValues: {
      image: '',
      firstname: '',
      lastname: '',
      gender: '',
      hire_date: '',
      department: '',
      email: '',
      address: '',
      phone: '',
      status: '',
    },
    onSubmit: async (values) => {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', file);
      formData.append('firstname', values.firstname);
      formData.append('lastname', values.lastname);
      formData.append('gender', values.gender);
      formData.append('hire_date', values.hire_date);
      formData.append('department', values.department);
      formData.append('status', values.status);
      formData.append('email', values.email);
      formData.append('address', values.address);
      formData.append('phone', values.phone);
      setMsg('');
      setError('');
      try {
        const res = await axios.post('/employees', formData, {
          headers: {
            token: JSON.parse(localStorage.getItem('token')),
          },
        });
        setTimeout(() => {
          setLoading(false);
          setMsg(res.data.msg);
        }, 2000);
        console.log(res.data);
        getEmployees();
      } catch (err) {
        setTimeout(() => {
          setLoading(false);
          if (err.response.status === 400) {
            if (err.response.data.errors) {
              setError(err.response.data.errors.errors[0].msg);
            } else {
              setError(err.response.data.msg);
            }
          } else {
            dispatch({ status: err.response.status, error: err });
          }
        }, 2000);
        console.log(err);
      }
    },
    validate() {
      const errors = {};
      if (formik.values.firstname.length < 5) {
        errors.firstname = 'firstname should have more than 4 characters';
      }
      if (formik.values.lastname.length < 5) {
        errors.lastname = 'lastname should have more than 4 characters';
      }
      if (formik.values.address.length < 5) {
        errors.address = 'address should have more than 4 characters';
      }
      if (formik.values.phone.toString().length !== 10) {
        errors.phone = 'phone number should have 10 digits';
      }
      if (formik.values.gender.length === 0) {
        errors.gender = 'gender required';
      }
      if (formik.values.department.length === 0) {
        errors.department = 'select department';
      }
      if (formik.values.hire_date.length === 0) {
        errors.hire_date = 'select date';
      }
      if (formik.values.email.length === 0) {
        errors.email = 'Enter Email';
      }
      if (formik.values.status.length === 0) {
        errors.status = 'Select status';
      }
      return errors;
    },
  });
  const saveFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      console.log(e.target.files[0]);
    }
  };
  const changeToggle = () => {
    if (toggle) {
      setAdd(false);
    }
    setToggle(!toggle);
  };
  return (
    <Modal isOpen={toggle} fullscreen className="h-auto">
      <Form className="p-4" onSubmit={formik.handleSubmit}>
        <ModalHeader toggle={changeToggle} className="bg-dark text-white">
          Add New Employee
        </ModalHeader>
        <ModalBody>
          <Row className="text-center mb-3">
            {loading ? (
              <Col>
                <Spinner color="primary" type="grow" />
                <Spinner color="primary" type="grow" />
                <Spinner color="primary" type="grow" />
                <Spinner color="primary" type="grow" />
                <Spinner color="primary" type="grow" />
              </Col>
            ) : (
              <Col>
                <Label className="bg-danger text-white px-2 rounded">
                  {error}
                </Label>
                <Label className="bg-success text-white px-2 rounded">
                  {msg}
                </Label>
              </Col>
            )}
          </Row>
          <Row>
            <Col xs={12} sm={12} md={12} lg={3} xl={3}>
              <Row className="m-3">
                {file ? (
                  <div>
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="preview-image"
                    />
                  </div>
                ) : (
                  <div>
                    <img src={login} alt="preview" className="preview-image" />
                  </div>
                )}
              </Row>
              <Row>
                <FormGroup>
                  <Input
                    type="file"
                    placeholder="image"
                    name="image"
                    accept="image/*"
                    onChange={saveFile}
                    onBlur={formik.handleBlur}
                    invalid={formik.errors.image}
                    required
                  />
                </FormGroup>
              </Row>
            </Col>
            <Col>
              <Row>
                <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                  <FormGroup className="m-1">
                    <Label className="fw-bold">
                      First Name
                      <sup className="text-danger">*</sup>
                    </Label>
                    <Input
                      type="text"
                      placeholder="firstname"
                      name="firstname"
                      value={formik.values.firstname}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={
                        formik.touched.firstname && formik.errors.firstname
                      }
                      required
                    />
                    {formik.touched.firstname && formik.errors.firstname && (
                      <FormText color="danger">
                        {formik.errors.firstname}
                      </FormText>
                    )}
                  </FormGroup>
                  <FormGroup className="m-1">
                    <Label className="fw-bold">
                      Last Name
                      <sup className="text-danger">*</sup>
                    </Label>
                    <Input
                      type="text"
                      placeholder="lastname"
                      name="lastname"
                      value={formik.values.lastname}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={
                        formik.errors.lastname && formik.touched.lastname
                      }
                      required
                    />
                    {formik.touched.lastname && formik.errors.lastname && (
                      <FormText color="danger">
                        {formik.errors.lastname}
                      </FormText>
                    )}
                  </FormGroup>
                  <FormGroup className="m-1">
                    <Label className="fw-bold">
                      Email
                      <sup className="text-danger">*</sup>
                    </Label>
                    <Input
                      type="email"
                      placeholder="email"
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={formik.errors.email && formik.touched.email}
                      required
                    />
                    {formik.touched.email && formik.errors.email && (
                      <FormText color="danger">{formik.errors.email}</FormText>
                    )}
                  </FormGroup>
                  <FormGroup className="m-1">
                    <Label className="fw-bold">
                      Address
                      <sup className="text-danger">*</sup>
                    </Label>
                    <Input
                      type="text"
                      placeholder="address"
                      name="address"
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={formik.errors.address && formik.touched.address}
                      required
                    />
                    {formik.touched.address && formik.errors.address && (
                      <FormText color="danger">
                        {formik.errors.address}
                      </FormText>
                    )}
                  </FormGroup>
                  <FormGroup className="m-1">
                    <Label className="fw-bold">
                      Select Status
                      <sup className="text-danger">*</sup>
                    </Label>
                    <Input
                      type="select"
                      placeholder="status"
                      name="status"
                      value={formik.values.status}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={formik.errors.status && formik.touched.status}
                      required
                    >
                      <option value="active">Active</option>
                      <option value="inactive">In Active</option>
                    </Input>
                    {formik.touched.status && formik.errors.status && (
                      <FormText color="danger">{formik.errors.status}</FormText>
                    )}
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup className="m-1">
                    <Label className="fw-bold">
                      Hire Date
                      <sup className="text-danger">*</sup>
                    </Label>
                    <Input
                      type="date"
                      placeholder="hire_date"
                      name="hire_date"
                      value={formik.values.hire_date}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={
                        formik.errors.hire_date && formik.touched.hire_date
                      }
                      required
                    />
                    {formik.touched.hire_date && formik.errors.hire_date && (
                      <FormText color="danger">
                        {formik.errors.hire_date}
                      </FormText>
                    )}
                  </FormGroup>
                  <FormGroup className="m-1">
                    <Label className="fw-bold">
                      Select Department
                      <sup className="text-danger">*</sup>
                    </Label>
                    <Input
                      type="select"
                      placeholder="department"
                      name="department"
                      value={formik.values.department}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={
                        formik.errors.department && formik.touched.department
                      }
                      required
                    >
                      {departments.map((val) => (
                        <option value={val.id}>
                          {`${val.name} - ${val.id}`}
                        </option>
                      ))}
                    </Input>
                    {formik.touched.department && formik.errors.department && (
                      <FormText color="danger">
                        {formik.errors.department}
                      </FormText>
                    )}
                  </FormGroup>
                  <FormGroup className="mx-1">
                    <Label className="fw-bold">
                      Mobile Number
                      <sup className="text-danger">*</sup>
                    </Label>
                    <Input
                      type="number"
                      placeholder="phone"
                      name="phone"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={formik.errors.phone && formik.touched.phone}
                      required
                    />
                    {formik.touched.phone && formik.errors.phone && (
                      <FormText color="danger">{formik.errors.phone}</FormText>
                    )}
                  </FormGroup>
                  <FormGroup className="m-1">
                    <Label className="fw-bold">
                      Select Gender
                      <sup className="text-danger">*</sup>
                    </Label>
                    <FormGroup>
                      <Label check className="login-icon logout-icon">
                        <Input
                          type="radio"
                          name="gender"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value="Male"
                        />
                        Male
                      </Label>
                      <Label check className="logout-icon">
                        <Input
                          type="radio"
                          name="gender"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value="Female"
                        />
                        Female
                      </Label>
                      {formik.touched.gender && formik.errors.gender && (
                        <FormText color="danger">
                          {formik.errors.gender}
                        </FormText>
                      )}
                    </FormGroup>
                  </FormGroup>
                </Col>
              </Row>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter className="bg-dark w-100">
          <Button color="danger" onClick={changeToggle}>
            <BsArrowLeftCircleFill className="login-icon" />
            Go Back
          </Button>
          <Button type="submit" color="success" className="m-auto">
            submit
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
}
