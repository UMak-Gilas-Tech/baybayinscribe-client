import { z } from "zod";
import { COMMON_NAMES } from "@/lib/patterns/commonNames";
import { RESTRICTED_PATTERNS } from "@/lib/patterns/restricted";

// ============================================================================
// Constants & Patterns
// ============================================================================

// Basic patterns
export const NAME_PATTERN = /^[A-Za-z\s]+$/; // Only letters and spaces
export const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/; // Letters, numbers, and underscores only

// Common patterns for gibberish detection
export const REPEATED_CHARS = /(.)\1{3,}/; // More than 3 repeated characters
export const RANDOM_PATTERN = /[a-z]{16,}/i; // More than 15 consecutive letters
export const VOWEL_PATTERN = /[aeiou]/i; // Vowel pattern for names

// Minimum length for meaningful names
export const MIN_NAME_LENGTH = 2;
export const MIN_USERNAME_LENGTH = 3;

// ============================================================================
// Types & Interfaces
// ============================================================================
export type UserInfoFormData = z.infer<typeof userInfoSchema>;

export interface UserInfoFormProps {
  onSubmit: (values: UserInfoFormData) => Promise<void>;
  error: string;
  validationError?: string;
  isLoading: boolean;
}

// ============================================================================
// Helper Functions
// ============================================================================
function containsRestrictedTerms(text: string): boolean {
  const lowerText = text.toLowerCase();

  // Check against all restricted patterns
  return RESTRICTED_PATTERNS.some((pattern) => pattern.test(lowerText));
}

function isGibberishName(name: string): boolean {
  const lowerName = name.toLowerCase();

  // Check for restricted terms
  if (containsRestrictedTerms(lowerName)) {
    return true;
  }

  // Check for repeated characters (more than 3)
  if (REPEATED_CHARS.test(lowerName)) {
    return true;
  }

  // Check if name is too short
  if (lowerName.length < MIN_NAME_LENGTH) {
    return true;
  }

  // Check if name contains only one unique character
  const uniqueChars = new Set(lowerName.split(""));
  if (uniqueChars.size <= 1) {
    return true;
  }

  // Check for random character combinations (more than 4 consecutive random letters)
  if (RANDOM_PATTERN.test(lowerName)) {
    return true;
  }

  // Check if name has at least one vowel (most names have vowels)
  if (!VOWEL_PATTERN.test(lowerName)) {
    return true;
  }

  // Special case: Allow common short names
  if (COMMON_NAMES.has(lowerName)) {
    return false;
  }

  // Special case: Allow names with double letters (like Anna, Emma)
  if (/^[a-z]+(.)\1[a-z]+$/i.test(lowerName)) {
    return false;
  }

  // Special case: Allow short names with proper vowel-consonant pattern
  if (lowerName.length === 2) {
    const hasProperPattern =
      /^[aeiou][bcdfghjklmnpqrstvwxyz]$|^[bcdfghjklmnpqrstvwxyz][aeiou]$/i.test(
        lowerName
      );
    if (hasProperPattern) {
      return false;
    }
  }

  return false;
}

function isGibberishUsername(username: string): boolean {
  const lowerUsername = username.toLowerCase();

  // Check for restricted terms
  if (containsRestrictedTerms(lowerUsername)) {
    return true;
  }

  // Check for repeated characters
  if (REPEATED_CHARS.test(lowerUsername)) {
    return true;
  }

  // Check if username is too short
  if (lowerUsername.length < MIN_USERNAME_LENGTH) {
    return true;
  }

  // Check if username contains only one unique character
  const uniqueChars = new Set(lowerUsername.split(""));
  if (uniqueChars.size <= 1) {
    return true;
  }

  return false;
}

// ============================================================================
// Form Schema & Validation
// ============================================================================
export const userInfoSchema = z
  .object({
    username: z
      .string()
      .min(MIN_USERNAME_LENGTH, "Username must be at least 3 characters")
      .regex(
        USERNAME_PATTERN,
        "Username can only contain letters, numbers, and underscores"
      )
      .refine(
        (username) => !username.startsWith("_") && !username.endsWith("_"),
        "Username cannot start or end with an underscore"
      )
      .refine(
        (username) => !isGibberishUsername(username),
        "Please enter a valid username"
      )
      .refine(
        (username) => !containsRestrictedTerms(username),
        "Username contains inappropriate content"
      ),
    firstName: z
      .string()
      .min(MIN_NAME_LENGTH, "First name must be at least 2 characters")
      .regex(NAME_PATTERN, "First name can only contain letters and spaces")
      .refine(
        (name) => name.trim().length > 0,
        "First name cannot be only spaces"
      )
      .refine(
        (name) => !isGibberishName(name),
        "Please enter a valid first name"
      )
      .refine(
        (name) => !containsRestrictedTerms(name),
        "First name contains inappropriate content"
      ),
    lastName: z
      .string()
      .min(MIN_NAME_LENGTH, "Last name must be at least 2 characters")
      .regex(NAME_PATTERN, "Last name can only contain letters and spaces")
      .refine(
        (name) => name.trim().length > 0,
        "Last name cannot be only spaces"
      )
      .refine(
        (name) => !isGibberishName(name),
        "Please enter a valid last name"
      )
      .refine(
        (name) => !containsRestrictedTerms(name),
        "Last name contains inappropriate content"
      ),
    contactNumber: z.string().min(1, "Mobile number is required"),
    dateOfBirth: z
      .string()
      .min(1, "Date of birth is required")
      .refine(validateAge, "You must be at least 6 years old"),
    wantsNotifications: z.boolean().optional(),
  })
  .strict();

// ============================================================================
// Default Values
// ============================================================================
export const defaultFormValues: UserInfoFormData = {
  username: "",
  firstName: "",
  lastName: "",
  contactNumber: "",
  dateOfBirth: "",
  wantsNotifications: false,
};

// ============================================================================
// Helper Functions
// ============================================================================
function validateAge(dob: string): boolean {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= 6;
}

function normalizeContactNumber(contactNumber: string): string {
  return contactNumber.length === 10 ? "0" + contactNumber : contactNumber;
}

// ============================================================================
// API Functions
// ============================================================================
export const validateUserInfo = (data: unknown): UserInfoFormData => {
  return userInfoSchema.parse(data);
};

export const handleUserInfoSubmit = async (
  values: UserInfoFormData,
  onSubmit: (values: UserInfoFormData) => Promise<void>
): Promise<void> => {
  try {
    // Validate registration session
    const registrationSession = localStorage.getItem("registrationSession");
    if (!registrationSession) {
      throw new Error(
        "Registration session not found. Please start registration again."
      );
    }

    // Prepare data for API
    const normalizedContactNumber = normalizeContactNumber(
      values.contactNumber
    );
    const requestData = {
      ...values,
      contactNumber: normalizedContactNumber,
      wantsNotifications: values.wantsNotifications ?? false,
    };

    // Make API request
    const response = await fetch("/api/user.information", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Registration-Session": registrationSession,
      },
      body: JSON.stringify(requestData),
    });

    const data = await response.json();

    // Handle API response
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(
          "Registration session expired. Please start registration again."
        );
      }
      if (data.error === "Username already taken") {
        // Throw a specific error object for username taken
        throw { type: "apiError", data: data };
      }
      throw new Error(data.error || "Failed to submit information");
    }

    // Store user info
    localStorage.setItem("userInfo", JSON.stringify(requestData));

    // Complete registration
    await onSubmit(values);
  } catch (error) {
    console.error("Error in handleUserInfoSubmit:", error);
    // Re-throw the specific error object if it exists
    if (typeof error === 'object' && error !== null && 'type' in error && error.type === 'apiError') {
       throw error;
    }
    throw error instanceof Error
      ? error
      : new Error("Failed to submit user info");
  }
};
