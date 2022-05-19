export default function EmployeesReducer(state, action) {
  if (action.type === 'setEmployees') {
    return {
      employees: action.employees,
      expired: false,
      token: state.token,
      login: state.login,
    };
  }
  if (action.status === 401) {
    console.log(action.error.response.data);
    return { employees: [], expired: true, token: '', login: state.login };
  }
}
