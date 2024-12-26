import { MongoClient } from "mongodb";

import { SETTINGS } from "../settings";
import { AdminsDBModel } from "./types/admins.db.entity";
import { HashtagDBModel } from "./types/hashtag.db.entity";
import { MessageHashDBModel } from "./types/messageHash.db.entity";

const mongoUrl = SETTINGS.MONGO_URL;

export const client = new MongoClient(mongoUrl);
const db = client.db("policeBot");
export const hashtagsCollection = db.collection<HashtagDBModel>("hashtags");
export const messagesHashCollection =
  db.collection<MessageHashDBModel>("messagesHash");
export const adminsCollection = db.collection<AdminsDBModel>("admins");
export async function runDB() {
  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log("Connected to MongoDB");
  } catch (e) {
    console.error(e);
    await client.close();
  }
}
