import { AbstractPowerSyncDatabase, PowerSyncDatabase } from "@powersync/web";
import { AppSchema } from "../domain/data/CustomerSchema";
import { POWERSYNC_ENDPOINT, POWERSYNC_TOKEN } from "../config/_powersyncConfig";
import { Customers } from "../domain/data/interfaces";
import { generateObjectId } from "../domain/calculations/generators";
import { deleteCustomerFromMongo, saveCustomerToMongo } from "./MongoDBService";

export const findAllData = async (): Promise<Customers[]> => {
    const result = await db.getAll('SELECT * FROM customers');
    console.log("Result: ", result)
    return result as Customers[];
};

export const addCustomerToLocalDB = async (name: string, email: string) => {
    const uni_id = generateObjectId();
    await db.execute(
        'INSERT INTO customers(id, _id, name, email) VALUES(?, ?, ?, ?)',
        [uni_id, uni_id, name, email]
    );
};


export const deleteCustomerFromLocalDB = async (id: string) => {
    const result = await db.execute(
        'DELETE FROM customers WHERE id = ?',
        [id]
    );
    return result;
};


export class Connector {
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
            // console.log("opData: ", operation.opData);
            if (opType == "PUT") { 
                saveCustomerToMongo(_id, name, email); 
                console.log("saveing customer remotely...");
            }
            if (opType === "DELETE") {
                deleteCustomerFromMongo(operation.id);
                console.log("deleting customer remotely...");
            }
        }
        await transaction.complete();
    }
}

export const db = new PowerSyncDatabase({
    schema: AppSchema,
    database: {
        dbFilename: 'powersync.db'
    },
    flags: {
        enableMultiTabs: true
    }
});

export const setupPowerSync = async () => {
    const connector = new Connector();
    db.connect(connector);
};
