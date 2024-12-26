export function cropTextForMessage(text: string): string[] {
  try {
    const arr = [];
    let cropText = text;
    while (cropText.length > 0) {
      if (cropText.length >= 4090) {
        const index: number = cropText.lastIndexOf(" ", 4090);
        if (index === -1) {
          arr.push(cropText.slice(0, 4090));
          cropText = cropText.slice(4090);
        } else {
          arr.push(cropText.slice(0, index));
          cropText = cropText.slice(index + 1);
        }
      } else {
        arr.push(cropText);
        cropText = "";
      }
    }
    return arr;
  } catch (e) {
    console.log(e);
    return [];
  }
}
