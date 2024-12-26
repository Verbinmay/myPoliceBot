import type * as Td from "tdlib-types";

import { HashtagDBModel } from "../db/types/hashtag.db.entity";
import { MessageHashDBModel } from "../db/types/messageHash.db.entity";
import { alphabetSortingHashtagsViewer } from "../helpers/alphabetSortingHashtagsViewer";
import { getHashtagsFromMessagesClient } from "../helpers/getHashtagsFromMessagesClient";
import { clientTGRepository } from "../repositories/clientTGRepository";
import { hashtagRepository } from "../repositories/hashtagRepository";
import { messageHashRepository } from "../repositories/messagesHashRepository";
import { GetChatMessagesResponse } from "../types/repository/GetChatMessagesResponse.type";
import { hashtagService } from "./hashtagService";
import { messageHashService } from "./messageHashService";

export const clientTGService = {
  async getHistoryAndUpdateHashtags(
    chat_id: number,
    message_thread_id: number,
    nextFromMessageId: number
  ): Promise<string[] | null> {
    try {
      const response: GetChatMessagesResponse =
        await clientTGRepository.getChatMessages(chat_id, nextFromMessageId);

      if (response.hasError) {
        console.log("Ошибка при получении истории чата");
        return null;
      }

      let allHashtagsInDb: string[] | null =
        await this.getHashtagsFromMessagesAndSave(
          chat_id,
          message_thread_id,
          response.messages
        );

      if (response.hasNext) {
        return await this.getHistoryAndUpdateHashtags(
          chat_id,
          message_thread_id,
          response.nextFromMessageId
        );
      }
      return allHashtagsInDb;
    } catch (e) {
      console.log(e);
      return null;
    }
  },

  async getHashtagsFromMessagesAndSave(
    chat_id: number,
    message_thread_id: number,
    messages: Array<Td.message>
  ): Promise<string[] | null> {
    try {
      const hashtags: string[] | null = getHashtagsFromMessagesClient(
        messages,
        message_thread_id
      );

      if (!hashtags) return null;

      let allHashtagsInDb: string[] | null =
        await hashtagService.updateOrCreateHashtag({
          chat_id,
          message_thread_id,
          hashtags,
        });

      return allHashtagsInDb;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
  async updateChatsMessages() {
    try {
      const messagesHash: MessageHashDBModel[] =
        await messageHashRepository.getAllMessagesHash();
      if (messagesHash.length === 0) {
        return false;
      }
      for (const messageHash of messagesHash) {
        const chat_id = messageHash.chat_id;
        const message_thread_id = messageHash.message_thread_id;

        await clientTGRepository.deleteMessages(
          chat_id,
          messageHash.message_ids
        );

        const hashtags: HashtagDBModel | null =
          await hashtagRepository.getHashtags({
            chat_id,
            message_thread_id,
          });
        if (!hashtags) {
          continue;
        }

        const text = alphabetSortingHashtagsViewer(hashtags.hashtags);

        if (!text) {
          continue;
        }

        const messages: Array<Td.message> | null =
          await clientTGRepository.sendMessage(
            chat_id,
            text,
            message_thread_id
          );

        await messageHashService.updateOrCreateMessageHash({
          chat_id,
          message_thread_id,
          message_ids: messages?.map((message) => message.id) ?? [],
        });
      }
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
};
