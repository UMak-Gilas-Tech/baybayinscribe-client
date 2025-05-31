export function baybayifySymbol(input: string): string {
  return input.replace(/(\w{2})_(\w{2})/g, "$1"); // Always pick xx from xx_yy
}

export function baybayifyWordToArray(input: string): string[] {
  return input
    .replace(/(\w{2})_(\w{2})/g, "$1") // Always pick xx from xx_yy
    .replace(/([bcdfghjklmnpqrstvwxyz])a([aeiou])/gi, "$1_$2")
    .replace(/([bcdfghjklmnpqrstvwxyz])a(?![aeiou])/gi, "$1_")
    .replace(/([bcdfghjklmnpqrstvwxyz])([eiou])/gi, "$1$2_")
    .replace(/([bcdfghjklmnpqrstvwxyz])([bcdfghjklmnpqrstvwxyz])/gi, "$1 _$2")
    .replace(/([bcdfghjklmnpqrstvwxyz])_([bcdfghjklmnpqrstvwxyz])/g, "$1$2") // Merge consonants
    .replace(/(\w*[bcdfghjklmnpqrstvwxyz])\b/gi, "$1+")
    .trim()
    .split(/_|\s/);
}

export default function baybayifyWord(input: string): string {
  const output: string[] = [];

  const normalize = (text: string) =>
    text
      .normalize("NFC")
      .toLowerCase()
      .replace(/[^a-z\s]/g, "");

  const normalized = normalize(input);
  const chars = normalized.split("");

  let i = 0;
  while (i < chars.length) {
    const c = chars[i];
    const next = chars[i + 1];

    if (c === " ") {
      output.push(" ");
      i++;
      continue;
    }

    if (isConsonant(c) && next === "a") {
      output.push(c);
      i += 2;
      continue;
    }

    if (isConsonant(c) && isVowel(next)) {
      output.push(c + next);
      i += 2;
      continue;
    }

    if (isConsonant(c)) {
      output.push(c + "+");
      i++;
      continue;
    }

    // vowel alone → keep
    if (isVowel(c)) {
      output.push(c);
      i++;
      continue;
    }

    i++;
  }

  return output.join("");
}

export function baybayinToLatin(input: string): string {
  const output: string[] = [];

  const normalize = (text: string) =>
    text
      .normalize("NFC")
      .toLowerCase()
      .replace(/[^a-z\+\s]/g, "");

  const normalized = normalize(input);
  const chars = normalized.split("");

  let i = 0;
  while (i < chars.length) {
    const c = chars[i];
    const next = chars[i + 1];

    if (c === " ") {
      output.push(" ");
      i++;
      continue;
    }

    // Handle consonant + '+'
    if (isConsonant(c) && next === "+") {
      output.push(c); // final consonant, no vowel
      i += 2;
      continue;
    }

    // Handle consonant + vowel
    if (isConsonant(c) && isVowel(next)) {
      output.push(c + next);
      i += 2;
      continue;
    }

    // Handle lone consonant (implied 'a')
    if (isConsonant(c)) {
      output.push(c + "a");
      i++;
      continue;
    }

    // Handle vowel
    if (isVowel(c)) {
      output.push(c);
      i++;
      continue;
    }

    // Skip unsupported
    i++;
  }

  return output.join("");
}

function isVowel(c: string): boolean {
  return ["a", "e", "i", "o", "u"].includes(c);
}

function isConsonant(c: string): boolean {
  return /^[bcdfghjklmnpqrstvwxyz]$/.test(c);
}
