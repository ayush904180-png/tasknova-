/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, ChangeEvent, KeyboardEvent, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react';
import { Eye, EyeOff, Search, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils';

export type ValidationState = 'default' | 'success' | 'warning' | 'error';

interface InputBaseProps {
  label?: string;
  helperText?: string;
  validationState?: ValidationState;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

// TEXT INPUT / EMAIL INPUT / PASSWORD INPUT / SEARCH INPUT
export interface TextInputProps {
  id: string;
  label?: string;
  helperText?: string;
  validationState?: ValidationState;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
  type?: string;
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export function TextInput({
  label,
  helperText,
  validationState = 'default',
  leftIcon,
  rightIcon,
  className,
  id,
  type = 'text',
  disabled,
  ...props
}: TextInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const actualType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const stateBorderClasses = {
    default: 'border-slate-200 focus:ring-slate-500 focus:border-slate-500 dark:border-white/5 dark:focus:ring-indigo-500 dark:focus:border-indigo-500 bg-white dark:bg-[#09090b]',
    success: 'border-brand-500 focus:ring-brand-500 focus:border-brand-500 bg-brand-50/5 dark:bg-emerald-500/5',
    warning: 'border-amber-500 focus:ring-amber-500 focus:border-amber-500 bg-amber-50/5 dark:bg-amber-500/5',
    error: 'border-rose-500 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/5 dark:bg-rose-500/5',
  };

  const stateTextClasses = {
    default: 'text-slate-500 dark:text-zinc-400',
    success: 'text-brand-600 dark:text-emerald-400',
    warning: 'text-amber-600 dark:text-amber-400',
    error: 'text-rose-600 dark:text-rose-400',
  };

  const statusIcon = {
    default: null,
    success: <CheckCircle className="h-4 w-4 text-brand-500 shrink-0" />,
    warning: <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />,
    error: <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />,
  };

  return (
    <div className="flex flex-col gap-1.5 w-full text-left" id={`input-container-${id}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold text-slate-700 dark:text-zinc-200 tracking-wide uppercase font-mono"
        >
          {label}
        </label>
      )}
      
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-3 text-slate-400 dark:text-zinc-500 pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}

        <input
          id={id}
          type={actualType}
          disabled={disabled}
          className={cn(
            'w-full h-10 px-3 py-2 text-sm rounded-lg border shadow-xs transition-all duration-200 outline-none',
            'placeholder-slate-400 dark:placeholder-zinc-600 font-sans text-slate-900 dark:text-white',
            leftIcon ? 'pl-9' : '',
            rightIcon || isPassword || validationState !== 'default' ? 'pr-10' : '',
            stateBorderClasses[validationState],
            disabled ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-zinc-900' : '',
            className
          )}
          aria-invalid={validationState === 'error'}
          aria-describedby={helperText ? `helper-${id}` : undefined}
          {...props}
        />

        {/* Right Actions: Password Toggle OR Validation Icons OR general icon */}
        <div className="absolute right-3 flex items-center gap-1.5 pointer-events-auto">
          {isPassword && !disabled && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors p-0.5 cursor-pointer focus:outline-none"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
          {validationState !== 'default' && statusIcon[validationState]}
          {!isPassword && validationState === 'default' && rightIcon}
        </div>
      </div>

      {helperText && (
        <p
          id={`helper-${id}`}
          className={cn('text-[11px] font-mono leading-none mt-0.5', stateTextClasses[validationState])}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}

// EMAIL INPUT (Pre-configured Shortcut Component)
export function EmailInput(props: Omit<TextInputProps, 'type'>) {
  return <TextInput type="email" placeholder="name@enterprise.com" {...props} />;
}

// PASSWORD INPUT (Pre-configured Shortcut Component)
export function PasswordInput(props: Omit<TextInputProps, 'type'>) {
  return <TextInput type="password" placeholder="••••••••" {...props} />;
}

// SEARCH INPUT (Pre-configured Shortcut Component)
export function SearchInput(props: Omit<TextInputProps, 'type' | 'leftIcon'>) {
  return (
    <TextInput
      type="search"
      leftIcon={<Search className="h-4 w-4 text-slate-400" />}
      placeholder="Search identifiers..."
      {...props}
    />
  );
}

// TEXTAREA COMPONENT
export interface TextareaProps {
  id: string;
  label?: string;
  helperText?: string;
  validationState?: ValidationState;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
}

export function Textarea({
  label,
  helperText,
  validationState = 'default',
  className,
  id,
  disabled,
  ...props
}: TextareaProps) {
  const stateBorderClasses = {
    default: 'border-slate-200 focus:ring-slate-500 focus:border-slate-500 dark:border-white/5 dark:focus:ring-indigo-500 dark:focus:border-indigo-500 bg-white dark:bg-[#09090b]',
    success: 'border-brand-500 focus:ring-brand-500 bg-brand-50/5 dark:bg-emerald-500/5',
    warning: 'border-amber-500 focus:ring-amber-500 bg-amber-50/5 dark:bg-amber-500/5',
    error: 'border-rose-500 focus:ring-rose-500 bg-rose-50/5 dark:bg-rose-500/5',
  };

  const stateTextClasses = {
    default: 'text-slate-500 dark:text-zinc-400',
    success: 'text-brand-600 dark:text-emerald-400',
    warning: 'text-amber-600 dark:text-amber-400',
    error: 'text-rose-600 dark:text-rose-400',
  };

  return (
    <div className="flex flex-col gap-1.5 w-full text-left" id={`textarea-container-${id}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold text-slate-700 dark:text-zinc-200 tracking-wide uppercase font-mono"
        >
          {label}
        </label>
      )}

      <textarea
        id={id}
        disabled={disabled}
        className={cn(
          'w-full min-h-[100px] px-3 py-2 text-sm rounded-lg border shadow-xs transition-all duration-200 outline-none font-sans text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600',
          stateBorderClasses[validationState],
          disabled ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-zinc-900' : '',
          className
        )}
        {...props}
      />

      {helperText && (
        <p className={cn('text-[11px] font-mono leading-none mt-0.5', stateTextClasses[validationState])}>
          {helperText}
        </p>
      )}
    </div>
  );
}

// DROPDOWN SELECT COMPONENT
export interface DropdownProps {
  id: string;
  options: { value: string; label: string }[];
  label?: string;
  helperText?: string;
  validationState?: ValidationState;
  className?: string;
  disabled?: boolean;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export function Dropdown({
  label,
  helperText,
  validationState = 'default',
  options,
  className,
  id,
  disabled,
  ...props
}: DropdownProps) {
  const stateBorderClasses = {
    default: 'border-slate-200 focus:ring-slate-500 focus:border-slate-500 dark:border-white/5 dark:focus:ring-indigo-500 dark:focus:border-indigo-500 bg-white dark:bg-[#09090b]',
    success: 'border-brand-500 focus:ring-brand-500 bg-brand-50/5 dark:bg-emerald-500/5',
    warning: 'border-amber-500 focus:ring-amber-500 bg-amber-50/5 dark:bg-amber-500/5',
    error: 'border-rose-500 focus:ring-rose-500 bg-rose-50/5 dark:bg-rose-500/5',
  };

  return (
    <div className="flex flex-col gap-1.5 w-full text-left" id={`dropdown-container-${id}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold text-slate-700 dark:text-zinc-200 tracking-wide uppercase font-mono"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <select
          id={id}
          disabled={disabled}
          className={cn(
            'w-full h-10 px-3 pr-10 py-2 text-sm rounded-lg border shadow-xs transition-all duration-200 outline-none appearance-none font-sans text-slate-900 dark:text-white',
            stateBorderClasses[validationState],
            disabled ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-zinc-900' : '',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-slate-900 dark:text-white dark:bg-[#09090b]">
              {opt.label}
            </option>
          ))}
        </select>
        
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>

      {helperText && (
        <p className="text-[11px] font-mono text-slate-400 mt-0.5">
          {helperText}
        </p>
      )}
    </div>
  );
}

// CHECKBOX COMPONENT
export interface CheckboxProps {
  id: string;
  label?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
  checked?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function Checkbox({ id, label, description, className, disabled, ...props }: CheckboxProps) {
  return (
    <div className="flex items-start gap-2.5 text-left" id={`checkbox-container-${id}`}>
      <div className="flex items-center h-5">
        <input
          id={id}
          type="checkbox"
          disabled={disabled}
          className={cn(
            'h-4 w-4 rounded border border-slate-300 dark:border-white/10 text-indigo-600 focus:ring-indigo-500 dark:focus:ring-offset-[#030303] bg-white dark:bg-[#09090b] cursor-pointer transition-colors',
            disabled ? 'opacity-50 cursor-not-allowed' : '',
            className
          )}
          {...props}
        />
      </div>
      {(label || description) && (
        <div className="text-xs leading-none">
          {label && (
            <label htmlFor={id} className="font-semibold text-slate-800 dark:text-zinc-200 cursor-pointer">
              {label}
            </label>
          )}
          {description && (
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 font-sans font-light leading-snug">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// RADIO BUTTON COMPONENT
export interface RadioProps {
  id: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  checked?: boolean;
  onChange?: () => void;
  name?: string;
}

export function Radio({ id, label, className, disabled, ...props }: RadioProps) {
  return (
    <div className="flex items-center gap-2.5 text-left" id={`radio-container-${id}`}>
      <input
        id={id}
        type="radio"
        disabled={disabled}
        className={cn(
          'h-4 w-4 border border-slate-300 dark:border-white/10 text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-[#09090b] cursor-pointer transition-all',
          disabled ? 'opacity-50 cursor-not-allowed' : '',
          className
        )}
        {...props}
      />
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-slate-800 dark:text-zinc-200 cursor-pointer leading-none">
          {label}
        </label>
      )}
    </div>
  );
}

// TOGGLE SWITCH COMPONENT
export interface ToggleProps {
  id: string;
  label?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
  checked?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function Toggle({ id, label, description, checked, onChange, disabled, className, ...props }: ToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4 text-left w-full" id={`toggle-container-${id}`}>
      {(label || description) && (
        <div className="text-xs leading-none">
          {label && (
            <label htmlFor={id} className="font-semibold text-slate-800 dark:text-zinc-200 cursor-pointer">
              {label}
            </label>
          )}
          {description && (
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 font-sans font-light leading-snug">
              {description}
            </p>
          )}
        </div>
      )}
      
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={(e) => {
          if (onChange && !disabled) {
            const simulatedEvent = {
              target: { checked: !checked }
            } as ChangeEvent<HTMLInputElement>;
            onChange(simulatedEvent);
          }
        }}
        className={cn(
          'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-[#030303]',
          checked ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-white/5',
          disabled ? 'opacity-50 cursor-not-allowed' : '',
          className
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out',
            checked ? 'translate-x-4' : 'translate-x-0'
          )}
        />
      </button>
    </div>
  );
}

// OTP COMPONENT (ONE-TIME PASSWORD INPUT)
export interface OtpInputProps {
  id: string;
  length?: number;
  value: string;
  onChange: (otp: string) => void;
  validationState?: ValidationState;
  disabled?: boolean;
}

export function OtpInput({ id, length = 6, value, onChange, validationState = 'default', disabled }: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const stateBorderClasses = {
    default: 'border-slate-200 focus:ring-slate-500 focus:border-slate-500 dark:border-white/5 dark:focus:ring-indigo-500 dark:focus:border-indigo-500 bg-white dark:bg-[#09090b]',
    success: 'border-brand-500 bg-brand-50/5 dark:bg-emerald-500/5',
    warning: 'border-amber-500 bg-amber-50/5 dark:bg-amber-500/5',
    error: 'border-rose-500 bg-rose-50/5 dark:bg-rose-500/5',
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    if (isNaN(Number(val))) return;

    const otpArray = value.split('');
    // Keep only the last character entered
    otpArray[index] = val.substring(val.length - 1);
    
    const newOtp = otpArray.join('');
    onChange(newOtp);

    // Auto-focus next input
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        // Backspace on empty: move to previous and clear it
        const otpArray = value.split('');
        otpArray[index - 1] = '';
        onChange(otpArray.join(''));
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: any) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').substring(0, length);
    if (isNaN(Number(text))) return;

    onChange(text);
    // Focus the last filled box or last box
    const focusIndex = Math.min(text.length, length - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex items-center gap-2" id={id} onPaste={handlePaste}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          disabled={disabled}
          value={value[index] || ''}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className={cn(
            'w-11 h-11 text-center font-mono text-base font-bold rounded-lg border shadow-xs outline-none transition-all duration-200',
            stateBorderClasses[validationState],
            disabled ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-zinc-900' : ''
          )}
        />
      ))}
    </div>
  );
}
