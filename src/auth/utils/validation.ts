/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { STRONG_PASSWORD_REGEX, AUTH_ERROR_MESSAGES } from '../constants';

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, message: AUTH_ERROR_MESSAGES.requiredField };
  }
  
  // Standard robust RFC 5322 email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(email)) {
    return { isValid: false, message: AUTH_ERROR_MESSAGES.invalidEmail };
  }
  
  return { isValid: true, message: '' };
};

export const validatePasswordStrength = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, message: AUTH_ERROR_MESSAGES.requiredField };
  }
  
  if (!STRONG_PASSWORD_REGEX.test(password)) {
    return { isValid: false, message: AUTH_ERROR_MESSAGES.weakPassword };
  }
  
  return { isValid: true, message: '' };
};

export const validateConfirmPassword = (password: string, confirm: string): ValidationResult => {
  if (!confirm) {
    return { isValid: false, message: AUTH_ERROR_MESSAGES.requiredField };
  }
  
  if (password !== confirm) {
    return { isValid: false, message: AUTH_ERROR_MESSAGES.passwordsDoNotMatch };
  }
  
  return { isValid: true, message: '' };
};

export const validateUsername = (username: string): ValidationResult => {
  if (!username) {
    return { isValid: false, message: AUTH_ERROR_MESSAGES.requiredField };
  }
  
  if (username.trim().length < 3) {
    return { isValid: false, message: 'Username must be at least 3 characters long.' };
  }
  
  if (username.trim().length > 25) {
    return { isValid: false, message: 'Username cannot exceed 25 characters.' };
  }
  
  // Only letters, numbers, underscores and hyphens
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(username)) {
    return { isValid: false, message: 'Username can only contain alphanumeric characters, underscores, and hyphens.' };
  }
  
  return { isValid: true, message: '' };
};
