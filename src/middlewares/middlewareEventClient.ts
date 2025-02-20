import type * as Td from "tdlib-types";

import { handleService } from "../services/handleService";

function shouldBotRespond() {
  const responseProbability = 0.005; // Вероятность ответа (например, 0.5% или 1 из 200)
  return Math.random() < responseProbability;
}

export const handleUpdate = async (update: Td.Update) => {
  try {
    if (update._ === "updateNewMessage") {
      await handleMessage(update);
      return;
    }
  } catch (e) {
    console.log(e);
  }
};

async function handleMessage(update: Td.updateNewMessage) {
  try {
    const message: Td.message = update.message;
    console.log(message);

    if (message.sender_id._ === "messageSenderChat") {
      return;
    }

    // if (message.sender_id.user_id === message.chat_id) {
    //   await handleMyDialogs(message);
    //   return;
    // }

    if (message.content._ === "messageText") {
      await handleTextMessage(message);
      return;
    }
    if (message.content._ === "messageDocument") {
      await handleDocumentMessage(message);
      return;
    }
    if (message.content._ === "messagePhoto") {
      await handlePhotoMessage(message);
      return;
    }
  } catch (e) {
    console.log(e);
  }
}

// async function handleMyDialogs(message: Td.message) {
//   try {
//     const isAnswered = await handleService.handleMyDialogs(message);
//   } catch (e) {
//     console.log(e);
//   }
// }

async function handleTextMessage(message: Td.message) {
  try {
    const text: string = (message.content as Td.messageText).text.text;
    switch (text) {
      case "/get":
        await handleService.handleGetCommand(message);
        break;
      case "/updateHashtags":
        await handleService.handleUpdateHashtagsCommand(message);
        break;
      case "/unsetAdmin":
        await handleService.handleUnsetAdminCommand(message);
        break;
      case "/unmute":
        await handleService.handleUnmuteCommand(message);
        break;
      case "/getAdmins":
        await handleService.handleGetAdminsCommand(message);
        break;
      case "/help":
        await handleService.handleHelpCommand(message);
        break;

      // case "/mes":
      //   await handleService.handleMyDialogs(message);
      //   break;

      default:
        if (text.includes("/setAdmin")) {
          await handleService.handleSetAdminCommand(message);
          break;
        }
        if (text.includes("/mute")) {
          await handleService.handleMuteCommand(message);
          break;
        }
        if (text.includes("/delete")) {
          await handleService.handleDeleteCommand(message);
          break;
        }

        if (text.toLowerCase() === "да" && Math.random() > 0.5) {
          await handleService.handleYesCommand(message);
          break;
        }
        if (text.toLowerCase() === "нет" && Math.random() > 0.5) {
          await handleService.handleNoCommand(message);
          break;
        }

        if (shouldBotRespond()) {
          await handleService.handleMyDialogs(message);
          break;
        }
        break;
    }
  } catch (e) {
    console.log(e);
  }
}

async function handleDocumentMessage(message: Td.message) {
  try {
    const text: string = (message.content as Td.messageDocument).caption.text;
    if (text.indexOf("#")) {
      await handleService.handleHashtagsFromNewMessage(message);
      return;
    }
  } catch (e) {
    console.log(e);
  }
}

async function handlePhotoMessage(message: Td.message) {
  try {
    const text: string = (message.content as Td.messagePhoto).caption.text;
    if (text.includes("#")) {
      await handleService.handleHashtagsFromNewMessage(message);
      return;
    }
  } catch (e) {
    console.log(e);
  }
}
