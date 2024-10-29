import { AbstractPowerSyncDatabase, PowerSyncDatabase } from "@powersync/web";
import { AppSchema } from "../domain/data/CustomerSchema";
import { POWERSYNC_ENDPOINT, POWERSYNC_TOKEN } from "../config/_powersyncConfig";
import { Customers } from "../domain/data/interfaces";
import { generateObjectId } from "../domain/calculations/generators";
import { saveCustomerToMongo } from "./MongoDBService";

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
        const transaction = await database.getNextCrudTransaction();
        if (!transaction) {
            console.log("No transactions!");
            return;
        }

        for (const operation of transaction.crud) {
            const { op: opType, table } = operation;
            console.log("op", { op: opType, table });
            const { _id, name, email } = operation.opData || {};
            console.log("!!operation: ", operation.opData);
            if (opType == "PUT") { saveCustomerToMongo(_id, name, email); }
        }
        await transaction.complete();
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
