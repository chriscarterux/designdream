'use client';

import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import {
  validatePassword,
  getStrengthColor,
  getStrengthTextColor,
  getStrengthWidth,
  getStrengthLabel,
  type PasswordValidationResult,
} from '@/lib/password-validation';

interface PasswordStrengthMeterProps {
  password: string;
  onValidationChange?: (result: PasswordValidationResult) => void;
}

export function PasswordStrengthMeter({
  password,
  onValidationChange,
}: PasswordStrengthMeterProps) {
  const [validation, setValidation] = useState<PasswordValidationResult | null>(null);

  useEffect(() => {
    if (password.length === 0) {
      setValidation(null);
      onValidationChange?.(validatePassword(''));
      return;
    }

    const result = validatePassword(password);
    setValidation(result);
    onValidationChange?.(result);
  }, [password, onValidationChange]);

  // Don't show anything if no password entered
  if (!validation || password.length === 0) {
    return null;
  }

  const strengthWidth = getStrengthWidth(validation.score);
  const strengthColor = getStrengthColor(validation.strength);
  const strengthTextColor = getStrengthTextColor(validation.strength);
  const strengthLabel = getStrengthLabel(validation.strength);

  return (
    <div className="space-y-3 rounded-md border border-border bg-muted/50 p-3">
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-muted-foreground">Password strength:</span>
          <span className={`font-semibold ${strengthTextColor}`}>{strengthLabel}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className={`h-full transition-all duration-300 ${strengthColor}`}
            style={{ width: `${strengthWidth}%` }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">Requirements:</p>
        <ul className="space-y-1">
          {validation.requirements.map((requirement, index) => (
            <li
              key={index}
              className={`flex items-start gap-2 text-xs ${
                requirement.met ? 'text-green-600' : 'text-muted-foreground'
              }`}
            >
              <span className="mt-0.5 flex-shrink-0">
                {requirement.met ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <X className="h-3.5 w-3.5" />
                )}
              </span>
              <span>{requirement.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Feedback Messages */}
      {validation.feedback.length > 0 && !validation.isValid && (
        <div className="space-y-1 border-t border-border pt-2">
          <p className="text-xs font-medium text-muted-foreground">Suggestions:</p>
          <ul className="space-y-1">
            {validation.feedback.slice(0, 3).map((message, index) => (
              <li key={index} className="text-xs text-muted-foreground">
                • {message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Crack Time Display */}
      {validation.isValid && (
        <div className="border-t border-border pt-2 text-xs text-muted-foreground">
          Time to crack: <span className="font-medium">{validation.crackTimeDisplay}</span>
        </div>
      )}
    </div>
  );
}
