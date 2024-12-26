import { adminsCollection } from "../db/db_mongo";
import { AdminsDBModel } from "../db/types/admins.db.entity";

export const adminsRepository = {
  async getAdmins(chat_id: number): Promise<AdminsDBModel | null> {
    try {
      return await adminsCollection.findOne({ chat_id });
    } catch (e) {
      console.error(e);
      return null;
    }
  },
  async createAdmins(dto: AdminsDBModel) {
    try {
      await adminsCollection.insertOne(dto);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },
  async updateAdmins(
    replacement: AdminsDBModel
  ): Promise<AdminsDBModel | null> {
    try {
      return await adminsCollection.findOneAndReplace(
        { chat_id: replacement.chat_id },
        replacement
      );
    } catch (e) {
      console.error(e);
      return null;
    }
  },
};
