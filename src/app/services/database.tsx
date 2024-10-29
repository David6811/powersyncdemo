import { AbstractPowerSyncDatabase, PowerSyncDatabase } from "@powersync/web";
import { AppSchema } from "../domain/data/CustomerSchema";
import { POWERSYNC_ENDPOINT, POWERSYNC_TOKEN } from "../config/_powersyncConfig";

class Connector {
    constructor() {
        // Setup a connection to your server for uploads
        //this.serverConnectionClient = TODO; 
    }
    async fetchCredentials() {
        return {
            endpoint: POWERSYNC_ENDPOINT,
            token: POWERSYNC_TOKEN
        };
    }

    async uploadData(database: AbstractPowerSyncDatabase) { //AbstractPowerSyncDatabase
        console.log("Trying to upload data to server...", database);
    }
}

export const db = new PowerSyncDatabase({
    schema: AppSchema,
    database: {
        dbFilename: 'customers.db'
    },
    flags: {
        enableMultiTabs: true
    }
});

export const setupPowerSync = async () => {
    const connector = new Connector();
    db.connect(connector);
};
