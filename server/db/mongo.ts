import { Bson, MongoClient, } from 'https://deno.land/x/mongo@v0.28.0/mod.ts';

import 'https://deno.land/x/dotenv@v3.2.0/load.ts';

const client = new MongoClient();

const MONGODB_CONNECTION_STRING = Deno.env.get('MONGODB_CONNECTION_STRING');
if (!MONGODB_CONNECTION_STRING) throw new Error('Environment variables not set');

await client.connect(MONGODB_CONNECTION_STRING);

const db = client.database('feedTown');

export default db;