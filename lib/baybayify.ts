const vowels = ["a", "e", "i", "o", "u"];
const consonants = "bcdfghjklmnpqrstvwxyz";

function isConsonant(char: string): boolean {
  return consonants.includes(char.toLowerCase());
}

function isVowel(char: string): boolean {
  return vowels.includes(char.toLowerCase());
}

export default function baybayifyWord(input: string): string {
  if (input.length <= 2) {
    // Special case: preserve short syllables like "pa"
    return input.replace(/([bcdfghjklmnpqrstvwxyz])a/gi, "$1");
  }

  return input
    .replace(/(\w{2})_(\w{2})/g, "$1") // Always pick xx from xx_yy
    .replace(/([bcdfghjklmnpqrstvwxyz])a([aeiou])/gi, "$1$2") // Remove 'a' before vowels
    .replace(/([bcdfghjklmnpqrstvwxyz])a(?![aeiou])/gi, "$1") // Remove 'a' before consonants
    .replace(/([bcdfghjklmnpqrstvwxyz])_([bcdfghjklmnpqrstvwxyz])/g, "$1$2") // Merge consonants
    .replace(/([bcdfghjklmnpqrstvwxyz])([eiou])/gi, "$1$2") // Keep vowels attached properly
    .replace(/([bcdfghjklmnpqrstvwxyz])\b(?![aeiou])/gi, "$1+"); // Only mark final consonants not followed by vowels
}
 

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

export function baybayinToLatin(input: string): string {
  if (input.length <= 2) {
    // Handle short consonant-only inputs
    if (/^[bcdfghjklmnpqrstvwxyz]\+$/.test(input)) {
      return input[0]; // "m+" → "m"
    } else if (/^[bcdfghjklmnpqrstvwxyz]$/.test(input)) {
      return input + "a"; // "m" → "ma"
    }
    return input;
  }

  return input
    .replace(/(\w{2})_(\w{2})/g, "$1") // Pick xx from xx_yy
    .replace(/([bcdfghjklmnpqrstvwxyz])\+(?!\w)/g, "$1") // "m+" → "m"
    .replace(/(^|\s)([bcdfghjklmnpqrstvwxyz])(?=\s|$)/g, "$1$2a") // Bare consonant → consonant+a
    .replace(/([bcdfghjklmnpqrstvwxyz])([eiou])/gi, "$1$2") // Merge properly
    .replace(/\+/g, ""); // Final cleanup
}


