/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { WidgetShell } from './WidgetShell';
import { WidgetContextProps } from '../../types/widgets';
import { useInfrastructure } from '../../../infrastructure/providers/InfrastructureProvider';
import { FirestoreCampaign } from '../../../infrastructure/firebase/types';
import { Code, Users, Play, BarChart3 } from 'lucide-react';

export const CreatorWidget: React.FC<WidgetContextProps> = ({ size, isOffline, isRealtime }) => {
  const { campaigns } = useInfrastructure();
  const [deployedCampaigns, setDeployedCampaigns] = useState<FirestoreCampaign[]>([]);

  useEffect(() => {
    let active = true;
    const fetchCampaigns = async () => {
      try {
        const data = await campaigns.getActiveCampaigns();
        if (data && data.length > 0 && active) {
          setDeployedCampaigns(data.slice(0, 2));
        } else if (active) {
          setDeployedCampaigns([
            {
              id: 'camp-creator-1',
              businessId: 'creator-vibe-studio',
              name: 'RLHF Vibe Calibration & Persona Check',
              description: 'Calibrate persona warmth, prose tone, and vocabulary indexes.',
              budgetCoins: 80000,
              allocatedCoins: 12000,
              taskIds: ['task-rlhf-1'],
              status: 'active',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          ]);
        }
      } catch (err) {
        console.error('Error fetching creator campaigns:', err);
      }
    };

    fetchCampaigns();
    return () => { active = false; };
  }, [campaigns]);

  return (
    <WidgetShell
      id="creator-widget"
      title="Creator Campaign Matrix"
      subtitle="RLHF persona checkpoints, prompt sets, and targets"
      size={size}
      expectedRepository="CampaignRepository"
      expectedModel="FirestoreCampaign"
      expectedFields={['id', 'businessId', 'name', 'budgetCoins', 'allocatedCoins', 'taskIds']}
      futureConnectionPoint="const campaigns = await useInfrastructure().campaigns.getByCreator(creatorId);"
      loadingStateSim="Reading creator campaign array..."
      emptyStateSim="Zero dataset campaigns deployed."
      errorStateSim="Creator access parameters missing."
    >
      <div className="space-y-3 mt-2">
        {deployedCampaigns.map(camp => (
          <div key={camp.id} className="p-2 border border-slate-100 rounded-lg dark:border-white/5 bg-slate-50/20 dark:bg-white/1">
            <div className="flex justify-between items-start">
              <div>
                <h5 className="font-bold text-[11px] text-slate-800 dark:text-zinc-200">
                  {camp.name}
                </h5>
                <p className="text-[10px] text-slate-400 mt-0.5 max-w-[280px] leading-relaxed truncate">
                  {camp.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2 border-t border-slate-100 dark:border-white/5 text-[9px] font-mono text-slate-500">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3 text-indigo-500" />
                <span>{camp.taskIds.length} Alignment Jobs</span>
              </div>
              <div className="flex items-center gap-1">
                <Code className="h-3 w-3 text-pink-500" />
                <span>Active Target: {camp.status.toUpperCase()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </WidgetShell>
  );
};
