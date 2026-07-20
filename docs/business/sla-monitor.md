# Service Level Agreement (SLA) Monitor

The SLA Monitor tracks real-time campaign performance against business targets to alert stakeholders of pipeline risks.

## Core Performance Metrics

- **Completion ETA**: Dynamic completion projection based on contributor velocity ($V_c$):
  
  $$\text{ETA (Hours)} = \frac{\text{Remaining Tasks}}{V_c}$$

- **Contributor Velocity**: Average submissions processed per hour.
- **Accuracy Level**: Real-time validation accuracy of cognitive workers against golden test sets.
- **Remaining Budget / Cost**: Real-time depletion projection alerting finance stakeholders if campaigns run out of fuel ahead of schedule.

## Alerting Triggers & Risk Classification

- **TRAFFIC_SPIKE**: Alerted if the intake velocity increases by $> 300\%$ over a 15-minute moving average.
- **SLA_BREACH_RISK**: Raised if predicted completion time exceeds the contractual deadline by $> 10\%$.
- **ACCURACY_DROP**: Alerted if worker accuracy drops below the campaign's minimum requirement threshold.
