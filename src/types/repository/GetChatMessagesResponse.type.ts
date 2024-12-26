import type * as Td from "tdlib-types";

export type GetChatMessagesResponse = {
  messages: Td.message[];
  hasNext?: boolean;
  nextFromMessageId: number;
  hasError: boolean;
};
