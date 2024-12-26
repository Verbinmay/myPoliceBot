import { ContextSceneType } from "../types/context.type";

export const getUserChatId = (context: ContextSceneType): number => {
  // if ("callback_query" in context.update) {
  //   return context.update.callback_query.from.id;
  // }

  if ("message" in context.update) {
    return context.update.message.chat.id;
  }

  return 1;
};
