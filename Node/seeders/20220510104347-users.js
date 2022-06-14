'use strict';
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
module.exports = {
  // eslint-disable-next-line no-unused-vars
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        username: 'user1user1',
        password: bcrypt.hashSync('user1user1', salt),
      },
      {
        username: 'user2user2',
        password: bcrypt.hashSync('user2user2', salt),
      },
      {
        username: 'user3user3',
        password: bcrypt.hashSync('user3user3', salt),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete('Users', {
      [Op.or]: [
        { username: 'user1user1' },
        { username: 'user2user2' },
        { username: 'user3user3' },
      ],
    });
  },
};
