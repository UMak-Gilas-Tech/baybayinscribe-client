import { z } from "zod";

// Password length constraints
export const PASSWORD_CONSTRAINTS = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 16,
};

// Character type requirements
export const PASSWORD_PATTERNS = {
  UPPERCASE: /[A-Z]/,
  LOWERCASE: /[a-z]/,
  NUMBER: /[0-9]/,
  SPECIAL: /[^A-Za-z0-9]/,
  REPEATED_CHARS: /(.)\1{2,}/,
};

// Script injection patterns to block
export const SCRIPT_PATTERNS = [
  /<script.*?>.*?<\/script>/i,
  /javascript:/i,
  /on\w+\s*=/i,
  /data:/i,
  /vbscript:/i,
  /expression\s*\(/i,
  /eval\s*\(/i,
  /alert\s*\(/i,
  /document\./i,
  /window\./i,
  /console\./i,
  /function\s*\(/i,
  /new\s+Function/i,
  /setTimeout\s*\(/i,
  /setInterval\s*\(/i,
];

// Common password patterns to block
export const COMMON_PASSWORDS = [
  /password/i,
  /admin/i,
  /123456/i,
  /qwerty/i,
  /letmein/i,
  /welcome/i,
  /monkey/i,
  /dragon/i,
  /baseball/i,
  /football/i,
  /shadow/i,
  /master/i,
  /hello/i,
  /freedom/i,
  /whatever/i,
  /trustno1/i,
];

// Offensive terms to block
export const OFFENSIVE_TERMS = [
  // Racial slurs and offensive terms
  /n[4i]gg[3a]/i,
  /n[1i]gg[3e]r/i,
  /f[4a]gg[0o]t/i,
  /k[1i]k[3e]/i,
  /sp[1i]c/i,
  /ch[1i]nk/i,
  /g[0o]ok/i,
  /w[0o]p/i,
  /d[0o]g[3e]at[3e]r/i,
  /t[0o]w[3e]lh[3e]ad/i,
  /r[3e]dsk[1i]n/i,
  /y[3e]llow/i,
  /b[0o]wn[1i][3e]/i,
  /wh[1i]t[3e]tr[4a]sh/i,
  /c[0o]on/i,
  /j[1i]g[4a]b[0o][0o]/i,
  /g[0o]yp/i,
  /h[0o]nky/i,
  /cr[4a]ck[3e]r/i,
  /w[0o]t[0o]/i,
  /s[4a]ndn[1i]gg[3e]r/i,
];

// Password strength levels
export enum PasswordStrength {
  WEAK = "weak",
  MEDIUM = "medium",
  STRONG = "strong",
}

// Password validation messages
export const PASSWORD_MESSAGES = {
  LENGTH: "Password must be between 8 and 16 characters long.",
  UPPERCASE: "Password must contain at least one uppercase letter.",
  LOWERCASE: "Password must contain at least one lowercase letter.",
  NUMBER: "Password must contain at least one number.",
  SPECIAL: "Password must contain at least one special character.",
  SCRIPT: "Password contains invalid characters or patterns.",
  COMMON: "Password is too common or easily guessable.",
  REPEATED: "Password contains too many repeated characters.",
  MATCH: "Passwords do not match.",
};

export const OFFENSIVE_REJECTIONS = [
  "Bestie… this ain't 4chan. Try again. 🙄",
  "Wow, edgy. What are you, 13 and on Xbox Live? 💀",
  "This password said a slur and got ratio'd. 🔇",
  "Yikes. This password needs to touch grass. 🌱",
  "Nah. This one's going straight to cringe Twitter. 🧍‍♂️📸",
  "Try a password that won't get you canceled in 5 minutes. ✨",
  "You're not edgy, you're just blocked. 🚫",
  "Password rejected. Internet points not found. 🫠",
  "Congratulations, you've unlocked: absolutely not. 🗝️❌",
  "That password? Straight to jail. Immediately. 🚓",
  "Get help. This ain't 2010 Xbox chat. 🧠",
  "Password rejected for crimes against vibes. 🧃",
];

// Get random offensive rejection message
const getRandomOffensiveMessage = () => {
  const randomIndex = Math.floor(Math.random() * OFFENSIVE_REJECTIONS.length);
  return OFFENSIVE_REJECTIONS[randomIndex];
};

// Password strength checker
export const checkPasswordStrength = (password: string): PasswordStrength => {
  let score = 0;

  // Length check
  if (password.length >= PASSWORD_CONSTRAINTS.MIN_LENGTH) score++;
  if (password.length >= 12) score++;

  // Character type checks
  if (PASSWORD_PATTERNS.UPPERCASE.test(password)) score++;
  if (PASSWORD_PATTERNS.LOWERCASE.test(password)) score++;
  if (PASSWORD_PATTERNS.NUMBER.test(password)) score++;
  if (PASSWORD_PATTERNS.SPECIAL.test(password)) score++;

  // Pattern checks
  if (!PASSWORD_PATTERNS.REPEATED_CHARS.test(password)) score++;
  if (!COMMON_PASSWORDS.some((pattern) => pattern.test(password))) score++;
  if (!SCRIPT_PATTERNS.some((pattern) => pattern.test(password))) score++;

  if (score >= 7) return PasswordStrength.STRONG;
  if (score >= 5) return PasswordStrength.MEDIUM;
  return PasswordStrength.WEAK;
};

// Create password validation schema
export const createPasswordSchema = () => {
  return z
    .string()
    .min(PASSWORD_CONSTRAINTS.MIN_LENGTH, { message: PASSWORD_MESSAGES.LENGTH })
    .max(PASSWORD_CONSTRAINTS.MAX_LENGTH, { message: PASSWORD_MESSAGES.LENGTH })
    .regex(PASSWORD_PATTERNS.UPPERCASE, {
      message: PASSWORD_MESSAGES.UPPERCASE,
    })
    .regex(PASSWORD_PATTERNS.LOWERCASE, {
      message: PASSWORD_MESSAGES.LOWERCASE,
    })
    .regex(PASSWORD_PATTERNS.NUMBER, { message: PASSWORD_MESSAGES.NUMBER })
    .regex(PASSWORD_PATTERNS.SPECIAL, { message: PASSWORD_MESSAGES.SPECIAL })
    .refine(
      (password) => !SCRIPT_PATTERNS.some((pattern) => pattern.test(password)),
      { message: PASSWORD_MESSAGES.SCRIPT }
    )
    .refine(
      (password) => !COMMON_PASSWORDS.some((pattern) => pattern.test(password)),
      { message: PASSWORD_MESSAGES.COMMON }
    )
    .refine(
      (password) => {
        const hasOffensiveTerm = OFFENSIVE_TERMS.some((pattern) =>
          pattern.test(password)
        );
        if (hasOffensiveTerm) {
          return false;
        }
        return true;
      },
      { message: getRandomOffensiveMessage() }
    )
    .refine((password) => !PASSWORD_PATTERNS.REPEATED_CHARS.test(password), {
      message: PASSWORD_MESSAGES.REPEATED,
    });
};

// Create complete registration schema with password validation
export const createRegistrationSchema = () => {
  return z
    .object({
      email: z
        .string()
        .email({ message: "Please enter a valid email address." }),
      password: createPasswordSchema(),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: PASSWORD_MESSAGES.MATCH,
      path: ["confirmPassword"],
    });
};
