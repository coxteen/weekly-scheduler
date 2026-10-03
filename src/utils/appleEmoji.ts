import emojiData from 'emoji-datasource-apple/emoji.json';

export interface EmojiItem {
  char: string;
  name: string;
  unified: string;
  category: string;
}

export const ALL_APPLE_EMOJIS: EmojiItem[] = (emojiData as any[])
  .filter((e) => e.has_img_apple)
  .map((e) => ({
    char: String.fromCodePoint(...e.unified.split('-').map((u: string) => parseInt(u, 16))),
    name: e.name || e.short_name,
    unified: e.image.replace('.png', '').toLowerCase(),
    category: e.category,
  }));

export function getLocalAppleEmojiUrl(input: string, useThumbnail = false): string {
  const folder = useThumbnail ? 'apple-emojis-sm' : 'apple-emojis';

  if (/^[0-9a-fA-F-]+$/.test(input)) {
    return `/${folder}/${input.toLowerCase()}.png`;
  }

  const found = ALL_APPLE_EMOJIS.find((e) => e.char === input);
  if (found) {
    return `/${folder}/${found.unified}.png`;
  }

  const codePoints: string[] = [];
  for (const char of input) {
    const code = char.codePointAt(0);
    if (code && code !== 0xfe0f) {
      codePoints.push(code.toString(16).toLowerCase());
    }
  }
  
  return `/${folder}/${codePoints.join('-')}.png`;
}