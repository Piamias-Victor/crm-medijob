export function openDeepLinks(urls: string[]): void {
  for (const url of urls) {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}
