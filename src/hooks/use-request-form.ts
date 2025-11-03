'use client';

import { useState, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { RequestFormData } from '@/lib/validations/request.schema';

export type FormStep = 1 | 2 | 3 | 4 | 5 | 6;

interface UseRequestFormProps {
  form: UseFormReturn<RequestFormData>;
  onSubmit: (data: RequestFormData) => Promise<void>;
}

interface UseRequestFormReturn {
  currentStep: FormStep;
  isFirstStep: boolean;
  isLastStep: boolean;
  canGoNext: boolean;
  goToStep: (step: FormStep) => void;
  goNext: () => Promise<boolean>;
  goBack: () => void;
  handleSubmit: () => Promise<void>;
  saveDraft: () => Promise<void>;
  isSubmitting: boolean;
  isSavingDraft: boolean;
  completedSteps: Set<number>;
}

const TOTAL_STEPS = 6;

export function useRequestForm({
  form,
  onSubmit,
}: UseRequestFormProps): UseRequestFormReturn {
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === TOTAL_STEPS;

  // Validate current step
  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    const values = form.getValues();

    switch (currentStep) {
      case 1:
        return form.trigger('requestType');
      case 2:
        return form.trigger(['title', 'description']);
      case 3:
        return form.trigger(['priority', 'estimatedTimeline']);
      case 4:
        return form.trigger('successCriteria');
      case 5:
        return form.trigger('files');
      case 6:
        // Review step - validate all fields
        return form.trigger();
      default:
        return true;
    }
  }, [currentStep, form]);

  // Check if we can go to next step
  const canGoNext = useCallback(() => {
    const values = form.getValues();

    switch (currentStep) {
      case 1:
        return !!values.requestType;
      case 2:
        return !!values.title && !!values.description;
      case 3:
        return !!values.priority && !!values.estimatedTimeline;
      case 4:
        return values.successCriteria && values.successCriteria.length > 0;
      case 5:
        return true; // Files are optional
      case 6:
        return true;
      default:
        return false;
    }
  }, [currentStep, form]);

  // Go to specific step
  const goToStep = useCallback(
    (step: FormStep) => {
      if (step >= 1 && step <= TOTAL_STEPS) {
        setCurrentStep(step);
      }
    },
    []
  );

  // Go to next step
  const goNext = useCallback(async (): Promise<boolean> => {
    const isValid = await validateCurrentStep();

    if (isValid && currentStep < TOTAL_STEPS) {
      setCompletedSteps((prev) => new Set(prev).add(currentStep));
      setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS) as FormStep);
      return true;
    }

    return false;
  }, [currentStep, validateCurrentStep]);

  // Go to previous step
  const goBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => Math.max(prev - 1, 1) as FormStep);
    }
  }, [currentStep]);

  // Handle final form submission
  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);

    try {
      const isValid = await form.trigger();

      if (!isValid) {
        throw new Error('Please fix validation errors');
      }

      const data = form.getValues();
      await onSubmit({ ...data, status: 'submitted' });
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [form, onSubmit]);

  // Save draft
  const saveDraft = useCallback(async () => {
    setIsSavingDraft(true);

    try {
      const data = form.getValues();

      // Store draft in localStorage
      localStorage.setItem('requestFormDraft', JSON.stringify(data));

      // You could also save to a backend API here
      // await saveDraftToAPI({ ...data, status: 'draft' });

      console.log('Draft saved successfully');
    } catch (error) {
      console.error('Error saving draft:', error);
      throw error;
    } finally {
      setIsSavingDraft(false);
    }
  }, [form]);

  return {
    currentStep,
    isFirstStep,
    isLastStep,
    canGoNext: canGoNext(),
    goToStep,
    goNext,
    goBack,
    handleSubmit,
    saveDraft,
    isSubmitting,
    isSavingDraft,
    completedSteps,
  };
}

// Hook to load draft from localStorage
export function useLoadDraft() {
  const [draft, setDraft] = useState<RequestFormData | null>(null);

  const loadDraft = useCallback(() => {
    try {
      const savedDraft = localStorage.getItem('requestFormDraft');
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        setDraft(parsed);
        return parsed;
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
    return null;
  }, []);

  const clearDraft = useCallback(() => {
    localStorage.removeItem('requestFormDraft');
    setDraft(null);
  }, []);

  return { draft, loadDraft, clearDraft };
}
