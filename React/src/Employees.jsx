/* eslint-disable operator-linebreak */
/* eslint-disable implicit-arrow-linebreak */
import React, { useContext, useEffect, useState, useMemo } from 'react';
import {
  BsFillCircleFill,
  BsFillPersonPlusFill,
  BsGenderFemale,
  BsGenderMale,
  BsGeoAltFill,
  BsPencilSquare,
  BsSearch,
} from 'react-icons/bs';
import { SiGmail } from 'react-icons/si';
import { MdDialerSip } from 'react-icons/md';
import {
  Container,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from 'reactstrap';
import DataTable from 'react-data-table-component';
import EmployeesContext from './EmployeesContext';
import DeleteEmployee from './DeleteEmployee';
import AddEmployee from './AddEmployee';
import EditEmployee from './EditEmployee';
import DeleteAll from './DeleteAll';
import DeleteSelected from './DeleteSelected';

export default function Employees() {
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([]);
  const [isModalOpen, openModal] = useState(false);
  const [openedEmployee, openEmployee] = useState({});
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const { state } = useContext(EmployeesContext);
  const [selectedRows, setSelectedRows] = useState([]);
  const [clearRows, setClearRows] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const imageCell = (row) => (
    <img src={row.image} alt={row.image} className="dp m-1" />
  );
  useEffect(() => {
    setTimeout(() => {
      setColumns([
        {
          name: <b className="fs-6">Id</b>,
          selector: (row) => row.id,
          sortable: 'true',
        },
        {
          name: <b className="fs-6">Image</b>,
          selector: imageCell,
        },
        {
          name: <b className="fs-6">Firstname</b>,
          selector: (row) => row.firstname,
          sortable: 'true',
        },
        {
          name: <b className="fs-6">Lastname</b>,
          selector: (row) => row.lastname,
          sortable: 'true',
        },
        {
          name: <b className="fs-6">Email</b>,
          selector: (row) => row.email,
          sortable: 'true',
        },
        {
          name: <b className="fs-6">Gender</b>,
          selector: (row) => row.gender,
          sortable: 'true',
        },
        {
          name: <b className="fs-6">Department</b>,
          selector: (row) => row.Department.name,
          sortable: 'true',
        },
        {
          name: <b className="fs-6">Hire Date</b>,
          selector: (row) => row.hire_date,
          sortable: 'true',
        },
        {
          name: <b className="fs-6">Address</b>,
          selector: (row) => row.address,
          sortable: 'true',
        },
        {
          name: <b className="fs-6">Status</b>,
          selector: (row) => row.status,
          sortable: 'true',
        },
      ]);
      setLoading(false);
    }, 2000);
  }, []);
  const tableTitle = () => (
    <div className="d-flex justify-content-between">
      <div>Employees List</div>
      <div>
        <Button
          onClick={() => {
            setAdd(true);
          }}
        >
          <b>
            <BsFillPersonPlusFill className="edit-icon" />
          </b>
          <b className="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline">
            Add Employee
          </b>
        </Button>
        <DeleteAll />
      </div>
    </div>
  );
  const handleRows = (rows) => {
    setSelectedRows(rows.selectedRows);
  };
  const selectedEmployee = (employee) => {
    openModal(true);
    openEmployee(employee);
  };
  const toggleModal = () => {
    openModal(!isModalOpen);
  };
  const contextActions = useMemo(
    () => (
      <DeleteSelected
        selectedRows={selectedRows}
        setClearRows={setClearRows}
        clearRows={clearRows}
      />
    ),
    [selectedRows, clearRows, state.employees]
  );
  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
    };
    return (
      <Row>
        <Col sm={2} xs={2} md={2} lg={2} xl={2}>
          <Button color="success" className="login-icon">
            <BsSearch />
          </Button>
        </Col>
        <Col>
          <Input
            type="text"
            onChange={(e) => setFilterText(e.target.value)}
            onClear={handleClear}
            filterText={filterText}
            placeholder=" Search Here"
            className="border border-dark"
          />
        </Col>
      </Row>
    );
  }, [filterText, resetPaginationToggle]);
  const filteredItems = state.employees.filter(
    (item) =>
      (item.firstname &&
        item.firstname.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.lastname &&
        item.lastname.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.email &&
        item.email.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.address &&
        item.address.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.Department.name &&
        item.Department.name
          .toLowerCase()
          .includes(filterText.toLowerCase())) ||
      (item.gender &&
        item.gender.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.status &&
        item.status.toLowerCase().includes(filterText.toLowerCase()))
  );
  return (
    <Container fluid>
      <Row>
        <Col>
          <DataTable
            title={tableTitle()}
            columns={columns}
            data={filteredItems}
            pagination
            progressPending={loading}
            highlightOnHover
            onRowClicked={selectedEmployee}
            fixedHeader
            selectableRows
            onSelectedRowsChange={handleRows}
            contextActions={contextActions}
            clearSelectedRows={clearRows}
            subHeader
            subHeaderComponent={subHeaderComponentMemo}
          />
        </Col>
      </Row>
      <Modal
        scrollable
        classname="modal"
        toggle={toggleModal}
        isOpen={isModalOpen}
      >
        <ModalHeader toggle={toggleModal} className="bg-dark text-white">
          <b>{openedEmployee.firstname}</b>
        </ModalHeader>
        <ModalBody className="text-center">
          <Row className="">
            <Col
              className="d-flex m-2 mx-auto"
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
            >
              <img
                src={openedEmployee.image}
                alt={openedEmployee.image}
                className="modal-image m-auto"
              />
            </Col>
            <Col className="m-2 mx-auto">
              <div className="fw-bold m-auto fs-4">
                {`${openedEmployee.firstname} ${openedEmployee.lastname}`}
              </div>
              {isModalOpen ? (
                <div className="text-secondary">
                  {`Working as ${openedEmployee.Department.name}`}
                </div>
              ) : null}
              <div className="mt-4 fs-5">
                <b>Employee ID: </b>
                {` ${openedEmployee.id}`}
              </div>
              <div className="mt-2 fs-5">
                {openedEmployee.gender === 'Male' ? (
                  <BsGenderMale className="male" />
                ) : (
                  <BsGenderFemale className="female" />
                )}
                {` ${openedEmployee.gender}`}
              </div>
              <div className="mt-2 text-primary fs-5">
                <SiGmail className="text-danger" />
                {` ${openedEmployee.email}`}
              </div>
              <div className="mt-2 text-primary fs-5">
                <MdDialerSip className="text-success" />
                {` ${openedEmployee.phone}`}
              </div>
              <div className="mt-2 fs-5">
                <BsGeoAltFill className="text-danger fw-bold" />
                {` Native - ${openedEmployee.address}`}
              </div>
              <div className="mt-2 fs-5">
                <BsFillCircleFill className="text-success fw-bold" />
                {` ${openedEmployee.status}`}
              </div>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter className="bg-dark">
          <Button
            color="info"
            onClick={() => {
              setEdit(true);
            }}
          >
            <BsPencilSquare className="edit-icon" />
            Edit
          </Button>
          <DeleteEmployee id={openedEmployee.id} toggle={toggleModal} />
          <Button color="warning" onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      {add ? <AddEmployee add={add} setAdd={setAdd} /> : null}
      {edit ? (
        <EditEmployee
          edit={edit}
          setEdit={setEdit}
          employee={openedEmployee}
          parentToggle={toggleModal}
        />
      ) : null}
    </Container>
  );
}
