/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Establishing secure cryptographic handshake...' 
}) => {
  return (
    <div 
      className="flex flex-col items-center justify-center p-12 min-h-[300px] text-center space-y-4"
      role="status"
      aria-live="polite"
      aria-label="Loading authentication state"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="text-indigo-500 dark:text-indigo-400"
      >
        <Loader2 className="h-10 w-10 animate-pulse" />
      </motion.div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-950 dark:text-white font-display">
          Authentication Gateway
        </p>
        <p className="text-xs text-slate-400 font-mono tracking-wide">
          {message}
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
