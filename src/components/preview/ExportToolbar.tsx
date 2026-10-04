import { useState } from 'react';
import { exportElementsToPng, exportElementsToJpg, exportElementsToPdf } from '../../utils/exportService';
import { UI_THEME } from '../../constants/uiThemeConfig';
import { Download, FileImage, Image as ImageIcon, FileText, Loader2 } from 'lucide-react';

type ExportFormat = 'png' | 'jpg' | 'pdf';

interface ExportToolbarProps {
  getBoardElements: () => HTMLElement[];
}

const FORMATS = [
  { id: 'png', label: 'PNG', Icon: FileImage },
  { id: 'jpg', label: 'JPG', Icon: ImageIcon },
  { id: 'pdf', label: 'PDF', Icon: FileText },
] as const;

export const ExportToolbar = ({
  getBoardElements,
}: ExportToolbarProps) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('png');
  const [isExporting, setIsExporting] = useState(false);

  const handleExecuteExport = async () => {
    const elements = getBoardElements();
    if (elements.length === 0 || isExporting) return;

    setIsExporting(true);

    try {
      switch (selectedFormat) {
        case 'png':
          await exportElementsToPng(elements);
          break;
        case 'jpg':
          await exportElementsToJpg(elements);
          break;
        case 'pdf':
          await exportElementsToPdf(elements);
          break;
      }
    } catch (error) {
      console.error(error);
      alert('A apărut o problemă la generarea fișierelor.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={`w-full ${UI_THEME.backgrounds.panel} ${UI_THEME.borders.subtle} ${UI_THEME.radii.card} ${UI_THEME.spacing.cardPadding} shadow-xl flex flex-col gap-3.5`}>
      <div className="flex flex-col gap-1.5">
        <div className="grid grid-cols-3 gap-1.5 bg-[#171724] p-1 rounded-xl border border-[#262638]">
          {FORMATS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setSelectedFormat(id as ExportFormat)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedFormat === id
                  ? 'bg-white text-neutral-950 font-bold shadow-md'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Icon className="w-4 h-4 mb-1" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        disabled={isExporting}
        onClick={handleExecuteExport}
        className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 ${UI_THEME.radii.control} text-xs font-bold ${UI_THEME.backgrounds.buttonAccent} hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer shadow-md`}
      >
        {isExporting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Generare {selectedFormat.toUpperCase()}...</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            <span>Descarcă {selectedFormat.toUpperCase()}</span>
          </>
        )}
      </button>
    </div>
  );
};