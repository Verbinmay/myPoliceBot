import type * as Td from "tdlib-types";

import { clientTG } from "../app";
import { cropTextForMessage } from "../helpers/cropTextForMessage";
import { GetChatMessagesResponse } from "../types/repository/GetChatMessagesResponse.type";

export const clientTGRepository = {
  async sendMessage(
    chat_id: number,
    text: string,
    message_thread_id?: number
  ): Promise<Array<Td.message> | null> {
    try {
      const texts: Array<string> = cropTextForMessage(text);

      const messages: Array<Td.message> = [];
      for (const text of texts) {
        messages.push(
          await clientTG.invoke({
            _: "sendMessage",
            chat_id,
            input_message_content: {
              _: "inputMessageText",
              text: {
                _: "formattedText",
                text,
              },
            },
            message_thread_id,
          })
        );
      }
      return messages;
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
      return null;
    }
  },
  async getChatMessages(
    chat_id: number,
    fromMessageId: number = 0,
    offset: number = 0,
    historySize: number = 100,
    onlyLocal: boolean = false
  ): Promise<GetChatMessagesResponse> {
    try {
      const response: Td.messages = await clientTG.invoke({
        _: "getChatHistory",
        chat_id,
        from_message_id: fromMessageId,
        offset: offset,
        limit: historySize,
        only_local: onlyLocal,
      });

      const messages: Td.message[] = response.messages.filter(
        (msg): msg is Td.message => msg !== null
      );

      const hasNext: boolean = messages.length > 0;
      const nextFromMessageId = hasNext ? messages[messages.length - 1].id : 0;

      return {
        messages,
        hasNext,
        nextFromMessageId,
        hasError: false,
      };
    } catch (error) {
      console.error("Ошибка при получении истории чата:", error);
      return {
        messages: [],
        hasNext: false,
        nextFromMessageId: 0,
        hasError: true,
      };
    }
  },

  async deleteMessages(
    chat_id: number,
    message_ids: Array<number>
  ): Promise<boolean> {
    try {
      await clientTG.invoke({
        _: "deleteMessages",
        chat_id,
        message_ids,
        revoke: true,
      });
      return true;
    } catch (error) {
      console.error("Ошибка при удалении сообщения:", error);
      return false;
    }
  },
  async promoteToAdmin(chatId: number, userId: number, customTitle: string) {
    try {
      const rights: Td.chatAdministratorRights = {
        _: "chatAdministratorRights",
        can_manage_chat: false,
        can_change_info: false,
        can_post_messages: false,
        can_edit_messages: false,
        can_delete_messages: false,
        can_invite_users: true,
        can_restrict_members: false,
        can_manage_topics: false,
        can_promote_members: false,
        can_manage_video_chats: false,
        can_pin_messages: false,
        can_post_stories: false,
        can_edit_stories: false,
        can_delete_stories: false,
        is_anonymous: false,
      };

      const status: Td.chatMemberStatusAdministrator = {
        _: "chatMemberStatusAdministrator",
        custom_title: customTitle,
        can_be_edited: true,
        rights: rights,
      };

      await clientTG.invoke({
        _: "setChatMemberStatus",
        chat_id: chatId,
        member_id: {
          _: "messageSenderUser",
          user_id: userId,
        },
        status: status,
      });

      return true;
    } catch (error) {
      console.error("Ошибка при назначении администратора:", error);
      return false;
    }
  },
  async getChatMessageById(
    chat_id: number,
    message_id: number
  ): Promise<Td.message | null> {
    try {
      const message: Td.message = await clientTG.invoke({
        _: "getMessage",
        chat_id,
        message_id,
      });
      return message;
    } catch (error) {
      console.error("Ошибка при получении сообщения по ID:", error);
      return null;
    }
  },
  async unsetAdmin(chatId: number, userId: number) {
    try {
      const rights: Td.chatMemberStatusMember = {
        _: "chatMemberStatusMember",
        member_until_date: 0,
      };

      await clientTG.invoke({
        _: "setChatMemberStatus",
        chat_id: chatId,
        member_id: {
          _: "messageSenderUser",
          user_id: userId,
        },
        status: rights,
      });

      return true;
    } catch (error) {
      console.error("Ошибка при удалении администратора:", error);
      return false;
    }
  },
  async muteUser(chatId: number, userId: number, timeInMinutes: number) {
    try {
      const rights: Td.chatMemberStatusRestricted = {
        _: "chatMemberStatusRestricted",
        is_member: true,
        restricted_until_date:
          Math.floor(Date.now() / 1000) + timeInMinutes * 60,
        permissions: {
          _: "chatPermissions",
          can_send_basic_messages: false,
          can_send_polls: false,
          can_send_other_messages: false,
          can_create_topics: false,
          can_send_audios: false,
          can_send_documents: false,
          can_send_photos: false,
          can_send_videos: false,
          can_send_video_notes: false,
          can_send_voice_notes: false,
          can_change_info: false,
          can_invite_users: false,
          can_pin_messages: false,
          can_add_link_previews: false,
        },
      };

      await clientTG.invoke({
        _: "setChatMemberStatus",
        chat_id: chatId,
        member_id: {
          _: "messageSenderUser",
          user_id: userId,
        },
        status: rights,
      });

      return true;
    } catch (error) {
      console.error("Ошибка при муте пользователя:", error);
      return false;
    }
  },
  async unmuteUser(chatId: number, userId: number) {
    try {
      const rights: Td.chatMemberStatusRestricted = {
        _: "chatMemberStatusRestricted",
        is_member: true,
        restricted_until_date: 0,
        permissions: {
          _: "chatPermissions",
          can_send_basic_messages: true,
          can_send_polls: true,
          can_send_other_messages: true,
          can_create_topics: true,
          can_send_audios: true,
          can_send_documents: true,
          can_send_photos: true,
          can_send_videos: true,
          can_send_video_notes: true,
          can_send_voice_notes: true,
          can_change_info: true,
          can_invite_users: true,
          can_pin_messages: true,
          can_add_link_previews: true,
        },
      };

      await clientTG.invoke({
        _: "setChatMemberStatus",
        chat_id: chatId,
        member_id: {
          _: "messageSenderUser",
          user_id: userId,
        },
        status: rights,
      });

      return true;
    } catch (error) {
      console.error("Ошибка при размуте пользователя:", error);
      return false;
    }
  },
  async getChatAdministrators(
    chatId: number
  ): Promise<Array<Td.chatAdministrator>> {
    try {
      const administrators: Td.chatAdministrators = await clientTG.invoke({
        _: "getChatAdministrators",
        chat_id: chatId,
      });
      return administrators.administrators;
    } catch (error) {
      console.error("Ошибка при получении администраторов чата:", error);
      return [];
    }
  },

  async getUser(userId: number): Promise<Td.user | null> {
    try {
      const userFullInfo: Td.user = await clientTG.invoke({
        _: "getUser",
        user_id: userId,
      });

      return userFullInfo;
    } catch (error) {
      console.error("Ошибка при получении информации о пользователе:", error);
      return null;
    }
  },
};
