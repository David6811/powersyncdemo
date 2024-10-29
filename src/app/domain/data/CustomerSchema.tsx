import { column, Schema, Table } from '@powersync/web';
// OR: import { column, Schema, Table } from '@powersync/react-native';

const customers = new Table(
  {
    // id column (text) is automatically included
    _id: column.text,
    email: column.text,
    name: column.text
  },
  { indexes: {} }
);

export const AppSchema = new Schema({
  customers
});

export type Database = (typeof AppSchema)['types'];
