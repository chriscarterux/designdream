import { z } from 'zod';

// Request type enum
export const RequestTypeEnum = z.enum(['design', 'development', 'ai']);

// Priority enum
export const PriorityEnum = z.enum(['low', 'medium', 'high', 'urgent']);

// File upload schema
export const FileSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: z.number(),
  type: z.string(),
  url: z.string().optional(),
  file: z.instanceof(File).optional(),
});

// Success criteria item schema
export const SuccessCriteriaItemSchema = z.object({
  id: z.string(),
  text: z.string().min(1, 'Success criteria cannot be empty'),
  completed: z.boolean().default(false),
});

// Step 1: Request Type
export const Step1Schema = z.object({
  requestType: RequestTypeEnum,
});

// Step 2: Title & Description
export const Step2Schema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must not exceed 100 characters'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must not exceed 2000 characters'),
});

// Step 3: Priority & Timeline
export const Step3Schema = z.object({
  priority: PriorityEnum,
  estimatedTimeline: z
    .string()
    .min(1, 'Please provide an estimated timeline'),
  deadline: z.string().optional(),
});

// Step 4: Success Criteria
export const Step4Schema = z.object({
  successCriteria: z
    .array(SuccessCriteriaItemSchema)
    .min(1, 'Please add at least one success criterion'),
});

// Step 5: File Upload
export const Step5Schema = z.object({
  files: z.array(FileSchema).max(10, 'Maximum 10 files allowed'),
});

// Complete request schema (all steps combined)
export const RequestFormSchema = z.object({
  requestType: RequestTypeEnum,
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must not exceed 100 characters'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must not exceed 2000 characters'),
  priority: PriorityEnum,
  estimatedTimeline: z
    .string()
    .min(1, 'Please provide an estimated timeline'),
  deadline: z.string().optional(),
  successCriteria: z
    .array(SuccessCriteriaItemSchema)
    .min(1, 'Please add at least one success criterion'),
  files: z.array(FileSchema).max(10, 'Maximum 10 files allowed'),
  status: z.enum(['draft', 'submitted']).default('draft'),
});

// Type exports
export type RequestType = z.infer<typeof RequestTypeEnum>;
export type Priority = z.infer<typeof PriorityEnum>;
export type FileUpload = z.infer<typeof FileSchema>;
export type SuccessCriteriaItem = z.infer<typeof SuccessCriteriaItemSchema>;
export type RequestFormData = z.infer<typeof RequestFormSchema>;
export type Step1Data = z.infer<typeof Step1Schema>;
export type Step2Data = z.infer<typeof Step2Schema>;
export type Step3Data = z.infer<typeof Step3Schema>;
export type Step4Data = z.infer<typeof Step4Schema>;
export type Step5Data = z.infer<typeof Step5Schema>;

// Helper function to get request type label
export function getRequestTypeLabel(type: RequestType): string {
  const labels: Record<RequestType, string> = {
    design: 'Design',
    development: 'Development',
    ai: 'AI/Machine Learning',
  };
  return labels[type];
}

// Helper function to get priority label
export function getPriorityLabel(priority: Priority): string {
  const labels: Record<Priority, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
  };
  return labels[priority];
}

// Helper function to get priority color
export function getPriorityColor(priority: Priority): string {
  const colors: Record<Priority, string> = {
    low: 'text-gray-600',
    medium: 'text-blue-600',
    high: 'text-orange-600',
    urgent: 'text-red-600',
  };
  return colors[priority];
}
