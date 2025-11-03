import { validatePassword } from '@/lib/password-validation';

describe('Password Validation', () => {
  describe('validatePassword', () => {
    it('should reject passwords shorter than 12 characters', () => {
      const result = validatePassword('Short1!');
      expect(result.isValid).toBe(false);
      expect(result.requirements.find(r => r.label === 'Minimum 12 characters')?.met).toBe(false);
    });

    it('should reject passwords without uppercase letters', () => {
      const result = validatePassword('lowercase123!');
      expect(result.isValid).toBe(false);
      expect(result.requirements.find(r => r.label === 'One uppercase letter')?.met).toBe(false);
    });

    it('should reject passwords without lowercase letters', () => {
      const result = validatePassword('UPPERCASE123!');
      expect(result.isValid).toBe(false);
      expect(result.requirements.find(r => r.label === 'One lowercase letter')?.met).toBe(false);
    });

    it('should reject passwords without numbers', () => {
      const result = validatePassword('NoNumbersHere!');
      expect(result.isValid).toBe(false);
      expect(result.requirements.find(r => r.label === 'One number')?.met).toBe(false);
    });

    it('should reject passwords without special characters', () => {
      const result = validatePassword('NoSpecial123');
      expect(result.isValid).toBe(false);
      expect(result.requirements.find(r => r.label === 'One special character')?.met).toBe(false);
    });

    it('should reject common passwords', () => {
      const result = validatePassword('password123');
      expect(result.isValid).toBe(false);
      expect(result.requirements.find(r => r.label === 'Not a common password')?.met).toBe(false);
    });

    it('should accept strong passwords meeting all requirements', () => {
      const result = validatePassword('MySecure#Pass123');
      expect(result.isValid).toBe(true);
      expect(result.requirements.every(r => r.met)).toBe(true);
    });

    it('should accept passwords with various special characters', () => {
      const passwords = [
        'TestPass123!',
        'TestPass123@',
        'TestPass123#',
        'TestPass123$',
        'TestPass123%',
        'TestPass123^',
        'TestPass123&',
        'TestPass123*',
      ];

      passwords.forEach(password => {
        const result = validatePassword(password);
        expect(result.requirements.find(r => r.label === 'One special character')?.met).toBe(true);
      });
    });

    it('should calculate password strength scores correctly', () => {
      // Very weak passwords should have low scores
      const weakResult = validatePassword('aaaaaaaaaaaa');
      expect(weakResult.score).toBeLessThan(2);

      // Strong passwords should have high scores
      const strongResult = validatePassword('MyV3ry$ecure&P@ssw0rd!2024');
      expect(strongResult.score).toBeGreaterThanOrEqual(3);
    });

    it('should provide feedback for weak passwords', () => {
      const result = validatePassword('Test1234!');
      expect(result.feedback.length).toBeGreaterThan(0);
    });

    it('should mark password as invalid if zxcvbn score is below 2', () => {
      // Even if all requirements are met, password must have a fair score
      const result = validatePassword('Aa1!aaaaaaaaa');
      // This meets all requirements but might be too predictable
      if (result.score < 2) {
        expect(result.isValid).toBe(false);
      }
    });

    it('should return appropriate strength labels', () => {
      const veryWeak = validatePassword('abc');
      expect(['very-weak', 'weak']).toContain(veryWeak.strength);

      const strong = validatePassword('Xk9#mP2$qL5&nR8@vT3!');
      expect(['good', 'strong']).toContain(strong.strength);
    });

    it('should handle empty passwords', () => {
      const result = validatePassword('');
      expect(result.isValid).toBe(false);
      expect(result.score).toBe(0);
    });

    it('should detect common password variations', () => {
      const commonPasswords = [
        'Password123',
        'password',
        'qwerty',
        'letmein',
        'admin',
      ];

      commonPasswords.forEach(password => {
        const result = validatePassword(password);
        // These should either fail the common password check or have a low score
        expect(result.isValid).toBe(false);
      });
    });

    it('should accept long passphrases', () => {
      const result = validatePassword('CorrectHorseBatteryStaple123!');
      expect(result.requirements.find(r => r.label === 'Minimum 12 characters')?.met).toBe(true);
      // Should be strong due to length and entropy
      expect(result.score).toBeGreaterThanOrEqual(2);
    });

    it('should provide crack time estimates', () => {
      const result = validatePassword('MySecure#Pass123');
      expect(result.crackTimeDisplay).toBeDefined();
      expect(result.crackTimeDisplay.length).toBeGreaterThan(0);
    });
  });
});
