/* eslint-disable react/prop-types */
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
import EmployeesContext from './EmployeesContext';

export default function EditEmployee({ setEdit, employee, parentToggle }) {
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [file, setFile] = useState();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { state, dispatch, getEmployees } = useContext(EmployeesContext);
  const [toggle, setToggle] = useState(true);
  const [department, setDepartment] = useState(employee.department);
  const [gender, setGender] = useState(employee.gender);
  const [date, setDate] = useState(null);
  const getDepartments = async () => {
    axios
      .get('/departments', {
        headers: {
          token: state.token,
        },
      })
      .then((res) => {
        setDepartments(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        dispatch({ status: error.response.status, error: err });
      });
  };
  useEffect(() => {
    const d = employee.hire_date;
    const dateString = d.substring(0, 10);
    setDate(dateString);
    getDepartments();
  }, []);
  const formik = useFormik({
    initialValues: {
      image: file,
      firstname: employee.firstname,
      lastname: employee.lastname,
      hire_date: employee.hire_date,
      email: employee.email,
      address: employee.address,
      phone: employee.phone,
      status: employee.status,
    },
    onSubmit: async (values) => {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', file);
      formData.append('firstname', values.firstname);
      formData.append('lastname', values.lastname);
      formData.append('gender', gender);
      formData.append('hire_date', date);
      formData.append('department', Number(department));
      formData.append('email', values.email);
      formData.append('address', values.address);
      formData.append('phone', values.phone);
      formData.append('status', values.status);
      setMsg('');
      setError('');
      try {
        const res = await axios.put(
          `/employees/${Number(employee.id)}`,
          formData,
          {
            headers: {
              token: JSON.parse(localStorage.getItem('token')),
            },
          }
        );
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
            window.location.pathname = '/';
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
      if (gender.length === 0) {
        errors.gender = 'gender required';
      }
      if (department.length === 0) {
        errors.department = 'select department';
      }
      if (date.length === 0) {
        errors.hire_date = 'select date';
      }
      if (formik.values.email.length === 0) {
        errors.email = 'Enter Email';
      }
      if (formik.values.status.length === 0) {
        errors.status = 'Select Status';
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
      setEdit(false);
    }
    setToggle(!toggle);
  };
  // const removeFile = () => {
  //   setFile();
  // };
  return (
    <Modal isOpen={toggle} fullscreen className="h-auto">
      <Form className="p-4" onSubmit={formik.handleSubmit}>
        <ModalHeader toggle={changeToggle} className="bg-dark text-white">
          {`Edit Employee Details - ${employee.id}`}
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
                    <img
                      src={employee.image}
                      alt="preview"
                      className="preview-image"
                    />
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
                      onBlur={formik.handleBlur}
                      type="text"
                      placeholder="firstname"
                      name="firstname"
                      value={formik.values.firstname}
                      onChange={formik.handleChange}
                      invalid={
                        formik.errors.firstname && formik.touched.firstname
                      }
                      required
                    />
                    {formik.errors.firstname && formik.touched.firstname ? (
                      <FormText color="danger">
                        {formik.errors.firstname}
                      </FormText>
                    ) : null}
                  </FormGroup>
                  <FormGroup className="m-1">
                    <Label className="fw-bold">
                      Last Name
                      <sup className="text-danger">*</sup>
                    </Label>
                    <Input
                      onBlur={formik.handleBlur}
                      type="text"
                      placeholder="lastname"
                      name="lastname"
                      value={formik.values.lastname}
                      onChange={formik.handleChange}
                      invalid={
                        formik.errors.lastname && formik.touched.lastname
                      }
                      required
                    />
                    {formik.errors.lastname && formik.touched.lastname ? (
                      <FormText color="danger">
                        {formik.errors.lastname}
                      </FormText>
                    ) : null}
                  </FormGroup>
                  <FormGroup className="m-1">
                    <Label className="fw-bold">
                      Email
                      <sup className="text-danger">*</sup>
                    </Label>
                    <Input
                      onBlur={formik.handleBlur}
                      type="email"
                      placeholder="email"
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      invalid={formik.errors.email && formik.touched.email}
                      required
                    />
                    {formik.errors.email && formik.touched.email ? (
                      <FormText color="danger">{formik.errors.email}</FormText>
                    ) : null}
                  </FormGroup>
                  <FormGroup className="m-1">
                    <Label className="fw-bold">
                      Address
                      <sup className="text-danger">*</sup>
                    </Label>
                    <Input
                      onBlur={formik.handleBlur}
                      type="text"
                      placeholder="address"
                      name="address"
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      invalid={formik.errors.address && formik.touched.address}
                      required
                    />
                    {formik.errors.address && formik.touched.address ? (
                      <FormText color="danger">
                        {formik.errors.address}
                      </FormText>
                    ) : null}
                  </FormGroup>
                  <FormGroup className="m-1">
                    <Label className="fw-bold">
                      Select Department
                      <sup className="text-danger">*</sup>
                    </Label>
                    <Input
                      onBlur={formik.handleBlur}
                      type="select"
                      placeholder="status"
                      name="status"
                      value={formik.values.status}
                      onChange={formik.handleChange}
                      invalid={formik.errors.status && formik.touched.status}
                      required
                    >
                      <option value="active">Active</option>
                      <option value="inactive">In Active</option>
                    </Input>
                    {formik.errors.status ? (
                      <FormText color="danger">{formik.errors.status}</FormText>
                    ) : null}
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup className="m-1">
                    <Label className="fw-bold">
                      Hire Date
                      <sup className="text-danger">*</sup>
                    </Label>
                    <Input
                      onBlur={formik.handleBlur}
                      id="date"
                      type="date"
                      placeholder="hire_date"
                      name="hire_date"
                      value={date}
                      onChange={(e) => {
                        setDate(e.target.value);
                      }}
                      invalid={
                        formik.errors.hire_date && formik.touched.hire_date
                      }
                      required
                    />
                    {formik.errors.address && formik.touched.address ? (
                      <FormText color="danger">
                        {formik.errors.hire_date}
                      </FormText>
                    ) : null}
                  </FormGroup>
                  <FormGroup className="m-1">
                    <Label className="fw-bold">
                      Select Department
                      <sup className="text-danger">*</sup>
                    </Label>
                    <Input
                      onBlur={formik.handleBlur}
                      type="select"
                      placeholder="department"
                      name="department"
                      onChange={(e) => {
                        setDepartment(e.target.value);
                      }}
                      invalid={
                        formik.errors.department && formik.touched.department
                      }
                      required
                    >
                      {departments.map((val) => (
                        <option value={val.id} selected={val.id === department}>
                          {`${val.name} - ${val.id}`}
                        </option>
                      ))}
                    </Input>
                    {formik.errors.department ? (
                      <FormText color="danger">
                        {formik.errors.department}
                      </FormText>
                    ) : null}
                  </FormGroup>
                  <FormGroup className="mx-1">
                    <Label className="fw-bold">
                      Mobile Number
                      <sup className="text-danger">*</sup>
                    </Label>
                    <Input
                      onBlur={formik.handleBlur}
                      type="number"
                      placeholder="phone"
                      name="phone"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      invalid={formik.errors.phone && formik.touched.phone}
                      required
                    />
                    {formik.errors.phone && formik.touched.phone ? (
                      <FormText color="danger">{formik.errors.phone}</FormText>
                    ) : null}
                  </FormGroup>
                  <FormGroup className="m-1">
                    <Label className="fw-bold">
                      Select Gender
                      <sup className="text-danger">*</sup>
                    </Label>
                    <FormGroup>
                      <Label check className="login-icon logout-icon">
                        <Input
                          onBlur={formik.handleBlur}
                          type="radio"
                          name="gender"
                          value="Male"
                          onChange={(e) => {
                            setGender(e.target.value);
                            console.log(e.target.value);
                          }}
                          checked={gender === 'Male'}
                        />
                        Male
                      </Label>
                      <Label check className="logout-icon">
                        <Input
                          onBlur={formik.handleBlur}
                          type="radio"
                          name="gender"
                          onChange={(e) => {
                            setGender(e.target.value);
                          }}
                          value="Female"
                          checked={gender === 'Female'}
                        />
                        Female
                      </Label>
                      {formik.errors.gender ? (
                        <div>
                          <FormText color="danger">
                            {formik.errors.gender}
                          </FormText>
                        </div>
                      ) : null}
                    </FormGroup>
                  </FormGroup>
                </Col>
              </Row>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter className="bg-dark">
          <Button
            color="danger"
            onClick={() => {
              changeToggle();
              parentToggle();
            }}
          >
            <BsArrowLeftCircleFill className="login-icon" />
            Go Back
          </Button>
          <Button type="submit" color="primary" className="m-auto">
            Save Changes
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
}
