/**
 * Conversion et validation des prix.
 *
 * Le champ `Product.price` est stocke en base sous forme de texte (colonne
 * VARCHAR) et peut selon la saisie contenir : "1500", "1 500", "1,500",
 * "1500 FCFA", "1200 $"...
 *
 * Securite : le prix NE DOIT JAMAIS etre pris dans la requete du client.
 * Cette fonction ne sert QUE pour relire le prix stocke en base, qui fait foi.
 */

/**
 * Convertit un prix stocke en base vers un nombre.
 * Gere les espaces (y compris insecables), les separateurs de milliers et les
 * suffixes de devise. Renvoie `null` si la valeur n'est pas un nombre valide.
 */
export function parsePrice(raw: string | null | undefined): number | null {
  if (raw === null || raw === undefined) return null;

  // "1 500 FCFA" -> "1500"
  const cleaned = String(raw)
    .replace(/ /g, ' ') // espaces insecables
    .replace(/[^\d,.\-]/g, '') // on ne garde que chiffres et separateurs
    .trim();

  if (!cleaned) return null;

  // Si plusieurs separateurs sont presents, le dernier est le separateur decimal.
  const lastComma = cleaned.lastIndexOf(',');
  const lastDot = cleaned.lastIndexOf('.');

  let normalized: string;
  if (lastComma !== -1 && lastDot !== -1) {
    // Les deux sont presents : le dernier separe les decimales
    const decimalSep = lastComma > lastDot ? ',' : '.';
    const thousandSep = decimalSep === ',' ? '.' : ',';
    normalized = cleaned
      .split(thousandSep)
      .join('')
      .replace(decimalSep, '.');
  } else if (lastComma !== -1) {
    // Une seule virgule : decimale si <= 2 chiffres apres, sinon separateur de milliers
    const parts = cleaned.split(',');
    normalized =
      parts.length === 2 && parts[1].length <= 2
        ? parts[0] + '.' + parts[1]
        : parts.join('');
  } else if (lastDot !== -1) {
    // Un seul point : meme regle
    const parts = cleaned.split('.');
    normalized =
      parts.length === 2 && parts[1].length <= 2
        ? parts[0] + '.' + parts[1]
        : parts.join('');
  } else {
    normalized = cleaned;
  }

  const value = Number.parseFloat(normalized);
  if (!Number.isFinite(value)) return null;

  return Math.round(value * 100) / 100;
}
