/* eslint-disable no-console */
import mongoose from "mongoose"
import app from "./app"
import { Server } from 'http'
import { envVars } from "./app/config/env";

let server: Server;

const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URI)
        console.log('mongoose is working perfectly');

        server = app.listen(envVars.PORT, () => {
            console.log('server is running');
        })

    } catch (error) {
        console.log(error);
    }
}

startServer();

process.on("SIGTERM", (err) => {
    console.log('SIGTERM signal received. Server shutting down', err);

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    } else {
        process.exit(1);
    }
})
process.on("SIGINT", (err) => {
    console.log('SIGINT signal received. Server shutting down', err);

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    } else {
        process.exit(1);
    }
})
process.on("unhandledRejection", (err) => {
    console.log('An unhandled rejection detected. server shutting down..', err);

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    } else {
        process.exit(1);
    }
})


process.on("uncaughtException", (err) => {
    console.log('An uncaughtException rejection detected. server shutting down..', err);

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    } else {
        process.exit(1);
    }
})

/**
 * Some error
 * unhandled rejection error
 * uncaught rejection error
 * signal termination (sigterm)
 * 
*/