import { randomUUID } from "crypto";
import { InsertOneResult, ObjectId } from "mongodb";

import { messagesHashCollection } from "../db/db_mongo";
import { MessageHashDBModel } from "../db/types/messageHash.db.entity";
import { CreateMessageHashParams } from "../types/repository/CreateMessageHashParams.type";
import { GetMessageHashParams } from "../types/repository/GetMessageHashParams.type";

export const messageHashRepository = {
  async getMessageHash(
    dto: GetMessageHashParams
  ): Promise<MessageHashDBModel | null> {
    try {
      return await messagesHashCollection.findOne(dto);
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  async getAllMessagesHash(): Promise<MessageHashDBModel[]> {
    try {
      return await messagesHashCollection.find().toArray();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async updateMessageHash(replacement: MessageHashDBModel) {
    try {
      return await messagesHashCollection.findOneAndReplace(
        { id: replacement.id },
        replacement
      );
    } catch (e) {
      console.error(e);
      return null;
    }
  },
  async createMessageHash(dto: CreateMessageHashParams) {
    try {
      const insertResult: InsertOneResult<MessageHashDBModel> =
        await messagesHashCollection.insertOne({
          id: randomUUID(),
          chat_id: dto.chat_id,
          message_thread_id: dto.message_thread_id,
          message_ids: dto.message_ids,
        });
      return this.getMessageHashBy_id(insertResult.insertedId);
    } catch (e) {
      console.error(e);
      return null;
    }
  },
  async getMessageHashBy_id(_id: ObjectId): Promise<MessageHashDBModel | null> {
    try {
      return await messagesHashCollection.findOne({
        _id,
      });
    } catch (e) {
      console.error(e);
      return null;
    }
  },
};
