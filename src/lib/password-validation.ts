import zxcvbn from 'zxcvbn';

/**
 * Common weak passwords to explicitly block
 * These are commonly used passwords that should never be allowed
 */
const COMMON_PASSWORDS = [
  'password',
  'password123',
  'Password123',
  '123456',
  '12345678',
  'qwerty',
  'abc123',
  'monkey',
  '1234567',
  'letmein',
  'trustno1',
  'dragon',
  'baseball',
  'iloveyou',
  'master',
  'sunshine',
  'ashley',
  'bailey',
  'passw0rd',
  'shadow',
  'superman',
  'qazwsx',
  'michael',
  'football',
  'welcome',
  'jesus',
  'ninja',
  'mustang',
  'password1',
  'admin',
  'changeme',
  'test123',
  'demo123',
];

/**
 * Password requirement checks
 */
export interface PasswordRequirement {
  met: boolean;
  label: string;
  description: string;
}

export interface PasswordValidationResult {
  isValid: boolean;
  score: number; // 0-4 from zxcvbn
  strength: 'very-weak' | 'weak' | 'fair' | 'good' | 'strong';
  requirements: PasswordRequirement[];
  feedback: string[];
  crackTimeDisplay: string;
}

/**
 * Check if password meets minimum length requirement (12 characters)
 */
const checkMinLength = (password: string): PasswordRequirement => ({
  met: password.length >= 12,
  label: 'Minimum 12 characters',
  description: 'Password must be at least 12 characters long',
});

/**
 * Check if password contains at least one uppercase letter
 */
const checkUppercase = (password: string): PasswordRequirement => ({
  met: /[A-Z]/.test(password),
  label: 'One uppercase letter',
  description: 'Password must contain at least one uppercase letter (A-Z)',
});

/**
 * Check if password contains at least one lowercase letter
 */
const checkLowercase = (password: string): PasswordRequirement => ({
  met: /[a-z]/.test(password),
  label: 'One lowercase letter',
  description: 'Password must contain at least one lowercase letter (a-z)',
});

/**
 * Check if password contains at least one number
 */
const checkNumber = (password: string): PasswordRequirement => ({
  met: /[0-9]/.test(password),
  label: 'One number',
  description: 'Password must contain at least one number (0-9)',
});

/**
 * Check if password contains at least one special character
 */
const checkSpecialChar = (password: string): PasswordRequirement => ({
  met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password),
  label: 'One special character',
  description: 'Password must contain at least one special character (!@#$%^&* etc.)',
});

/**
 * Check if password is in the common passwords list
 */
const checkCommonPassword = (password: string): PasswordRequirement => ({
  met: !COMMON_PASSWORDS.includes(password.toLowerCase()),
  label: 'Not a common password',
  description: 'Password must not be a commonly used password',
});

/**
 * Validate password strength and requirements
 */
export function validatePassword(password: string): PasswordValidationResult {
  // Check all requirements
  const requirements: PasswordRequirement[] = [
    checkMinLength(password),
    checkUppercase(password),
    checkLowercase(password),
    checkNumber(password),
    checkSpecialChar(password),
    checkCommonPassword(password),
  ];

  // Check if all requirements are met
  const allRequirementsMet = requirements.every((req) => req.met);

  // Use zxcvbn for advanced strength checking
  const zxcvbnResult = zxcvbn(password);

  // Map zxcvbn score (0-4) to our strength levels
  const strengthLevels: Array<'very-weak' | 'weak' | 'fair' | 'good' | 'strong'> = [
    'very-weak',
    'weak',
    'fair',
    'good',
    'strong',
  ];
  const strength = strengthLevels[zxcvbnResult.score];

  // Build feedback array
  const feedback: string[] = [];

  // Add zxcvbn warnings and suggestions
  if (zxcvbnResult.feedback.warning) {
    feedback.push(zxcvbnResult.feedback.warning);
  }
  if (zxcvbnResult.feedback.suggestions) {
    feedback.push(...zxcvbnResult.feedback.suggestions);
  }

  // Add custom feedback for unmet requirements
  requirements.forEach((req) => {
    if (!req.met) {
      feedback.push(req.description);
    }
  });

  // Format crack time display - ensure it's always a string
  const crackTimeDisplay = String(
    zxcvbnResult.crack_times_display.offline_slow_hashing_1e4_per_second
  );

  // Password is valid if all requirements are met AND zxcvbn score is at least 2 (fair)
  const isValid = allRequirementsMet && zxcvbnResult.score >= 2;

  return {
    isValid,
    score: zxcvbnResult.score,
    strength,
    requirements,
    feedback,
    crackTimeDisplay,
  };
}

/**
 * Get color for password strength indicator
 */
export function getStrengthColor(strength: PasswordValidationResult['strength']): string {
  switch (strength) {
    case 'very-weak':
      return 'bg-red-500';
    case 'weak':
      return 'bg-orange-500';
    case 'fair':
      return 'bg-yellow-500';
    case 'good':
      return 'bg-blue-500';
    case 'strong':
      return 'bg-green-500';
    default:
      return 'bg-gray-300';
  }
}

/**
 * Get text color for password strength indicator
 */
export function getStrengthTextColor(strength: PasswordValidationResult['strength']): string {
  switch (strength) {
    case 'very-weak':
      return 'text-red-600';
    case 'weak':
      return 'text-orange-600';
    case 'fair':
      return 'text-yellow-600';
    case 'good':
      return 'text-blue-600';
    case 'strong':
      return 'text-green-600';
    default:
      return 'text-gray-600';
  }
}

/**
 * Get width percentage for strength bar (0-100)
 */
export function getStrengthWidth(score: number): number {
  // Map score 0-4 to percentage 0-100
  return (score / 4) * 100;
}

/**
 * Get display label for strength level
 */
export function getStrengthLabel(strength: PasswordValidationResult['strength']): string {
  switch (strength) {
    case 'very-weak':
      return 'Very Weak';
    case 'weak':
      return 'Weak';
    case 'fair':
      return 'Fair';
    case 'good':
      return 'Good';
    case 'strong':
      return 'Strong';
    default:
      return '';
  }
}
