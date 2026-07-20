/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GlobalFilters, KPICardData, LiveStreamEvent, ForecastDataPoint, CloudMetrics, SecurityThreatMetrics } from '../types';
import { REVENUE_HISTORICAL_DATA, USER_GEOGRAPHIC_DATA, LEADERBOARD_RANKING, CLOUD_METRICS_HISTORY } from '../constants';
import { ForecastingEngine } from '../forecasting/ForecastingEngine';

export class AnalyticsService {
  /**
   * Generates standard high-precision mock KPI metrics based on GlobalFilters selection.
   * Applying filters directly scales values to provide a real interactive feel.
   */
  public static calculateKPIs(filters: GlobalFilters): KPICardData[] {
    const scaleFactor = this.getFilterScaleFactor(filters);

    return [
      {
        id: 'kpi_rev_today',
        title: 'Revenue Today',
        value: `$${Math.round(28200 * scaleFactor).toLocaleString()}`,
        change: 8.4,
        trend: 'up',
        category: 'financial',
        description: 'Gross cumulative revenue tracked in past 24-hour cycle.',
        history: [120, 145, 180, 210, 240, 282]
      },
      {
        id: 'kpi_rev_yesterday',
        title: 'Revenue Yesterday',
        value: `$${Math.round(26000 * scaleFactor).toLocaleString()}`,
        change: 6.2,
        trend: 'up',
        category: 'financial',
        description: 'Complete gross revenue of previous financial day.',
        history: [110, 130, 160, 220, 230, 260]
      },
      {
        id: 'kpi_rev_month',
        title: 'Revenue This Month',
        value: `$${Math.round(382000 * scaleFactor).toLocaleString()}`,
        change: 12.4,
        trend: 'up',
        category: 'financial',
        description: 'Current calendar month accumulation.',
        history: [310, 330, 350, 360, 370, 382]
      },
      {
        id: 'kpi_mrr',
        title: 'Monthly Recurring Revenue (MRR)',
        value: `$${Math.round(245000 * scaleFactor).toLocaleString()}`,
        change: 15.1,
        trend: 'up',
        category: 'financial',
        description: 'SaaS subscription MRR commitment.',
        history: [180, 195, 210, 225, 235, 245]
      },
      {
        id: 'kpi_arr',
        title: 'Annual Run Rate (ARR)',
        value: `$${Math.round(2940000 * scaleFactor).toLocaleString()}`,
        change: 14.8,
        trend: 'up',
        category: 'financial',
        description: 'Projected annual scale based on current month.',
        history: [2.1, 2.3, 2.5, 2.7, 2.8, 2.9]
      },
      {
        id: 'kpi_arpu',
        title: 'Average Revenue Per Customer (ARPU)',
        value: `$${Math.round(185 * scaleFactor).toLocaleString()}`,
        change: 3.2,
        trend: 'up',
        category: 'financial',
        description: 'Mean subscription plus metered usage billing.',
        history: [170, 172, 175, 178, 180, 185]
      },
      {
        id: 'kpi_enterprise_cust',
        title: 'Enterprise Customers',
        value: Math.round(52 * scaleFactor),
        change: 10.5,
        trend: 'up',
        category: 'users',
        description: 'Active corporate organizations with recurring accounts.',
        history: [40, 42, 45, 48, 50, 52]
      },
      {
        id: 'kpi_contributors',
        title: 'Contributors',
        value: Math.round(18230 * scaleFactor).toLocaleString(),
        change: 14.2,
        trend: 'up',
        category: 'users',
        description: 'Active worldwide crowd worker node profiles.',
        history: [12, 13, 15, 16, 18, 18.23]
      },
      {
        id: 'kpi_dau',
        title: 'Daily Active Users (DAU)',
        value: Math.round(4850 * scaleFactor).toLocaleString(),
        change: 9.8,
        trend: 'up',
        category: 'users',
        description: 'Unique accounts active inside past 24 hours.',
        history: [4.1, 4.2, 4.4, 4.5, 4.7, 4.85]
      },
      {
        id: 'kpi_mau',
        title: 'Monthly Active Users (MAU)',
        value: Math.round(16800 * scaleFactor).toLocaleString(),
        change: 11.2,
        trend: 'up',
        category: 'users',
        description: 'Unique accounts active inside past 30 days.',
        history: [14.5, 15.0, 15.5, 16.0, 16.5, 16.8]
      },
      {
        id: 'kpi_retention',
        title: 'Retention Rate (D30)',
        value: `${(68.5 * scaleFactor).toFixed(1)}%`,
        change: 1.5,
        trend: 'up',
        category: 'users',
        description: 'Percentage of users active on Day 30 post-signup.',
        history: [65, 66, 67, 67.5, 68, 68.5]
      },
      {
        id: 'kpi_churn',
        title: 'User Churn Rate',
        value: `${(2.4 * (1 / scaleFactor)).toFixed(1)}%`,
        change: -12.5,
        trend: 'down',
        category: 'users',
        description: 'Monthly cancellation percentage of subscribers.',
        history: [3.1, 2.9, 2.8, 2.6, 2.5, 2.4]
      },
      {
        id: 'kpi_conversion',
        title: 'Signup Conversion Rate',
        value: `${(24.5 * scaleFactor).toFixed(1)}%`,
        change: 4.8,
        trend: 'up',
        category: 'users',
        description: 'Landing visitors converting to verified accounts.',
        history: [22, 22.5, 23, 23.5, 24, 24.5]
      },
      {
        id: 'kpi_approval_rate',
        title: 'Task Approval Rate',
        value: `${(92.4 * scaleFactor).toFixed(1)}%`,
        change: 0.5,
        trend: 'up',
        category: 'tasks',
        description: 'Percentage of submitted tasks passed by validation.',
        history: [90.5, 91.2, 91.8, 92.0, 92.2, 92.4]
      },
      {
        id: 'kpi_validation_acc',
        title: 'Validation Accuracy',
        value: `${(99.1 * scaleFactor).toFixed(1)}%`,
        change: 0.2,
        trend: 'up',
        category: 'validation',
        description: 'Consensus accuracy against golden set criteria.',
        history: [98.5, 98.7, 98.9, 99.0, 99.0, 99.1]
      },
      {
        id: 'kpi_marketplace_comp',
        title: 'Marketplace Completion Rate',
        value: `${(88.4 * scaleFactor).toFixed(1)}%`,
        change: 5.2,
        trend: 'up',
        category: 'tasks',
        description: 'Percentage of reserved tasks submitted before expiry.',
        history: [82.0, 83.5, 85.0, 86.8, 87.5, 88.4]
      },
      {
        id: 'kpi_avg_coins_earned',
        title: 'Average Coins Earned',
        value: `${Math.round(485 * scaleFactor).toLocaleString()} Coins`,
        change: 6.4,
        trend: 'up',
        category: 'tasks',
        description: 'Mean coin payout reward per worker session.',
        history: [420, 435, 450, 465, 475, 485]
      },
      {
        id: 'kpi_avg_wallet',
        title: 'Average Wallet Balance',
        value: `$${(24.5 * scaleFactor).toFixed(2)}`,
        change: 2.1,
        trend: 'up',
        category: 'financial',
        description: 'Mean worker liquid holdings pending transfer.',
        history: [22.0, 22.5, 23.0, 23.5, 24.0, 24.5]
      },
      {
        id: 'kpi_pending_with',
        title: 'Pending Withdrawals',
        value: `$${Math.round(18500 * scaleFactor).toLocaleString()}`,
        change: -8.5,
        trend: 'down',
        category: 'financial',
        description: 'Payout tickets queued for banking node dispatch.',
        history: [22, 21, 20, 19, 19, 18.5]
      },
      {
        id: 'kpi_avg_review_time',
        title: 'Average Review Time',
        value: `${(2.4 * (1 / scaleFactor)).toFixed(1)} mins`,
        change: -14.2,
        trend: 'down',
        category: 'validation',
        description: 'Mean queue settlement time for human consensus audits.',
        history: [3.5, 3.2, 3.0, 2.8, 2.6, 2.4]
      },
      {
        id: 'kpi_avg_task_time',
        title: 'Average Task Completion Time',
        value: `${(42 * (1 / scaleFactor)).toFixed(0)} secs`,
        change: -5.4,
        trend: 'down',
        category: 'tasks',
        description: 'Mean elapsed sandbox time for successful HIT uploads.',
        history: [48, 46, 45, 44, 43, 42]
      },
      {
        id: 'kpi_growth_index',
        title: 'Business Growth Velocity',
        value: `+${(18.2 * scaleFactor).toFixed(1)}%`,
        change: 2.1,
        trend: 'up',
        category: 'users',
        description: 'Month-over-month growth vector of corporate tenants.',
        history: [15, 16, 16.5, 17, 17.5, 18.2]
      },
      {
        id: 'kpi_cloud_storage',
        title: 'Cloud Storage Volume',
        value: `${(370 * scaleFactor).toFixed(0)} GB`,
        change: 14.5,
        trend: 'up',
        category: 'cloud',
        description: 'GCP Bucket utilization logs for raw media files.',
        history: [300, 310, 325, 340, 355, 370]
      },
      {
        id: 'kpi_api_latency',
        title: 'Median API Latency',
        value: `${(38 * (1 / scaleFactor)).toFixed(0)} ms`,
        change: -12.4,
        trend: 'down',
        category: 'cloud',
        description: 'Edge network router processing response speed.',
        history: [46, 44, 42, 40, 39, 38]
      },
      {
        id: 'kpi_api_errors',
        title: 'API Ingress Error Rate',
        value: `${(0.04 * (1 / scaleFactor)).toFixed(2)}%`,
        change: -18.2,
        trend: 'down',
        category: 'cloud',
        description: 'WAF rejected plus internal 5xx gateway events.',
        history: [0.08, 0.07, 0.06, 0.05, 0.05, 0.04]
      },
      {
        id: 'kpi_api_success',
        title: 'Ingress Success Rate',
        value: `${(99.96 * scaleFactor).toFixed(2)}%`,
        change: 0.1,
        trend: 'up',
        category: 'cloud',
        description: 'Percentage of successful 2xx/3xx router outcomes.',
        history: [99.92, 99.93, 99.94, 99.95, 99.95, 99.96]
      }
    ];
  }

  /**
   * Computes Forecasts for the Predictive Analytics segment
   */
  public static calculateForecasts(metricName: string): ForecastDataPoint[] {
    let historical: number[] = [];
    let startVal = 1000;
    
    switch (metricName) {
      case 'Revenue':
        historical = REVENUE_HISTORICAL_DATA.map(d => d.Subscription + d.Metered + d.EnterpriseSpend);
        break;
      case 'Users':
        historical = [12400, 13100, 13900, 14500, 15200, 15900, 16800, 17400, 18230];
        break;
      case 'Tasks':
        historical = [52000, 54500, 57000, 59100, 61500, 64000, 68000, 71000, 74200];
        break;
      case 'Validation Volume':
        historical = [48000, 50200, 52400, 54500, 57100, 59800, 63100, 66400, 69500];
        break;
      case 'Business Growth':
        historical = [38, 41, 44, 45, 48, 50, 52];
        break;
      case 'Storage':
        historical = CLOUD_METRICS_HISTORY.map(d => d.StorageGb);
        break;
      case 'API Usage':
        historical = [1200000, 1250000, 1340000, 1450000, 1510000, 1680000, 1740000];
        break;
      case 'Cloud Costs':
        historical = [480, 510, 550, 580, 620, 650, 690];
        break;
      case 'Budget Burn':
        historical = REVENUE_HISTORICAL_DATA.map(d => d.BudgetBurn);
        break;
      case 'Wallet Liabilities':
        historical = [12000, 12400, 13100, 13900, 14500, 15200, 15800];
        break;
      default:
        historical = [100, 120, 140, 160, 180, 200];
    }

    return ForecastingEngine.generateForecast(historical, '2026-07-20', 1);
  }

  /**
   * Generates formatted file content triggers
   */
  public static generateExportData(format: 'CSV' | 'JSON', kpis: KPICardData[]): string {
    if (format === 'JSON') {
      return JSON.stringify(kpis, null, 2);
    }
    // Formulate clean CSV lines
    const header = 'ID,KPI Metric,Value,Variance (%),Trend,Category,Definition\n';
    const lines = kpis.map(k => 
      `"${k.id}","${k.title.replace(/"/g, '""')}","${k.value.toString().replace(/"/g, '""')}",${k.change},"${k.trend}","${k.category}","${k.description.replace(/"/g, '""')}"`
    ).join('\n');
    return header + lines;
  }

  /**
   * Simulates real-time analytics streaming feed tickers
   */
  public static generateLiveEvents(): LiveStreamEvent[] {
    const types: LiveStreamEvent['type'][] = [
      'revenue', 'task', 'submission', 'validation', 'reward', 'wallet', 'marketplace', 'billing', 'admin'
    ];
    const users = ['ayush9041', 'rahul_s', 'elizabeth_p', 'max_d', 'yuki_s', 'jane_doe', 'b2b_google', 'b2b_stripe'];
    const msgs = {
      revenue: [
        'Enterprise SaaS recurring tier invoice cleared: +$1,250 USD',
        'B2B Metered execution API credits topped up: +$4,500 USD',
        'Stripe billing transaction settled: +$850 USD'
      ],
      task: [
        'New Campaign RLHF Evaluation Task published',
        'B2B dataset container validation batch uploaded',
        'Admin released 120 task blocks globally'
      ],
      submission: [
        'User submitted sandbox task #rlhf_v2_041',
        'Crowd validation sandbox batch uploaded',
        'Language verification checklist submitted'
      ],
      validation: [
        'Gemini model agent auto-passed consensus evaluation: 99.4% confidence score',
        'Human reviewer resolved manual escalation flag #3810',
        'Anti-fraud module whitelisted IP subnet'
      ],
      reward: [
        'Loyalty Reward Multiplier applied: +10 XP bonus',
        'Contributor streak multi-award credited: +50 Coins',
        'Verification rank leveled up: Contributor Gold'
      ],
      wallet: [
        'Bank UPI withdrawal successfully routed to beneficiary: $24.50',
        'Wallet payout processed: $450.00 IBAN Transfer',
        'Hold lock resolved on premium reward'
      ],
      marketplace: [
        'Campaign block fully reserved by workers: 85% completions expected',
        'Skill requirements alignment score matching at 98%',
        'Task reservation cancelled: released to pool'
      ],
      billing: [
        'Tax estimation applied (GST 18%): invoice ref TX_8902',
        'Credit balance ledger updated for Google Workspace',
        'Metred budget allocation alerts threshold at 80% limit'
      ],
      admin: [
        'Operational rules updated: standard XP per Easy Task calibrated',
        'WAF proxy bypass filter rule updated by Security Admin',
        'Maintenance lock verification complete'
      ]
    };

    const count = 5;
    const events: LiveStreamEvent[] = [];
    const baseTime = Date.now();

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const typeMsgs = msgs[type];
      const msg = typeMsgs[Math.floor(Math.random() * typeMsgs.length)];
      const user = users[Math.floor(Math.random() * users.length)];
      
      events.push({
        id: `evt_${baseTime - i * 15000}_${i}`,
        type,
        message: msg,
        user: `@${user}`,
        amount: type === 'revenue' || type === 'wallet' ? parseFloat((Math.random() * 500 + 10).toFixed(2)) : undefined,
        meta: { nodeIp: `192.168.1.${Math.round(Math.random() * 254)}` },
        timestamp: new Date(baseTime - i * 15000).toISOString()
      });
    }

    return events;
  }

  private static getFilterScaleFactor(filters: GlobalFilters): number {
    let scale = 1.0;
    // Scale down if localized country/language is selected
    if (filters.country !== 'ALL') scale *= 0.35;
    if (filters.language !== 'ALL') scale *= 0.55;
    if (filters.campaign !== 'ALL') scale *= 0.25;
    if (filters.business !== 'ALL') scale *= 0.45;
    
    // Fallback security margin
    return Math.max(0.08, scale);
  }
}
