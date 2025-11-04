import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Define common validation schemas
const emailSchema = z.string().email('Invalid email format');

const requestTitleSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must not exceed 100 characters'),
});

const requestFormSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must not exceed 100 characters'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must not exceed 2000 characters'),
  type: z.enum(['design', 'development', 'bug-fix', 'enhancement', 'consultation']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  timeline: z.string().optional(),
});

const fileUploadSchema = z.object({
  name: z.string(),
  size: z.number().max(10 * 1024 * 1024, 'File size must not exceed 10MB'),
  type: z
    .string()
    .refine(
      (type) =>
        ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'].includes(type),
      'File type must be JPEG, PNG, GIF, or PDF'
    ),
});

describe('Validation Schemas', () => {
  describe('Email Validation', () => {
    it('should accept valid email addresses', () => {
      expect(() => emailSchema.parse('test@example.com')).not.toThrow();
      expect(() => emailSchema.parse('user.name@company.co.uk')).not.toThrow();
      expect(() => emailSchema.parse('test+tag@domain.com')).not.toThrow();
    });

    it('should reject invalid email addresses', () => {
      expect(() => emailSchema.parse('invalid')).toThrow('Invalid email format');
      expect(() => emailSchema.parse('test@')).toThrow();
      expect(() => emailSchema.parse('@example.com')).toThrow();
      expect(() => emailSchema.parse('test @example.com')).toThrow();
    });

    it('should reject empty strings', () => {
      expect(() => emailSchema.parse('')).toThrow();
    });
  });

  describe('Request Title Validation', () => {
    it('should accept valid titles', () => {
      expect(() =>
        requestTitleSchema.parse({ title: 'Valid Title' })
      ).not.toThrow();
      expect(() =>
        requestTitleSchema.parse({ title: 'A slightly longer but still valid title' })
      ).not.toThrow();
    });

    it('should reject titles that are too short', () => {
      expect(() => requestTitleSchema.parse({ title: 'abc' })).toThrow(
        'Title must be at least 5 characters'
      );
      expect(() => requestTitleSchema.parse({ title: 'ab' })).toThrow();
    });

    it('should reject titles that are too long', () => {
      const longTitle = 'a'.repeat(101);
      expect(() => requestTitleSchema.parse({ title: longTitle })).toThrow(
        'Title must not exceed 100 characters'
      );
    });

    it('should accept title at maximum length', () => {
      const maxTitle = 'a'.repeat(100);
      expect(() => requestTitleSchema.parse({ title: maxTitle })).not.toThrow();
    });
  });

  describe('Request Form Validation', () => {
    const validRequest = {
      title: 'Valid Request Title',
      description:
        'This is a valid description that meets the minimum character requirement for the form.',
      type: 'design' as const,
      priority: 'medium' as const,
    };

    it('should accept valid request forms', () => {
      expect(() => requestFormSchema.parse(validRequest)).not.toThrow();
    });

    it('should accept all valid request types', () => {
      const types = ['design', 'development', 'bug-fix', 'enhancement', 'consultation'];

      types.forEach((type) => {
        expect(() =>
          requestFormSchema.parse({ ...validRequest, type })
        ).not.toThrow();
      });
    });

    it('should accept all valid priority levels', () => {
      const priorities = ['low', 'medium', 'high', 'urgent'];

      priorities.forEach((priority) => {
        expect(() =>
          requestFormSchema.parse({ ...validRequest, priority })
        ).not.toThrow();
      });
    });

    it('should reject invalid request types', () => {
      expect(() =>
        requestFormSchema.parse({ ...validRequest, type: 'invalid' })
      ).toThrow();
    });

    it('should reject invalid priority levels', () => {
      expect(() =>
        requestFormSchema.parse({ ...validRequest, priority: 'critical' })
      ).toThrow();
    });

    it('should reject descriptions that are too short', () => {
      expect(() =>
        requestFormSchema.parse({ ...validRequest, description: 'Too short' })
      ).toThrow('Description must be at least 20 characters');
    });

    it('should reject descriptions that are too long', () => {
      const longDescription = 'a'.repeat(2001);
      expect(() =>
        requestFormSchema.parse({ ...validRequest, description: longDescription })
      ).toThrow('Description must not exceed 2000 characters');
    });

    it('should accept optional timeline', () => {
      expect(() =>
        requestFormSchema.parse({ ...validRequest, timeline: '3 days' })
      ).not.toThrow();
      expect(() => requestFormSchema.parse(validRequest)).not.toThrow();
    });
  });

  describe('File Upload Validation', () => {
    it('should accept valid image files', () => {
      const imageTypes = ['image/jpeg', 'image/png', 'image/gif'];

      imageTypes.forEach((type) => {
        expect(() =>
          fileUploadSchema.parse({
            name: 'test-image.jpg',
            size: 1024 * 1024, // 1MB
            type,
          })
        ).not.toThrow();
      });
    });

    it('should accept valid PDF files', () => {
      expect(() =>
        fileUploadSchema.parse({
          name: 'document.pdf',
          size: 2 * 1024 * 1024, // 2MB
          type: 'application/pdf',
        })
      ).not.toThrow();
    });

    it('should reject files that are too large', () => {
      const largeFile = {
        name: 'large-file.jpg',
        size: 11 * 1024 * 1024, // 11MB
        type: 'image/jpeg',
      };

      expect(() => fileUploadSchema.parse(largeFile)).toThrow(
        'File size must not exceed 10MB'
      );
    });

    it('should reject invalid file types', () => {
      const invalidFile = {
        name: 'script.js',
        size: 1024,
        type: 'application/javascript',
      };

      expect(() => fileUploadSchema.parse(invalidFile)).toThrow(
        'File type must be JPEG, PNG, GIF, or PDF'
      );
    });

    it('should accept file at maximum size', () => {
      const maxSizeFile = {
        name: 'max-size.jpg',
        size: 10 * 1024 * 1024, // Exactly 10MB
        type: 'image/jpeg',
      };

      expect(() => fileUploadSchema.parse(maxSizeFile)).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty strings in title validation', () => {
      expect(() => requestTitleSchema.parse({ title: '' })).toThrow();
    });

    it('should handle 4-character strings (below minimum)', () => {
      expect(() => requestTitleSchema.parse({ title: 'abcd' })).toThrow(
        'Title must be at least 5 characters'
      );
    });

    it('should handle standard ASCII emails', () => {
      expect(() => emailSchema.parse('test@example.com')).not.toThrow();
      expect(() => emailSchema.parse('user123@domain.org')).not.toThrow();
    });

    it('should handle special characters in title', () => {
      expect(() =>
        requestTitleSchema.parse({ title: 'Fix: Bug in @component #123' })
      ).not.toThrow();
    });

    it('should handle numbers in title', () => {
      expect(() =>
        requestTitleSchema.parse({ title: 'Update version 2.0' })
      ).not.toThrow();
    });

    it('should reject null values', () => {
      expect(() => requestTitleSchema.parse({ title: null })).toThrow();
    });

    it('should reject undefined values', () => {
      expect(() => requestTitleSchema.parse({ title: undefined })).toThrow();
    });
  });
});
