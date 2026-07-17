/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, RotateCcw } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface ErrorScreenProps {
  title?: string;
  message: string;
  actionLabel?: string;
  onRetry?: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({
  title = 'Authentication Error',
  message,
  actionLabel = 'Attempt Handshake Again',
  onRetry,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="p-8 text-center space-y-6 max-w-md mx-auto"
      role="alert"
      aria-label="Error message"
    >
      <div className="flex justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 text-rose-500"
        >
          <ShieldAlert className="h-10 w-10" aria-hidden="true" />
        </motion.div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white leading-tight">
          {title}
        </h3>
        <p className="text-xs text-rose-500 bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/15 p-3 rounded-xl leading-relaxed font-mono font-medium text-left">
          {message}
        </p>
      </div>

      {onRetry && (
        <Button
          variant="secondary"
          onClick={onRetry}
          className="w-full justify-center flex items-center gap-1.5 font-semibold cursor-pointer"
          aria-label={actionLabel}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>{actionLabel}</span>
        </Button>
      )}
    </motion.div>
  );
};

export default ErrorScreen;
