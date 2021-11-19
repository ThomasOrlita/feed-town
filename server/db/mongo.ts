import { Bson, MongoClient,  } from 'https://deno.land/x/mongo@v0.27.0/mod.ts';

import { config } from 'https://deno.land/x/dotenv@v3.0.0/mod.ts';

const env = config({ safe: true });

const client = new MongoClient();

await client.connect(env.MONGODB_CONNECTION_STRING);

const db = client.database('feedTown');

export default db;