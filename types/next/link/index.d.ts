import type { ComponentType, ReactNode } from 'react';

interface LinkProps {
  href: string | URL;
  children: ReactNode;
  replace?: boolean;
  scroll?: boolean;
  prefetch?: boolean | 'auto' | 'viewport';
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  onMouseEnter?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  onTouchStart?: (e: React.TouchEvent<HTMLAnchorElement>) => void;
  legacyBehavior?: boolean;
  passHref?: boolean;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: unknown;
}

declare const Link: ComponentType<LinkProps>;
export default Link;
export { LinkProps };