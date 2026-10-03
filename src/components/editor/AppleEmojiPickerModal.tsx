import { useState, useMemo } from 'react';
import { ALL_APPLE_EMOJIS } from '../../utils/appleEmoji';
import { AppleEmoji } from '../common/AppleEmoji';
import { UI_THEME } from '../../constants/uiThemeConfig';
import { X, Search } from 'lucide-react';

interface AppleEmojiPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEmoji: (emojiChar: string) => void;
  currentEmoji: string;
}

export const AppleEmojiPickerModal = ({
  isOpen,
  onClose,
  onSelectEmoji,
  currentEmoji,
}: AppleEmojiPickerModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Activities');

  const categories = useMemo(() => {
    return Array.from(new Set(ALL_APPLE_EMOJIS.map((e) => e.category)));
  }, []);

  const displayedEmojis = useMemo(() => {
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return ALL_APPLE_EMOJIS.filter(
        (e) => e.name.toLowerCase().includes(term) || e.char.includes(term)
      ).slice(0, 120);
    }
    return ALL_APPLE_EMOJIS.filter((e) => e.category === selectedCategory).slice(0, 100);
  }, [searchTerm, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${UI_THEME.backgrounds.modalOverlay} p-4`}>
      <div className={`${UI_THEME.backgrounds.modalSurface} ${UI_THEME.borders.subtle} ${UI_THEME.radii.panel} shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]`}>
        <div className={`px-5 py-3.5 ${UI_THEME.backgrounds.panelHeader} border-b border-[#252536] flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <span className={`font-bold text-sm ${UI_THEME.text.primary}`}>
              Galerie Emoji Apple
            </span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#20202F] rounded-full border border-[#2F2F44]">
              <span className={`text-[11px] ${UI_THEME.text.muted}`}>Curent:</span>
              <AppleEmoji emoji={currentEmoji} size={18} />
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`w-7 h-7 ${UI_THEME.radii.pill} ${UI_THEME.backgrounds.buttonSecondary} flex items-center justify-center transition-colors cursor-pointer`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 border-b border-[#252536] bg-[#161622]">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
            <input
              type="text"
              placeholder="Caută emoji..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 pr-3 py-1.5 text-sm ${UI_THEME.backgrounds.input} ${UI_THEME.radii.control} ${UI_THEME.text.primary} border border-[#2D2D40] outline-hidden ${UI_THEME.backgrounds.inputFocus}`}
            />
          </div>
        </div>

        {!searchTerm && (
          <div className="flex overflow-x-auto gap-1 p-2 bg-[#12121B] border-b border-[#252536] no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 ${UI_THEME.radii.control} text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? UI_THEME.backgrounds.buttonPrimary
                    : UI_THEME.backgrounds.buttonSecondary
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className="p-4 overflow-y-auto flex-1 bg-[#101018]">
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
            {displayedEmojis.map((item) => (
              <button
                key={item.unified}
                type="button"
                onClick={() => {
                  onSelectEmoji(item.char);
                  onClose();
                }}
                className={`h-11 w-11 ${UI_THEME.radii.control} flex items-center justify-center bg-[#181824] hover:bg-[#252538] hover:border-neutral-500 border transition-all active:scale-95 cursor-pointer ${
                  currentEmoji === item.char ? 'border-indigo-500 ring-1 ring-indigo-500 bg-[#222234]' : 'border-transparent'
                }`}
                title={item.name}
              >
                <AppleEmoji emoji={item.char} size={28} useThumbnail={true} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};