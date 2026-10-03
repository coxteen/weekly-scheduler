export const UI_THEME = {
  backgrounds: {
    app: 'bg-[#0A0A0F]',
    panel: 'bg-[#12121A]',
    panelHeader: 'bg-[#171723]',
    subCard: 'bg-[#171724]',
    input: 'bg-[#1C1C2A]',
    inputFocus: 'focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500',
    modalOverlay: 'bg-black/80 backdrop-blur-md',
    modalSurface: 'bg-[#14141E]',
    buttonSecondary: 'bg-[#20202F] hover:bg-[#28283B] text-neutral-300',
    buttonPrimary: 'bg-white text-black hover:bg-neutral-200',
    buttonAccent: 'bg-indigo-600 hover:bg-indigo-700 text-white',
  },
  borders: {
    subtle: 'border border-[#232334]',
    medium: 'border border-[#2C2C40]',
    divider: 'divide-[#232334]',
  },
  text: {
    primary: 'text-neutral-100',
    secondary: 'text-neutral-400',
    muted: 'text-neutral-500',
    accent: 'text-indigo-400',
  },
  radii: {
    panel: 'rounded-2xl',
    card: 'rounded-xl',
    control: 'rounded-lg',
    pill: 'rounded-full',
  },
  spacing: {
    panelPadding: 'p-5 md:p-6',
    cardPadding: 'p-4',
    inputPadding: 'px-3 py-2',
    controlGap: 'gap-2.5',
  },
} as const;