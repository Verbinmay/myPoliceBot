import { GetHashtagsParams } from "./GetHashtagsParams.type";

export interface UpdateHashtagsParams extends GetHashtagsParams {
  hashtags: string[];
}
