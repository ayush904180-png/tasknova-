/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from 'react';
import { cn } from '../../utils';

export interface TabOption<T extends string> {
  value: T;
  label: string;
  icon?: ReactNode;
}

interface TabsProps<T extends string> {
  options: TabOption<T>[];
  activeValue: T;
  onChange: (value: T) => void;
  className?: string;
  id?: string;
}

export function Tabs<T extends string>({
  options,
  activeValue,
  onChange,
  className,
  id,
}: TabsProps<T>) {
  return (
    <div
      id={id || 'global-tabs'}
      className={cn(
        'inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800',
        className
      )}
    >
      {options.map((option) => {
        const isActive = option.value === activeValue;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer',
              'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white',
              isActive &&
                'bg-white text-slate-900 shadow-sm font-semibold dark:bg-slate-800 dark:text-white'
            )}
          >
            {option.icon && <span className="opacity-80">{option.icon}</span>}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
