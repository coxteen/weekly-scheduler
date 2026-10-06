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

export async function exportElementsToPng(elements: HTMLElement[]): Promise<void> {
  for (let i = 0; i < elements.length; i++) {
    const bgColor = window.getComputedStyle(elements[i]).backgroundColor;
    
    const dataUrl = await toPng(elements[i], {
      ...EXPORT_OPTIONS,
      backgroundColor: bgColor,
    });
    const filename = elements.length > 1 ? `story-program-${i + 1}.png` : 'story-program.png';
    downloadImage(dataUrl, filename);
  }
}

export async function exportElementsToJpg(elements: HTMLElement[]): Promise<void> {
  for (let i = 0; i < elements.length; i++) {
    const bgColor = window.getComputedStyle(elements[i]).backgroundColor;

    const dataUrl = await toJpeg(elements[i], { 
      ...EXPORT_OPTIONS, 
      quality: 0.95, 
      backgroundColor: bgColor,
    });
    const filename = elements.length > 1 ? `story-program-${i + 1}.jpg` : 'story-program.jpg';
    downloadImage(dataUrl, filename);
  }
}

export async function exportElementsToPdf(elements: HTMLElement[]): Promise<void> {
  if (elements.length === 0) return;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [1080, 1920],
  });

  for (let i = 0; i < elements.length; i++) {
    const bgColor = window.getComputedStyle(elements[i]).backgroundColor;
    
    const dataUrl = await toPng(elements[i], {
      ...EXPORT_OPTIONS,
      backgroundColor: bgColor,
    });

    if (i > 0) {
      pdf.addPage([1080, 1920], 'portrait');
    }
    pdf.addImage(dataUrl, 'PNG', 0, 0, 1080, 1920);
  }

  pdf.save('program-saptamanal.pdf');
}