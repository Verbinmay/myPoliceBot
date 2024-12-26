import { WithId } from "mongodb";

import { MessageHashDBModel } from "../db/types/messageHash.db.entity";
import { messageHashRepository } from "../repositories/messagesHashRepository";
import { UpdateMessageHashParams } from "../types/repository/UpdateMessageHashParams.type";

export const messageHashService = {
  async updateOrCreateMessageHash(dto: UpdateMessageHashParams) {
    try {
      let messageHashInDb: MessageHashDBModel | null =
        await messageHashRepository.getMessageHash({
          chat_id: dto.chat_id,
          message_thread_id: dto.message_thread_id,
        });

      if (!messageHashInDb) {
        messageHashInDb = await messageHashRepository.createMessageHash({
          chat_id: dto.chat_id,
          message_thread_id: dto.message_thread_id,
          message_ids: dto.message_ids,
        });
      }

      if (messageHashInDb === null) {
        return null;
      }

      messageHashInDb.message_ids = dto.message_ids;

      const responseMessageHash: WithId<MessageHashDBModel> | null =
        await messageHashRepository.updateMessageHash(messageHashInDb);

      return responseMessageHash?.message_ids ?? null;
    } catch (e) {
      console.error(e);
      return null;
    }
  },
};
