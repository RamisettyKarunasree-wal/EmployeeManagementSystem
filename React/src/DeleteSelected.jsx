/* eslint-disable no-restricted-globals */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/prop-types */
import { Button, Spinner } from 'reactstrap';
import React, { useContext, useState } from 'react';
import { BsTrashFill } from 'react-icons/bs';
import axios from 'axios';
import EmployeesContext from './EmployeesContext';

export default function DeleteSelected({
  selectedRows,
  setClearRows,
  clearRows,
}) {
  console.log(selectedRows);
  const { state, dispatch, getEmployees } = useContext(EmployeesContext);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line react/prop-types
  const deleteSingle = async (id) => {
    setLoading(true);
    try {
      const res = await axios.delete(`/employees/${Number(id)}`, {
        headers: {
          token: state.token,
        },
      });
      setLoading(false);
      getEmployees();
      console.log(res);
    } catch (error) {
      setLoading(false);
      if (error.response.status === 400) {
        console.log(error);
      } else {
        dispatch({ staus: error.response.status, error });
        window.location.pathname = '/';
      }
    }
  };
  const deleteBulk = async () => {
    const sure = confirm('Do you want to delete the selcted Employees?');
    if (sure) {
      for (const i in selectedRows) {
        deleteSingle(selectedRows[i].id);
      }
      setTimeout(() => {
        setClearRows(!clearRows);
        alert('Deleted selected Employees successfully');
      }, 2000);
    }
  };
  return (
    <Button onClick={deleteBulk} color="warning">
      <BsTrashFill className="edit-icon" />
      {loading ? <Spinner size="sm" className="logout-icon" /> : null}
    </Button>
  );
}
