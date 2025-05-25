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

// convert custom encoding to Baybayin Unicode
export function latinToBaybayinUnicode(encoded: string): string {
  // Baybayin base characters
  const baseMap: Record<string, string> = {
    k: "ᜃ",
    g: "ᜄ",
    ng: "ᜅ",
    t: "ᜆ",
    d: "ᜇ",
    n: "ᜈ",
    p: "ᜉ",
    b: "ᜊ",
    m: "ᜋ",
    y: "ᜌ",
    l: "ᜎ",
    w: "ᜏ",
    s: "ᜐ",
    h: "ᜑ",
    r: "ᜇ",
    a: "ᜀ",
    i: "ᜁ",
    e: "ᜁ",
    o: "ᜂ",
    u: "ᜂ",
  };
  // Kudlit marks
  const kudlitI = "ᜒ"; // for i/e
  const kudlitU = "ᜓ"; // for o/u
  const virama = "᜔";

  let result = "";
  let i = 0;
  while (i < encoded.length) {
    const c = encoded[i];
    const next = encoded[i + 1];
    // Handle 'ng' digraph
    if (c === "n" && next === "g") {
      // Check for final consonant (ng+)
      if (encoded[i + 2] === "+") {
        result += baseMap["ng"] + virama;
        i += 3;
        continue;
      }
      result += baseMap["ng"];
      i += 2;
      continue;
    }
    // Vowel alone
    if (isVowel(c) && (i === 0 || !isConsonant(encoded[i - 1]))) {
      result += baseMap[c];
      i++;
      continue;
    }
    // Consonant + vowel
    if (isConsonant(c) && isVowel(next)) {
      result += baseMap[c];
      if (next === "a") {
        // No kudlit for 'a'
      } else if (next === "i" || next === "e") {
        result += kudlitI;
      } else if (next === "o" || next === "u") {
        result += kudlitU;
      }
      i += 2;
      continue;
    }
    // Final consonant (consonant+)
    if (isConsonant(c) && next === "+") {
      result += baseMap[c] + virama;
      i += 2;
      continue;
    }
    // Lone consonant (implied 'a')
    if (isConsonant(c)) {
      result += baseMap[c];
      i++;
      continue;
    }
    // Space or unknown
    if (c === " ") {
      result += " ";
      i++;
      continue;
    }
    // Skip unknown
    i++;
  }
  return result;
}
