export function getHashtagsFromString(text: string): string[] {
  try {
    const hashtagRegex = /#[a-zA-Zа-яА-Я0-9_]+/g;
    const hashtags = text.match(hashtagRegex);
    if (hashtags) {
      return hashtags.map((h) => {
        return h.replace(/#/g, "").toLocaleLowerCase();
      });
    }

    return [];
  } catch (e) {
    console.log(e);
    return [];
  }
}
