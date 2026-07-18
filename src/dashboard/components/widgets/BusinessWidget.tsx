/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { WidgetShell } from './WidgetShell';
import { WidgetContextProps } from '../../types/widgets';
import { useInfrastructure } from '../../../infrastructure/providers/InfrastructureProvider';
import { FirestoreCampaign } from '../../../infrastructure/firebase/types';
import { Landmark, TrendingUp, DollarSign, Activity } from 'lucide-react';

export const BusinessWidget: React.FC<WidgetContextProps> = ({ size, isOffline, isRealtime }) => {
  const { campaigns } = useInfrastructure();
  const [activeCampaigns, setActiveCampaigns] = useState<FirestoreCampaign[]>([]);

  useEffect(() => {
    let active = true;
    const fetchCampaigns = async () => {
      try {
        const data = await campaigns.getActiveCampaigns();
        if (data && data.length > 0 && active) {
          setActiveCampaigns(data.slice(0, 2));
        } else if (active) {
          setActiveCampaigns([
            {
              id: 'camp-legal-1',
              businessId: 'biz-corporate-align',
              name: 'Legal Terms localization calibration',
              description: 'Calibrate multi-lingual local compliance parsing datasets.',
              budgetCoins: 100000,
              allocatedCoins: 25000,
              taskIds: ['task-rlhf-1'],
              status: 'active',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: 'camp-trans-2',
              businessId: 'biz-finance-ai',
              name: 'Finance LLM Safety alignment loop',
              description: 'Fine-tune credit-scoring LLM prompts to obey risk parameters.',
              budgetCoins: 150000,
              allocatedCoins: 85000,
              taskIds: ['task-eval-2'],
              status: 'active',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          ]);
        }
      } catch (err) {
        console.error('Error fetching campaigns:', err);
      }
    };

    fetchCampaigns();
    return () => { active = false; };
  }, [campaigns]);

  return (
    <WidgetShell
      id="business-widget"
      title="Business Campaign Escrow"
      subtitle="Corporate alignments, dataset funding, and SLAs"
      size={size}
      expectedRepository="CampaignRepository"
      expectedModel="FirestoreCampaign"
      expectedFields={['id', 'businessId', 'name', 'budgetCoins', 'allocatedCoins', 'status']}
      futureConnectionPoint="const campaigns = await useInfrastructure().campaigns.getByBusiness(businessId);"
      loadingStateSim="Reconciling corporate ledger escrow lines..."
      emptyStateSim="Zero dataset campaigns are currently funded."
      errorStateSim="Ledger connection timeout."
    >
      <div className="space-y-3 mt-2">
        {activeCampaigns.map(camp => {
          const burnRate = (camp.allocatedCoins / camp.budgetCoins) * 100;
          return (
            <div key={camp.id} className="p-2 border border-slate-100 rounded-lg dark:border-white/5 bg-slate-50/20 dark:bg-white/1">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-bold text-[11px] text-slate-800 dark:text-zinc-200">
                    {camp.name}
                  </h5>
                  <span className="text-[9px] font-mono text-slate-400 dark:text-zinc-500 uppercase tracking-widest block mt-0.5">
                    Campaign ID: {camp.id} • STATUS: {camp.status.toUpperCase()}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-teal-500">
                  {camp.budgetCoins.toLocaleString()} COIN
                </span>
              </div>

              {/* Progress Slider representing allocated escrow budget */}
              <div className="mt-2.5 space-y-1">
                <div className="flex justify-between text-[8px] font-mono text-slate-400">
                  <span>Escrow Burn-Rate</span>
                  <span>{burnRate.toFixed(1)}%</span>
                </div>
                <div className="h-1 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-teal-500 rounded-full transition-all duration-500" 
                    style={{ width: `${burnRate}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </WidgetShell>
  );
};
