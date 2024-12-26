import { AdminDB, AdminsDBModel } from "../db/types/admins.db.entity";
import { adminsRepository } from "../repositories/adminsRepository";

export const AdminsService = {
  async createOrUpdateAdmins(chat_id: number, admins: Array<AdminDB>) {
    try {
      const isExist = await adminsRepository.getAdmins(chat_id);
      if (!isExist) {
        const adminsDBModel: AdminsDBModel = {
          chat_id,
          admins,
        };
        await adminsRepository.createAdmins(adminsDBModel);
      } else {
        await adminsRepository.updateAdmins(isExist);
      }
      return true;
    } catch (error) {
      console.error("Ошибка при создании администраторов:", error);
      return false;
    }
  },
};
