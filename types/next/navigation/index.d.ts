export interface Router {
  push: (href: string) => void;
  replace: (href: string) => void;
  prefetch: (href: string) => void;
  back: () => void;
  forward: () => void;
  refresh: () => void;
}

export function useRouter(): Router;
export function usePathname(): string;
export function useSearchParams(): URLSearchParams | null;
export function useParams(): Record<string, string>;
export function redirect(url: string): never;
export function notFound(): never;
export function useSelectedLayoutSegment(): string | null;
export function useSelectedLayoutSegments(): string[];