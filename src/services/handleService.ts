import type * as Td from "tdlib-types";

import { AdminDB, AdminsDBModel } from "../db/types/admins.db.entity";
import { HashtagDBModel } from "../db/types/hashtag.db.entity";
import { alphabetSortingHashtagsViewer } from "../helpers/alphabetSortingHashtagsViewer";
import { adminsRepository } from "../repositories/adminsRepository";
import { clientTGRepository } from "../repositories/clientTGRepository";
import { hashtagRepository } from "../repositories/hashtagRepository";
import { SETTINGS } from "../settings";
import { AdminsService } from "./adminsService";
import { clientTGService } from "./clientTGService";
import { messageHashService } from "./messageHashService";

async function checkAdmin(
  info: Td.MessageSender,
  chat_id: number
): Promise<boolean> {
  try {
    const userId: number = "user_id" in info ? info.user_id : 0;
    if (SETTINGS.ADMIN_ID.includes(userId)) return true;
    const moders: AdminsDBModel | null = await adminsRepository.getAdmins(
      chat_id
    );
    if (!moders) return false;

    const modersIds: number[] = moders.admins.map((moder) => moder.user_id);
    return modersIds.includes(userId);
  } catch (e) {
    console.log(e);
    return false;
  }
}
async function getUserIdFromMessage(
  chat_id: number,
  message: Td.message
): Promise<number | null> {
  try {
    const message_id =
      (message.reply_to as Td.messageReplyToMessage).message_id ?? 1;
    const userMessage = await clientTGRepository.getChatMessageById(
      chat_id,
      message_id
    );
    return (userMessage?.sender_id as Td.messageSenderUser)?.user_id ?? null;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export const handleService = {
  async handleGetCommand(message: Td.message) {
    try {
      const chat_id: number = message.chat_id;
      if (!(await checkAdmin(message.sender_id, chat_id))) {
        return false;
      }

      const message_thread_id: number = message.message_thread_id;
      await clientTGRepository.sendMessage(
        chat_id,
        "Fetching hashtags...",
        message_thread_id
      );

      const hashtags: string[] | null =
        await clientTGService.getHistoryAndUpdateHashtags(
          chat_id,
          message_thread_id,
          0
        );

      const text = hashtags
        ? alphabetSortingHashtagsViewer(hashtags)
        : "No hashtags found";

      if (!text) return false;
      const messages: Array<Td.message> | null =
        await clientTGRepository.sendMessage(chat_id, text, message_thread_id);

      if (messages && hashtags) {
        await messageHashService.updateOrCreateMessageHash({
          chat_id,
          message_thread_id,
          message_ids: messages.map((message) => message.id),
        });
      }
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },

  async handleUpdateHashtagsCommand(message: Td.message) {
    try {
      const chat_id: number = message.chat_id;
      if (!(await checkAdmin(message.sender_id, chat_id))) {
        return false;
      }
      return await clientTGService.updateChatsMessages();
    } catch (e) {
      console.log(e);
      return false;
    }
  },

  async handleHashtagsFromNewMessage(message: Td.message) {
    try {
      const allTreadsHashtags: HashtagDBModel[] =
        await hashtagRepository.getAllHashtags();

      const treads: Array<number> = allTreadsHashtags.map(
        (thread) => thread.message_thread_id
      );

      if (!treads.includes(message.message_thread_id)) {
        return false;
      }

      await clientTGService.getHashtagsFromMessagesAndSave(
        message.chat_id,
        message.message_thread_id,
        [message]
      );
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  async handleSetAdminCommand(message: Td.message) {
    try {
      const chat_id: number = message.chat_id;
      if (!(await checkAdmin(message.sender_id, chat_id))) {
        return false;
      }

      const user_id: number | null = await getUserIdFromMessage(
        chat_id,
        message
      );
      if (!user_id) return false;
      const text: string = (message.content as Td.messageText).text.text;

      const info = text.split(" ");
      let customTitle = "товарищ";
      if (info.length >= 2) {
        const [, ...rest] = text.split(" ");
        customTitle = rest.join(" ");
      }

      const result: boolean = await clientTGRepository.promoteToAdmin(
        chat_id,
        user_id,
        customTitle
      );

      if (result) {
        await clientTGRepository.sendMessage(
          chat_id,
          "Пользователь успешно назначен администратором",
          message.message_thread_id
        );
      }
      return result;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  async handleUnsetAdminCommand(message: Td.message) {
    try {
      const chat_id: number = message.chat_id;
      if (!(await checkAdmin(message.sender_id, chat_id))) {
        return false;
      }
      const user_id: number | null = await getUserIdFromMessage(
        chat_id,
        message
      );
      if (!user_id) return false;

      const result: boolean = await clientTGRepository.unsetAdmin(
        chat_id,
        user_id
      );

      if (result) {
        await clientTGRepository.sendMessage(
          chat_id,
          "Пользователь успешно снят с прав администратора",
          message.message_thread_id
        );
      }
      return result;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  async handleMuteCommand(message: Td.message) {
    try {
      const chat_id: number = message.chat_id;
      if (!(await checkAdmin(message.sender_id, chat_id))) {
        return false;
      }
      const user_id: number | null = await getUserIdFromMessage(
        chat_id,
        message
      );

      if (!user_id) return false;

      const text: string = (message.content as Td.messageText).text.text;

      const info = text.split(" ");
      if (info.length < 2) return false;
      const timeInMinutes = Number(info[1]);

      const checkNumber = !isNaN(timeInMinutes);
      if (!checkNumber) return false;

      const result: boolean = await clientTGRepository.muteUser(
        chat_id,
        user_id,
        timeInMinutes
      );

      if (result) {
        await clientTGRepository.sendMessage(
          chat_id,
          "Пользователь успешно замучен",
          message.message_thread_id
        );
      }
      return result;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  async handleUnmuteCommand(message: Td.message) {
    try {
      const chat_id: number = message.chat_id;
      if (!(await checkAdmin(message.sender_id, chat_id))) {
        return false;
      }
      const user_id: number | null = await getUserIdFromMessage(
        chat_id,
        message
      );
      if (!user_id) return false;

      const result: boolean = await clientTGRepository.unmuteUser(
        chat_id,
        user_id
      );

      if (result) {
        await clientTGRepository.sendMessage(
          chat_id,
          "Пользователь успешно размучен",
          message.message_thread_id
        );
      }
      return result;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  async handleGetAdminsCommand(message: Td.message) {
    try {
      const chat_id: number = message.chat_id;
      if (!(await checkAdmin(message.sender_id, chat_id))) {
        return false;
      }
      const admins: Array<Td.chatAdministrator> =
        await clientTGRepository.getChatAdministrators(chat_id);
      const newAdmins: Array<AdminDB> = [];
      for (const admin of admins) {
        if (!admin.user_id) {
          continue;
        }

        const user: Td.user | null = await clientTGRepository.getUser(
          admin.user_id
        );
        if (!user) {
          continue;
        }
        const usernames: Array<string> = user.usernames?.active_usernames ?? [];
        for (const username of usernames) {
          if (SETTINGS.MODERATORS_USERNAME.includes(username)) {
            newAdmins.push({ user_id: admin.user_id, user_name: username });
          }
        }
      }
      if (newAdmins.length > 0) {
        await AdminsService.createOrUpdateAdmins(chat_id, newAdmins);
      }
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  async handleDeleteCommand(message: Td.message) {
    try {
      const text = (message.content as Td.messageText).text.text;
      if (!text) return false;
      const info = text.split(" ");
      if (info.length < 2) return false;
      const hash = info[1].slice(1);

      const chat_id: number = message.chat_id;
      if (!(await checkAdmin(message.sender_id, chat_id))) {
        return false;
      }

      const hashtags: HashtagDBModel | null =
        await hashtagRepository.getHashtags({
          chat_id,
          message_thread_id: message.message_thread_id,
        });
      if (!hashtags) return false;

      hashtags.hashtags = hashtags.hashtags.filter(
        (hashtag) => hashtag !== hash
      );

      const newHash = await hashtagRepository.updateHashtags(hashtags);
      if (!newHash) return false;
      await clientTGRepository.sendMessage(
        chat_id,
        `Хештег: ${hash} успешно удален`,
        message.message_thread_id
      );

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  async handleHelpCommand(message: Td.message) {
    try {
      const chat_id: number = message.chat_id;
      const text = `
/help - список команд
Admin commands:
/get - получить все хештеги из чата (нет)
/updateHashtags - обновить сообщение со всеми хештегами в чатах (да)
/delete <#хештег> - удалить хештег из списка хештегов(да)
/setAdmin <кличка> - назначить администратора без прав, reply на сообщение кандидата (да)
/unsetAdmin - снять администратора без прав,eply на сообщение кандидата (да)
/mute <время> - замутить пользователя на время <минуты>, reply на сообщение кандидата (да)
/unmute - размутить пользователя, reply на сообщение кандидата (да)
/getAdmins - получить всех администраторов чата(нет)
}`;
      await clientTGRepository.sendMessage(
        chat_id,
        text,
        message.message_thread_id
      );
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
};