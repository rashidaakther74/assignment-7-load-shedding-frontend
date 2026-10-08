import type { ComponentType, CSSProperties } from 'react';

interface ImageProps {
  src: string | { default: string } | string[];
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  style?: CSSProperties;
  className?: string;
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  unoptimized?: boolean;
  [key: string]: unknown;
}

declare const Image: ComponentType<ImageProps>;
export default Image;
export { ImageProps };