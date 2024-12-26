import { GetMessageHashParams } from "./GetMessageHashParams.type";

export interface UpdateMessageHashParams extends GetMessageHashParams {
  message_ids: number[];
}
