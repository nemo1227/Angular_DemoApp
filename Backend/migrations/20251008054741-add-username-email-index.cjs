'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addIndex("Users", ["username"], {
      unique: true,
      name: "idx_username"
    }); //Adds a unique index on 'username' column.

    await queryInterface.addIndex("Users", ["email"], {
      unique: true,
      name: "idx_email"
    }); //Adds a unique index on 'email' column.
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("Users", "idx_username");
    await queryInterface.removeIndex("Users", "idx_email");
  }
};

