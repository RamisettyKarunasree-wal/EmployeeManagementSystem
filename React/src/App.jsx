/* eslint-disable react/jsx-no-constructed-context-values */
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useReducer } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Login from './Login';
import Home from './Home';
import EmployeesReducer from './EmployeesReducer';
import EmployeesContext from './EmployeesContext';

function App() {
  const initialState = {
    employees: [],
    expired: false,
    token: JSON.parse(localStorage.getItem('token')),
    login: JSON.parse(localStorage.getItem('isLogin')),
  };
  const [state, dispatch] = useReducer(EmployeesReducer, initialState);
  const getEmployees = async () => {
    try {
      const res = await axios.get('/employees', {
        headers: {
          token: state.token,
        },
      });
      console.log(res.data);
      dispatch({ type: 'setEmployees', employees: res.data });
    } catch (error) {
      console.log(error);
      dispatch({ status: error.response.status, error });
    }
  };
  useEffect(() => {
    if (state.login) {
      getEmployees();
    }
  }, []);
  return (
    <div className="App">
      <BrowserRouter>
        <EmployeesContext.Provider value={{ state, dispatch, getEmployees }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </EmployeesContext.Provider>
      </BrowserRouter>
    </div>
  );
}
export default App;
