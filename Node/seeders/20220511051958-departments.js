'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Departments', [
      {
        name: 'Marketing',
      },
      {
        name: 'Sales',
      },
      {
        name: 'Human Resources',
      },
      {
        name: 'Finance',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete('Departments', {
      [Op.or]: [
        { name: 'Marketing' },
        { name: 'Sales' },
        { name: 'Human Resources' },
        { name: 'Finance' },
      ],
    });
  },
};
