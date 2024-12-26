import type * as Td from "tdlib-types";

import { getHashtagsFromString } from "./getHashtagsFromString";

export function getHashtagsFromMessagesClient(
  messagesArr: Td.message[],
  message_thread_id: number
) {
  try {
    let messages: Td.message[] = messagesArr;
    if (message_thread_id !== 0) {
      messages = messages.filter(
        (msg) => msg.message_thread_id === message_thread_id
      );
    }

    messages = messages.filter(
      (msg) =>
        msg.content._ === "messagePhoto" || msg.content._ == "messageDocument"
    );
    const captionMessages: Array<string> = messages.map((msg) => {
      if ("caption" in msg.content) {
        return msg.content.caption.text;
      }
      return "";
    });
    const hashtags: string[] = captionMessages.flatMap((caption) =>
      getHashtagsFromString(caption)
    );
    return hashtags;
  } catch (e) {
    console.log(e);
    return null;
  }
}
