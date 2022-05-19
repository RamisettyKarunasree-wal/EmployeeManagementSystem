'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Managers', [
      {
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'manager1',
        address: 'Hyderabad',
        email: 'manager1@gmail.com',
        phone: 9010024567,
        experience: '2 years',
      },
      {
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'manager2',
        address: 'Bangalore',
        email: 'manager2@gmail.com',
        phone: 9010024569,
        experience: '3 years',
      },
      {
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'manager3',
        address: 'Pune',
        email: 'manager3@gmail.com',
        phone: 9010024597,
        experience: '5 years',
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op
    await queryInterface.bulkDelete('Managers', {
      [Op.or]: [
        { name: 'manager1' },
        { name: 'manager2' },
        { name: 'manager3' },
      ],
    })
  },
}
