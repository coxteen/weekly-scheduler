import { useState } from 'react';
import {
  exportSingleElementToPng,
  exportSingleElementToJpg,
  exportSingleElementToPdf,
} from '../../utils/exportService';
import { Download, FileImage, Image as ImageIcon, FileText, Loader2 } from 'lucide-react';

type ExportFormat = 'png' | 'jpg' | 'pdf';

interface ExportToolbarProps {
  getActiveBoardElement: () => HTMLElement | null;
  activePageIndex: number;
}

const FORMATS = [
  { id: 'png', label: 'PNG', Icon: FileImage },
  { id: 'jpg', label: 'JPG', Icon: ImageIcon },
  { id: 'pdf', label: 'PDF', Icon: FileText },
] as const;

export const ExportToolbar = ({
  getActiveBoardElement,
  activePageIndex,
}: ExportToolbarProps) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('png');
  const [isExporting, setIsExporting] = useState(false);

  const handleExecuteExport = async () => {
    const element = getActiveBoardElement();
    if (!element || isExporting) return;

    setIsExporting(true);

    try {
      switch (selectedFormat) {
        case 'png':
          await exportSingleElementToPng(element, activePageIndex);
          break;
        case 'jpg':
          await exportSingleElementToJpg(element, activePageIndex);
          break;
        case 'pdf':
          await exportSingleElementToPdf(element, activePageIndex);
          break;
      }
    } catch (error) {
      console.error(error);
      alert('A apărut o problemă la descărcarea slide-ului.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col justify-between h-full gap-3">
      {/* Selector format */}
      <div className="grid grid-cols-3 gap-1 bg-[#101018] p-1 rounded-xl border border-[#222234]">
        {FORMATS.map(({ id, label, Icon }) => {
          const isSelected = selectedFormat === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setSelectedFormat(id as ExportFormat)}
              className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-neutral-100 text-neutral-950 font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-[#1a1a28]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Buton descărcare */}
      <button
        type="button"
        disabled={isExporting}
        onClick={handleExecuteExport}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 transition-all cursor-pointer shadow-md shadow-indigo-600/20 active:scale-[0.98]"
      >
        {isExporting ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Generare...</span>
          </>
        ) : (
          <>
            <Download className="w-3.5 h-3.5" />
            <span>Descarcă Slide {activePageIndex + 1}</span>
          </>
        )}
      </button>
    </div>
  );
};