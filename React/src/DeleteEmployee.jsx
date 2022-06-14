/* eslint-disable no-restricted-globals */
import { Button, Spinner } from 'reactstrap';
import React, { useContext, useState } from 'react';
import { BsTrashFill } from 'react-icons/bs';
import axios from 'axios';
import EmployeesContext from './EmployeesContext';

export default function DeleteEmployee(props) {
  const { dispatch, getEmployees } = useContext(EmployeesContext);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line react/prop-types
  const { id, toggle } = props;
  const deleteEmployee = async () => {
    const sure = confirm('Do you want to delete the Employee for Sure?');
    if (sure) {
      setLoading(true);
      try {
        const res = await axios.delete(`/employees/${id}`, {
          headers: {
            token: JSON.parse(localStorage.getItem('token')),
          },
        });
        setLoading(false);
        console.log(res);
        getEmployees();
        toggle();
        setTimeout(() => {
          alert(res.data.msg);
        }, 1000);
      } catch (error) {
        setLoading(false);
        if (error.response.status === 400) {
          console.log(error);
        } else {
          dispatch({ staus: error.response.status, error });
          window.location.pathname = '/';
        }
      }
    }
  };
  return (
    <Button onClick={deleteEmployee} color="danger">
      <BsTrashFill className="edit-icon" />
      Delete
      {loading ? <Spinner size="sm" className="logout-icon" /> : null}
    </Button>
  );
}
