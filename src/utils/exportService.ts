import { toPng, toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';

const downloadImage = (dataUrl: string, filename: string) => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
};

const EXPORT_OPTIONS = {
  pixelRatio: 2.5,
  style: {
    borderRadius: '0px',
  },
};

export async function exportSingleElementToPng(
  element: HTMLElement,
  slideIndex: number = 0
): Promise<void> {
  const bgColor = window.getComputedStyle(element).backgroundColor;
  const dataUrl = await toPng(element, {
    ...EXPORT_OPTIONS,
    backgroundColor: bgColor,
  });
  downloadImage(dataUrl, `story-program-slide-${slideIndex + 1}.png`);
}

export async function exportSingleElementToJpg(
  element: HTMLElement,
  slideIndex: number = 0
): Promise<void> {
  const bgColor = window.getComputedStyle(element).backgroundColor;
  const dataUrl = await toJpeg(element, {
    ...EXPORT_OPTIONS,
    quality: 0.95,
    backgroundColor: bgColor,
  });
  downloadImage(dataUrl, `story-program-slide-${slideIndex + 1}.jpg`);
}

export async function exportSingleElementToPdf(
  element: HTMLElement,
  slideIndex: number = 0
): Promise<void> {
  const bgColor = window.getComputedStyle(element).backgroundColor;
  const dataUrl = await toPng(element, {
    ...EXPORT_OPTIONS,
    backgroundColor: bgColor,
  });

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [1080, 1920],
  });

  pdf.addImage(dataUrl, 'PNG', 0, 0, 1080, 1920);
  pdf.save(`story-program-slide-${slideIndex + 1}.pdf`);
}