// 0 20 * * *
//*/5 * * * * *
const schedule = require('node-schedule');
const Employee = require('../models').Employee;
exports.runSchedule = () => {
  //deleting employees everyday at 8 pm
  schedule.scheduleJob('deleteInactiveEmployees', '0 20 * * *', async () => {
    try {
      await Employee.destroy({ where: { status: 'inactive' } });
    } catch (err) {
      console.log(err);
    }
    console.log('delete inactive Employees schedule running....');
  });
  return true;
};
