export function alphabetSortingHashtagsViewer(
  hashtags: string[]
): string | null {
  try {
    hashtags.sort((a, b) => a.localeCompare(b));

    const groupedHashtags: { [key: string]: string[] } = {};
    for (const hashtag of hashtags) {
      const firstLetter = hashtag[0].toUpperCase();
      if (!groupedHashtags[firstLetter]) {
        groupedHashtags[firstLetter] = [];
      }
      groupedHashtags[firstLetter].push(hashtag);
    }

    let text = "#меню\n";
    for (const firstLetter of Object.keys(groupedHashtags).sort()) {
      text += `${firstLetter}\n`;
      for (const hashtag of groupedHashtags[firstLetter]) {
        text += `#${hashtag} `;
      }
      text = text.trim();
      text += "\n";
    }

    return text.trim();
  } catch (e) {
    console.log(e);
    return null;
  }
}
