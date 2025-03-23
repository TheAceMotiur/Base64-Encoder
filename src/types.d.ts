interface Window {
  adsbygoogle: {
    push: (params: object) => void;
  }[];
  onerror?: (message: Event | string, source?: string, lineno?: number, colno?: number, error?: Error) => boolean | void;
}
