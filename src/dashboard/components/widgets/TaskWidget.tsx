/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { WidgetShell } from './WidgetShell';
import { WidgetContextProps } from '../../types/widgets';
import { useInfrastructure } from '../../../infrastructure/providers/InfrastructureProvider';
import { FirestoreTask } from '../../../infrastructure/firebase/types';
import { CheckCircle2, Play, AlertCircle, ArrowRight } from 'lucide-react';

export const TaskWidget: React.FC<WidgetContextProps> = ({ size, isOffline, isRealtime }) => {
  const { tasks } = useInfrastructure();
  const [taskList, setTaskList] = useState<FirestoreTask[]>([]);

  useEffect(() => {
    let active = true;
    const fetchTasks = async () => {
      try {
        const data = await tasks.getActiveTasks();
        if (data && data.length > 0 && active) {
          setTaskList(data.slice(0, 3));
        } else if (active) {
          // Pre-populate with standard specifications
          setTaskList([
            {
              id: 'task-rlhf-1',
              title: 'LLM Response Safety Grading & Alignment',
              description: 'Examine response pair side-by-side to align outputs with harmless directives.',
              categoryId: 'RLHF',
              creatorId: 'nova-system',
              difficulty: 'medium',
              rewardCoins: 250,
              estimatedSeconds: 45,
              instructions: [],
              payloadTemplate: {},
              maxSubmissionsAllowed: 100,
              submissionCount: 14,
              status: 'active',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: 'task-eval-2',
              title: 'Translate Context Semantic Parsing',
              description: 'Grade accuracy of legal/business contextual localization templates.',
              categoryId: 'translation',
              creatorId: 'nova-system',
              difficulty: 'easy',
              rewardCoins: 80,
              estimatedSeconds: 20,
              instructions: [],
              payloadTemplate: {},
              maxSubmissionsAllowed: 50,
              submissionCount: 42,
              status: 'active',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          ]);
        }
      } catch (err) {
        console.error('Error loading task list:', err);
      }
    };

    fetchTasks();
    return () => { active = false; };
  }, [tasks]);

  return (
    <WidgetShell
      id="task-widget"
      title="High-Priority Open Tasks"
      subtitle="Microtasking queues awaiting evaluation"
      size={size}
      expectedRepository="TaskRepository"
      expectedModel="FirestoreTask"
      expectedFields={['id', 'title', 'categoryId', 'difficulty', 'rewardCoins', 'status']}
      futureConnectionPoint="const list = await useInfrastructure().tasks.getActiveTasks();"
      loadingStateSim="Querying active task collection..."
      emptyStateSim="No high-priority tasks are active at this moment."
      errorStateSim="Failed to resolve task indexes on cloud node."
    >
      <div className="space-y-2 mt-2">
        {taskList.map((task) => (
          <div 
            key={task.id}
            className="flex items-center justify-between p-2 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 dark:border-white/5 dark:bg-white/1 dark:hover:bg-white/5 transition-all group cursor-pointer"
          >
            <div className="min-w-0 flex-1 pr-3">
              <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 px-1 py-0.5 rounded dark:bg-indigo-950/30 dark:text-indigo-400">
                {task.categoryId}
              </span>
              <h4 className="text-[11px] font-semibold text-slate-800 dark:text-zinc-200 mt-1 truncate">
                {task.title}
              </h4>
              <p className="text-[9px] text-slate-400 font-mono mt-0.5">
                {task.estimatedSeconds}s • {task.difficulty.toUpperCase()}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[10px] font-mono font-bold text-amber-500">
                +{task.rewardCoins} COINS
              </span>
              <div className="h-6 w-6 rounded-md bg-indigo-600 text-white flex items-center justify-center shadow-sm group-hover:bg-indigo-500 transition-colors">
                <Play className="h-2.5 w-2.5 fill-white" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </WidgetShell>
  );
};
