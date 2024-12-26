import { ContextSceneType } from "../types/context.type";

export const getUserChatId = (context: ContextSceneType): number => {
  if ("message" in context.update) {
    return context.update.message.chat.id;
  }

  return 1;
};
