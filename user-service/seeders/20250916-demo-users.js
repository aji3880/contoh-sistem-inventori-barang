'use strict';
const bcrypt = require('bcrypt');
module.exports = {
  async up(queryInterface) {
    const pw = await bcrypt.hash('password123', 10);
    await queryInterface.bulkInsert('Users', [
      { username: 'admin', email: 'admin@example.com', password: pw, role: 'admin', created_at: new Date() }
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};