
interface SanitizeOptions {
  allowedOrigin: string
}

export function sanitizeMessage(message: MessageEvent, options: SanitizeOptions) {
  // block out wrong origins
  if (message.origin !== options.allowedOrigin) return false
  // Highgrafme will never send no data, hence exclude this event here
  if (!message.data) return false
  // we will sanitize fur

  return true
}
