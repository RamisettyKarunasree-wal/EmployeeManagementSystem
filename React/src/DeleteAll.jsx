/* eslint-disable no-restricted-globals */
import { Button, Spinner } from 'reactstrap';
import React, { useContext, useState } from 'react';
import { BsTrashFill } from 'react-icons/bs';
import axios from 'axios';
import EmployeesContext from './EmployeesContext';

export default function DeleteAll() {
  const { state, dispatch, getEmployees } = useContext(EmployeesContext);
  const [loading, setLoading] = useState(false);
  const deleteAll = async () => {
    const sure = confirm('Do you want to delete the Employee for Sure?');
    if (sure) {
      setLoading(true);
      await axios
        .delete('/employees', {
          headers: {
            token: state.token,
          },
        })
        .then((res) => {
          setLoading(false);
          console.log(res);
          getEmployees();
          setTimeout(() => {
            alert(res.data.msg);
          }, 1000);
        })
        .catch((error) => {
          setLoading(false);
          if (error.response.status === 400) {
            console.log(error);
          } else {
            dispatch({ staus: error.response.status, error });
            window.location.pathname = '/';
          }
        });
    }
  };
  return (
    <Button onClick={deleteAll} color="danger" className="logout-icon">
      <b>
        <BsTrashFill className="edit-icon" />
      </b>
      <b className="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline">
        Delete All
      </b>
      {loading ? <Spinner size="sm" className="logout-icon" /> : null}
    </Button>
  );
}
