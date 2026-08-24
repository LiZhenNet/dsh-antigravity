/**
 * Replace only unpaired UTF-16 surrogate code units.
 *
 * JavaScript represents supplementary Unicode characters (including most
 * emoji) as valid high/low surrogate pairs, so replacing every surrogate code
 * unit would corrupt otherwise valid text.
 */
export function sanitizeText(text) {
  return String(text ?? "").toWellFormed();
}
