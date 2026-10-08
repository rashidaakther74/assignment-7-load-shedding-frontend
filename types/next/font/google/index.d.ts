export interface FontOptions {
  subsets?: string[];
  display?: string;
  variable?: string;
  weight?: string | number | (string | number)[];
  style?: string | string[];
  preload?: boolean;
  adjustFontFallback?: boolean | 'auto';
  fallback?: string[];
}

export interface FontWithVariable {
  className: string;
  style: { fontFamily: string };
  variable: string;
}

export interface FontWithoutVariable {
  className: string;
  style: { fontFamily: string };
}

export type Font = FontWithVariable | FontWithoutVariable;

export function Inter(options?: FontOptions): FontWithVariable;
export function Roboto(options?: FontOptions): FontWithVariable;
export function Roboto_Flex(options?: FontOptions): FontWithVariable;
export function Geist(options?: FontOptions): FontWithVariable;
export function Geist_Mono(options?: FontOptions): FontWithVariable;
export function Noto_Sans(options?: FontOptions): FontWithVariable;