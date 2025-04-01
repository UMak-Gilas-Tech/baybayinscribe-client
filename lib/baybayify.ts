const vowels = ["a", "e", "i", "o", "u"];
const consonants = "bcdfghjklmnpqrstvwxyz";

export default function baybayifyWord(input: string): string {
  return input
    .replace(/(\w{2})_(\w{2})/g, "$1") // Always pick xx from xx_yy
    .replace(/([bcdfghjklmnpqrstvwxyz])a([aeiou])/gi, "$1$2") // Remove 'a' before vowels
    .replace(/([bcdfghjklmnpqrstvwxyz])a(?![aeiou])/gi, "$1") // Remove 'a' before consonants
    .replace(/([bcdfghjklmnpqrstvwxyz])_([bcdfghjklmnpqrstvwxyz])/g, "$1$2") // Merge consonants
    .replace(/([bcdfghjklmnpqrstvwxyz])([eiou])/gi, "$1$2") // Keep vowels attached properly
    .replace(/([bcdfghjklmnpqrstvwxyz])\b(?!\+)/gi, "$1+"); // Ensure final consonants are marked only once
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
  return input
    .replace(/(\w{2})_(\w{2})/g, "$1") 
    .replace(/([bcdfghjklmnpqrstvwxyz])\+(?!\w)/g, "$1") // Remove '+' but keep consonant-only cases
    .replace(/(^|\s)([bcdfghjklmnpqrstvwxyz])(?=\s|$)/g, "$1$2a") // Add 'a' for standalone consonants
    .replace(/([bcdfghjklmnpqrstvwxyz])([eiou])/gi, "$1$2") // Fix extra vowels merging incorrectly
    .replace(/\+/g, ""); // Remove remaining '+'
}
