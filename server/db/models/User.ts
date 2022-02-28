import type { Account } from '../../api/Api.types.ts';
import db from "../mongo.ts";

export const users = db.collection<Account.User>('users');