import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Clean API text: strip mojibake (e.g. â€™ → '), stray control chars,
 * curly quotes/dashes, and ? characters that come from the intGrow API.
 */
export function cleanApiText(text: string): string {
  if (!text) return '';
  return text
    // Mojibake: UTF-8 bytes decoded as Windows-1252
    .replace(/â€™/g, "'")   // ' right single quote
    .replace(/â€˜/g, "'")   // ' left single quote
    .replace(/â€œ/g, '"')   // " left double quote
    .replace(/â€\u009d/g, '"') // " right double quote
    .replace(/â€\u0093/g, '"') // „ double low quote
    .replace(/â€\u0094/g, '-') // – en dash
    .replace(/â€\u0093/g, '-')
    .replace(/â€"/g, '-')   // – en dash
    .replace(/â€"/g, '-')   // — em dash (catch-all for â€ + dash byte)
    .replace(/â€¦/g, '...') // … ellipsis
    .replace(/â€¹/g, '<')   // ‹
    .replace(/â€º/g, '>')   // ›
    .replace(/Â/g, '')      // stray Â from double-encoding
    .replace(/â€\u0082/g, ' ') // ‚
    .replace(/â€\u0084/g, '""')
    .replace(/â€\u0085/g, '...')
    .replace(/â€\u0086/g, '†')
    .replace(/â€\u0087/g, '‡')
    .replace(/â€\u0088/g, 'ˆ')
    .replace(/â€\u0089/g, '‰')
    .replace(/â€\u008b/g, '‹')
    .replace(/â€\u0091/g, "'")
    .replace(/â€\u0092/g, "'")
    .replace(/â€\u0094/g, '-')
    .replace(/â€\u0095/g, '—')
    .replace(/â€\u0096/g, '-')
    .replace(/â€\u0097/g, '-')
    .replace(/â€\u0099/g, '™')
    // Remaining â€ fragments (dangling)
    .replace(/â€/g, '')
    // Proper UTF-8 curly quotes & dashes → ASCII
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/[\u00A0\u2000-\u200B\u2028\u2029]/g, ' ')
    // Strip remaining non-printable control chars (keep tab/newline)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    // ? placeholder from API
    .replace(/\?/g, '')
    .trim();
}
