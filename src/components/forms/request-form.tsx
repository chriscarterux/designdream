'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CheckCircle2,
  Layers,
  FileText,
  Flag,
  Target,
  Upload,
  Eye,
  Save,
  Send,
  Plus,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { FileUploadComponent } from './file-upload';
import { useRequestForm, FormStep } from '@/hooks/use-request-form';
import {
  RequestFormData,
  RequestFormSchema,
  getRequestTypeLabel,
  getPriorityLabel,
  getPriorityColor,
} from '@/lib/validations/request.schema';
import { cn } from '@/lib/utils';

interface RequestFormProps {
  defaultValues?: Partial<RequestFormData>;
  onSubmit: (data: RequestFormData) => Promise<void>;
  onSaveDraft?: () => void;
}

const STEPS = [
  { number: 1, title: 'Request Type', icon: Layers },
  { number: 2, title: 'Details', icon: FileText },
  { number: 3, title: 'Priority & Timeline', icon: Flag },
  { number: 4, title: 'Success Criteria', icon: Target },
  { number: 5, title: 'File Upload', icon: Upload },
  { number: 6, title: 'Review', icon: Eye },
] as const;

export function RequestForm({ defaultValues, onSubmit, onSaveDraft }: RequestFormProps) {
  // Initialize form
  const form = useForm<RequestFormData>({
    resolver: zodResolver(RequestFormSchema),
    defaultValues: {
      requestType: defaultValues?.requestType || undefined,
      title: defaultValues?.title || '',
      description: defaultValues?.description || '',
      priority: defaultValues?.priority || undefined,
      estimatedTimeline: defaultValues?.estimatedTimeline || '',
      deadline: defaultValues?.deadline || '',
      successCriteria: defaultValues?.successCriteria || [],
      files: defaultValues?.files || [],
      status: 'draft',
    },
  });

  // Use custom hook for form state
  const {
    currentStep,
    isFirstStep,
    isLastStep,
    canGoNext,
    goToStep,
    goNext,
    goBack,
    handleSubmit: submitForm,
    saveDraft,
    isSubmitting,
    isSavingDraft,
    completedSteps,
  } = useRequestForm({ form, onSubmit });

  // Handle next button click
  const handleNext = async () => {
    const success = await goNext();
    if (!success) {
      // Validation failed, errors will be shown by the form
      console.log('Validation failed');
    }
  };

  // Add success criterion
  const addSuccessCriterion = () => {
    const current = form.getValues('successCriteria') || [];
    form.setValue('successCriteria', [
      ...current,
      { id: Date.now().toString(), text: '', completed: false },
    ]);
  };

  // Remove success criterion
  const removeSuccessCriterion = (id: string) => {
    const current = form.getValues('successCriteria') || [];
    form.setValue(
      'successCriteria',
      current.filter((item) => item.id !== id)
    );
  };

  // Calculate progress percentage
  const progressPercentage = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Progress indicator */}
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Submit New Request</CardTitle>
                <CardDescription>
                  Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].title}
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={saveDraft}
                disabled={isSavingDraft}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSavingDraft ? 'Saving...' : 'Save Draft'}
              </Button>
            </div>

            {/* Progress bar */}
            <Progress value={progressPercentage} className="h-2" />

            {/* Step indicators */}
            <div className="flex items-center justify-between">
              {STEPS.map((step) => {
                const Icon = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = completedSteps.has(step.number);

                return (
                  <button
                    key={step.number}
                    type="button"
                    onClick={() => goToStep(step.number as FormStep)}
                    className={cn(
                      'flex flex-col items-center space-y-1 text-xs transition-colors',
                      isActive
                        ? 'text-purple-600'
                        : isCompleted
                        ? 'text-green-600'
                        : 'text-gray-400'
                    )}
                    disabled={!isCompleted && step.number > currentStep}
                  >
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors',
                        isActive
                          ? 'border-purple-600 bg-purple-50'
                          : isCompleted
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-300 bg-white'
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <span className="hidden sm:inline">{step.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Form content */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitForm)} className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              {/* Step 1: Request Type */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="requestType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          What type of request is this?
                        </FormLabel>
                        <FormDescription>
                          Select the category that best matches your request
                        </FormDescription>
                        <FormControl>
                          <div className="grid gap-4 sm:grid-cols-3">
                            {(['design', 'development', 'ai'] as const).map((type) => (
                              <button
                                key={type}
                                type="button"
                                onClick={() => field.onChange(type)}
                                className={cn(
                                  'flex flex-col items-center space-y-3 rounded-lg border-2 p-6 transition-all hover:border-purple-300',
                                  field.value === type
                                    ? 'border-purple-600 bg-purple-50'
                                    : 'border-gray-200 bg-white'
                                )}
                              >
                                <Layers className="h-8 w-8 text-purple-600" />
                                <span className="font-medium">
                                  {getRequestTypeLabel(type)}
                                </span>
                              </button>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 2: Title & Description */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Request Title
                        </FormLabel>
                        <FormDescription>
                          Provide a clear, concise title for your request
                        </FormDescription>
                        <FormControl>
                          <Input
                            placeholder="e.g., Redesign user dashboard layout"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Description
                        </FormLabel>
                        <FormDescription>
                          Describe your request in detail. What problem are you solving?
                        </FormDescription>
                        <FormControl>
                          <Textarea
                            placeholder="Provide a detailed description of what you need..."
                            rows={8}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 3: Priority & Timeline */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Priority</FormLabel>
                        <FormDescription>
                          How urgent is this request?
                        </FormDescription>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {(['low', 'medium', 'high', 'urgent'] as const).map(
                              (priority) => (
                                <SelectItem key={priority} value={priority}>
                                  <span className={getPriorityColor(priority)}>
                                    {getPriorityLabel(priority)}
                                  </span>
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="estimatedTimeline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Estimated Timeline
                        </FormLabel>
                        <FormDescription>
                          How long do you estimate this will take?
                        </FormDescription>
                        <FormControl>
                          <Input placeholder="e.g., 2-3 weeks, 5 days, 1 month" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Deadline (Optional)
                        </FormLabel>
                        <FormDescription>
                          Is there a specific deadline for this request?
                        </FormDescription>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 4: Success Criteria */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-semibold">Success Criteria</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Define what success looks like for this request
                    </p>
                  </div>

                  <div className="space-y-3">
                    {(form.watch('successCriteria') || []).map((criterion, index) => (
                      <div key={criterion.id} className="flex gap-2">
                        <FormField
                          control={form.control}
                          name={`successCriteria.${index}.text`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  placeholder="e.g., All pages load in under 2 seconds"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSuccessCriterion(criterion.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addSuccessCriterion}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Success Criterion
                  </Button>

                  {form.formState.errors.successCriteria && (
                    <p className="text-sm text-red-600">
                      {form.formState.errors.successCriteria.message}
                    </p>
                  )}
                </div>
              )}

              {/* Step 5: File Upload */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-semibold">Upload Files (Optional)</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Add any relevant files, images, or documents
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="files"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUploadComponent
                            files={field.value || []}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 6: Review */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-semibold">Review Your Request</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Please review all information before submitting
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Request Type */}
                    <div className="rounded-lg border p-4">
                      <p className="text-sm font-medium text-gray-500">Request Type</p>
                      <p className="mt-1 text-base font-semibold">
                        {form.watch('requestType') &&
                          getRequestTypeLabel(form.watch('requestType'))}
                      </p>
                    </div>

                    {/* Title */}
                    <div className="rounded-lg border p-4">
                      <p className="text-sm font-medium text-gray-500">Title</p>
                      <p className="mt-1 text-base font-semibold">
                        {form.watch('title')}
                      </p>
                    </div>

                    {/* Description */}
                    <div className="rounded-lg border p-4">
                      <p className="text-sm font-medium text-gray-500">Description</p>
                      <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">
                        {form.watch('description')}
                      </p>
                    </div>

                    {/* Priority & Timeline */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-lg border p-4">
                        <p className="text-sm font-medium text-gray-500">Priority</p>
                        <p
                          className={cn(
                            'mt-1 text-base font-semibold',
                            form.watch('priority') &&
                              getPriorityColor(form.watch('priority'))
                          )}
                        >
                          {form.watch('priority') &&
                            getPriorityLabel(form.watch('priority'))}
                        </p>
                      </div>
                      <div className="rounded-lg border p-4">
                        <p className="text-sm font-medium text-gray-500">
                          Estimated Timeline
                        </p>
                        <p className="mt-1 text-base font-semibold">
                          {form.watch('estimatedTimeline')}
                        </p>
                      </div>
                    </div>

                    {/* Success Criteria */}
                    <div className="rounded-lg border p-4">
                      <p className="text-sm font-medium text-gray-500">Success Criteria</p>
                      <ul className="mt-2 space-y-1">
                        {(form.watch('successCriteria') || []).map((criterion) => (
                          <li key={criterion.id} className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                            <span className="text-sm text-gray-700">{criterion.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Files */}
                    {form.watch('files') && form.watch('files').length > 0 && (
                      <div className="rounded-lg border p-4">
                        <p className="text-sm font-medium text-gray-500">
                          Attached Files ({form.watch('files').length})
                        </p>
                        <ul className="mt-2 space-y-1">
                          {form.watch('files').map((file) => (
                            <li key={file.id} className="text-sm text-gray-700">
                              {file.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goBack}
                  disabled={isFirstStep}
                >
                  Back
                </Button>

                {!isLastStep ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={!canGoNext}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
