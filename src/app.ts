// Import required modules and dependencies
import express, { Request, Response } from "express";
import { Database , initiateDB } from "./models";
import bodyParser from "body-parser";
import cors from 'cors';
import { router as VendorRoute } from "./routes/Public/Vendor.routes";
import { BAXI_TOKEN } from "./utils/constatnts";

// Create an Express application
const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

// Define a route for health checks
app.get('/healthcheck', async (req: Request, res: Response) => {
    // Respond with a JSON message indicating server status
    res.status(200).json({
        status: "success",
        message: "Server is working",
    });
});

app.use('/api/v0',VendorRoute)

// Asynchronous function to start the server
async function startServer(): Promise<void> {
    try {
        // Initialize the database (You may want to add a comment describing what "initiateDB" does)
        await initiateDB(Database);

        // Synchronize the database (you may want to add options like force: true to reset the database)
        await Database.sync();

        // Start the server and listen on port 3000
        app.listen(3000, () => {
            console.log("Server Started on Port 3000");
        });
    } catch (err) {
        // Log any errors that occur during server startup
        console.error(err);
        // Exit the process with a non-zero status code to indicate an error
        process.exit(1);
    }
}

// Call the function to start the server
startServer();
