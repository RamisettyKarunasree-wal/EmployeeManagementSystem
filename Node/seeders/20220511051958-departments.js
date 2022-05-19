'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Departments', [
      {
        name: 'department1',
        manager: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'department2',
        manager: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'department3',
        manager: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op
    await queryInterface.bulkDelete('Departments', {
      [Op.or]: [
        { name: 'department1' },
        { name: 'department2' },
        { name: 'department3' },
      ],
    })
  },
}
