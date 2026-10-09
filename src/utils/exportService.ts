import { toPng, toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';

const VIRTUAL_WIDTH = 1080;
const VIRTUAL_HEIGHT = 1920;

const downloadImage = (dataUrl: string, filename: string) => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
};

const getExportOptions = (element: HTMLElement) => {
  const computedBg = window.getComputedStyle(element).backgroundColor;
  const bgColor = computedBg && computedBg !== 'rgba(0, 0, 0, 0)' && computedBg !== 'transparent'
    ? computedBg
    : '#12121c';

  return {
    width: VIRTUAL_WIDTH,
    height: VIRTUAL_HEIGHT,
    canvasWidth: VIRTUAL_WIDTH,
    canvasHeight: VIRTUAL_HEIGHT,
    pixelRatio: 1,
    backgroundColor: bgColor,
    style: {
      transform: 'none',
      transformOrigin: 'top left',
      borderRadius: '0px',
      margin: '0px',
    },
  };
};

export async function exportSingleElementToPng(
  element: HTMLElement,
  slideIndex: number = 0
): Promise<void> {
  const options = getExportOptions(element);
  const dataUrl = await toPng(element, options);
  downloadImage(dataUrl, `story-program-slide-${slideIndex + 1}.png`);
}

export async function exportSingleElementToJpg(
  element: HTMLElement,
  slideIndex: number = 0
): Promise<void> {
  const options = getExportOptions(element);
  const dataUrl = await toJpeg(element, {
    ...options,
    quality: 0.95,
  });
  downloadImage(dataUrl, `story-program-slide-${slideIndex + 1}.jpg`);
}

export async function exportSingleElementToPdf(
  element: HTMLElement,
  slideIndex: number = 0
): Promise<void> {
  const options = getExportOptions(element);
  const dataUrl = await toPng(element, options);

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [VIRTUAL_WIDTH, VIRTUAL_HEIGHT],
  });

  pdf.addImage(dataUrl, 'PNG', 0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
  pdf.save(`story-program-slide-${slideIndex + 1}.pdf`);
}