require('newrelic');
import app from "./app";
import KafkaService from "./kafka";
import { initiateDB, Database } from "./models";
import { NEW_RELIC_APP_NAME, NEW_RELIC_LICENSE_KEY } from "./utils/Constants";
import logger from "./utils/Logger";


// Asynchronous function to start the server
async function startServer(): Promise<void> {
    try {
        // Initialize the database (You may want to add a comment describing what "initiateDB" does)
        await initiateDB(Database);

        await KafkaService.start()
        console.log('Kafka Connected Successfully')
        
        //Testing the NewRelic
        console.log(NEW_RELIC_APP_NAME);
        console.log(NEW_RELIC_LICENSE_KEY);

        // Synchronize the database (you may want to add options like force: true to reset the database)
        await Database.sync({ alter: true });
        console.log('Database Sync Completed')

        // Start the server and listen on port 3000
        app.listen(process.env.PORT || 3000, () => {
            logger.info("Server Started on Port 3000");
            console.log('Server Connected Successfully')
        });
    } catch (err) {
        console.error(err)
        // Log any errors that occur during server startup
        logger.error(err); 
        // Exit the process with a non-zero status code to indicate an error
        process.exit(1);
    }
}

// Call the function to start the server
startServer();