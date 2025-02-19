import { randomUUID } from "crypto";
import { InsertOneResult, ObjectId } from "mongodb";

import { hashtagsCollection } from "../db/db_mongo";
import { HashtagDBModel } from "../db/types/hashtag.db.entity";
import { CreateHashtagsParams } from "../types/repository/CreateHashtagsParams.type";
import { GetHashtagsParams } from "../types/repository/GetHashtagsParams.type";

export const hashtagRepository = {
  async getHashtags(dto: GetHashtagsParams): Promise<HashtagDBModel | null> {
    try {
      return await hashtagsCollection.findOne(dto);
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  async getAllHashtags(): Promise<HashtagDBModel[]> {
    try {
      return await hashtagsCollection.find().toArray();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async getTheadIdsHashtags(): Promise<number[]> {
    try {
      return await hashtagsCollection.distinct("message_thread_id");
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async createHashtags(dto: CreateHashtagsParams) {
    try {
      const insertResult: InsertOneResult<HashtagDBModel> =
        await hashtagsCollection.insertOne({
          id: randomUUID(),
          chat_id: dto.chat_id,
          message_thread_id: dto.message_thread_id,
          hashtags: dto.hashtags,
        });
      return this.getHashtagsBy_id(insertResult.insertedId);
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  async getHashtagsBy_id(_id: ObjectId): Promise<HashtagDBModel | null> {
    try {
      return await hashtagsCollection.findOne({
        _id,
      });
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  async updateHashtags(replacement: HashtagDBModel) {
    try {
      return await hashtagsCollection.findOneAndReplace(
        { id: replacement.id },
        replacement
      );
    } catch (e) {
      console.error(e);
      return null;
    }
  },
};
