import { AbstractPowerSyncDatabase, PowerSyncDatabase } from "@powersync/web";
import { AppSchema } from "../domain/data/CustomerSchema";
import { POWERSYNC_ENDPOINT, POWERSYNC_TOKEN } from "../config/_powersyncConfig";
import { Customers } from "../domain/data/interfaces";
import { generateObjectId } from "../domain/calculations/generators";

export const findAllData = async (): Promise<Customers[]> => {
    const result = await db.getAll('SELECT * FROM customers');
    return result as Customers[];
};

export const addCustomerToLocalDB = async (name: string, email: string) => {
    const uni_id = generateObjectId();
    const id = uni_id;
    const _id = uni_id;

    await db.execute(
        'INSERT INTO customers(id, _id, name, email) VALUES(?, ?, ?, ?)',
        [id, _id, name, email]
    );
};

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
