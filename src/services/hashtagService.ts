import { WithId } from "mongodb";

import { HashtagDBModel } from "../db/types/hashtag.db.entity";
import { hashtagRepository } from "../repositories/hashtagRepository";
import { UpdateHashtagsParams } from "../types/repository/UpdateHashtagsParams.type";

export const hashtagService = {
  async updateOrCreateHashtag(
    dto: UpdateHashtagsParams
  ): Promise<string[] | null> {
    try {
      let hashtagsInDb: HashtagDBModel | null =
        await hashtagRepository.getHashtags({
          chat_id: dto.chat_id,
          message_thread_id: dto.message_thread_id,
        });

      if (!hashtagsInDb) {
        hashtagsInDb = await hashtagRepository.createHashtags({
          chat_id: dto.chat_id,
          message_thread_id: dto.message_thread_id,
          hashtags: dto.hashtags,
        });
      }

      if (hashtagsInDb === null) {
        return null;
      }

      hashtagsInDb.hashtags = Array.from(
        new Set(hashtagsInDb.hashtags.concat(dto.hashtags))
      );

      const responseHashtags: WithId<HashtagDBModel> | null =
        await hashtagRepository.updateHashtags(hashtagsInDb);

      return responseHashtags?.hashtags ?? null;
    } catch (e) {
      console.error(e);
      return null;
    }
  },
};
