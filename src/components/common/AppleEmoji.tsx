import { useState } from 'react';
import { getLocalAppleEmojiUrl } from '../../utils/appleEmoji';

interface AppleEmojiProps {
  emoji: string;
  className?: string;
  size?: number;
  useThumbnail?: boolean;
}

export const AppleEmoji = ({
  emoji,
  className = '',
  size = 38,
  useThumbnail = false,
}: AppleEmojiProps) => {
  const [loadError, setLoadError] = useState(false);
  const localUrl = getLocalAppleEmojiUrl(emoji, useThumbnail);

  if (loadError) {
    return (
      <span
        className={`inline-flex items-center justify-center select-none ${className}`}
        style={{ fontSize: size * 0.85, lineHeight: 1 }}
      >
        {emoji}
      </span>
    );
  }

  return (
    <img
      src={localUrl}
      alt={emoji}
      draggable={false}
      loading="lazy"
      onError={() => setLoadError(true)}
      style={{ width: size, height: size }}
      className={`inline-block object-contain select-none shrink-0 ${className}`}
    />
  );
};