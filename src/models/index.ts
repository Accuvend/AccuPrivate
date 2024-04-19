// Import necessary modules from Sequelize
import Redis from 'ioredis'
import { Dialect, DataTypes } from 'sequelize'
import { Sequelize } from 'sequelize-typescript';
import Mongoose from 'mongoose';
import { DB_CONFIG, LOG_DB_URL, MONGO_URI_LOG, REDIS_HOST, REDIS_PASSWORD, REDIS_PORT, REDIS_URL } from '../utils/Constants';
import mongoose from 'mongoose';

console.log(DB_CONFIG.URL)
// Create a new Sequelize instance for database connection and add Models
const Database = new Sequelize(DB_CONFIG.URL, {
    logging: false,
    pool: {
        max: 1000,
        min: 0,
        idle: 1000,
        acquire: 60000,
        evict: 10000,
    }
});

export const LoggerDatabase = new Sequelize(LOG_DB_URL, {
    logging: false,
    pool: {
        max: 1000,
        min: 0,
        idle: 1000,
        acquire: 60000,
        evict: 10000,
    }
});

import { join } from 'path';


// Asynchronous function to initiate the database connection
async function initiateDB(db: Sequelize): Promise<void> {
    try {
        // Attempt to authenticate the database connection
        await db.authenticate();

        // Define the path to the directory containing Sequelize models
        const modelsTSDirectory = join(__dirname, '**/*.model.ts');
        const modelsJSDirectory = join(__dirname, '**/*.model.js');

        // Define the path to the specific file you want to exclude
        const excludedTSFile = join(__dirname, '/SysLog.model.ts');
        const excludedJSFile = join(__dirname, '/SysLog.model.js');

        // Add Sequelize models from TypeScript files in the specified directory, excluding the specified file
        await db.addModels([modelsTSDirectory, `!${excludedTSFile}`]);

        // Add Sequelize models from TypeScript files in the specified directory, excluding the specified file
        await db.addModels([modelsJSDirectory, `!${excludedJSFile}`]);

        await LoggerDatabase.addModels([excludedTSFile]);
        await LoggerDatabase.addModels([excludedJSFile]);

        // Log a success message when the connection is established
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.log(error)
        // Handle errors if unable to connect to the database
        console.error('Unable to connect to the database:', error);
    }
}

// const loggerDBConnection = mongoose.createConnection(MONGO_URI_LOG)
// const loggerDB = loggerDBConnection.asPromise().then((connection) => {
//     console.log('Connection to loggerDB database successful')
//     return connection
// })

const redisClient = new Redis(REDIS_URL)
console.log(REDIS_URL)

redisClient.on('error', (error) => {
    console.log('An error occured while connecting to REDIS')
    console.error(error)
    console.error(error)
    console.log("Error is coming from redis")
    process.exit(1)
})

redisClient.on('connect', () => {
    console.log('Connection to REDIS database successful')
})

// Export Sequelize, the Database instance, the initiateDB function, and DataTypes for use in other parts of the application
export { Sequelize, Database, initiateDB, DataTypes, redisClient } //loggerDB, loggerDBConnection }
