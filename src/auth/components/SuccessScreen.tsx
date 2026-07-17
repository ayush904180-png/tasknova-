/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface SuccessScreenProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
  title = 'Identity Aligned Successfully',
  message = 'Your cryptographic session has been validated and signed on our secure ledger. Access has been cleared.',
  actionLabel = 'Continue to Console',
  onAction,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="p-8 text-center space-y-6 max-w-md mx-auto"
      role="region"
      aria-label="Success message"
    >
      <div className="flex justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500"
        >
          <CheckCircle2 className="h-10 w-10" aria-hidden="true" />
        </motion.div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white leading-tight">
          {title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-sans font-light">
          {message}
        </p>
      </div>

      {onAction && (
        <Button
          variant="primary"
          onClick={onAction}
          className="w-full justify-center flex items-center gap-1.5 group font-semibold shadow-md shadow-indigo-500/10 cursor-pointer"
          aria-label={actionLabel}
        >
          <span>{actionLabel}</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      )}
    </motion.div>
  );
};

export default SuccessScreen;
