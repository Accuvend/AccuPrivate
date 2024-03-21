'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */

        // Add bundleRelation to transaction as bundleId, it should be optional and it should relate with bunlde table
        await queryInterface.addColumn('transaction', 'bundleId', {
            type: Sequelize.STRING,
            references: {
                model: 'bundles',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        });
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.removeColumn('transaction', 'bundleId');
    }
};
