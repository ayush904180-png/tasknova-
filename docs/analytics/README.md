# TaskNova Enterprise Analytics, BI, and KPI Command Center

Welcome to the TaskNova Enterprise Business Intelligence operating suite documentation.

## Module Structure

The analytics platform is written completely in TypeScript with modular layout components:

- `/src/analytics/types/`: Strict type definitions for RBAC roles, filters, telemetry, forecasts, and cloud metrics.
- `/src/analytics/constants/`: Mock database records mapping geographic spreads, device profiles, threat vectors, and historical revenue drivers.
- `/src/analytics/cache/`: Offline TTL Cache with auto-retriers and local sync queueing.
- `/src/analytics/repositories/`: Interface managing layout widgets and custom preset reports.
- `/src/analytics/forecasting/`: Simple mathematical linear regression forecasting and confidence intervals calculation engine.
- `/src/analytics/adapters/`: Standard stubs for BigQuery streaming, Google Drive uploads, and Google Sheets updates.
- `/src/analytics/services/`: Direct calculations of metrics, variance percentages, and CSV/JSON formatting engines.
- `/src/analytics/context/`: Core React State orchestrator for global filters, streaming ticker generators, and RBAC permission checks.
- `/src/analytics/components/`: Sub-components for customized executive metrics, user charts, validation matrices, and threat alerts.
- `/src/analytics/pages/`: Main hub with tab divisions.

## Capabilities

1. **Executive Overview (KPIs)**: Generates 26 distinct real-time metric streams.
2. **Predictive Analytics**: Computes 10-step regressions for MRR, cloud capacities, and user counts.
3. **Google Cloud Ready**: Stubs are fully prepared for Firestore, BigQuery, and Sheets integration.
4. **Offline Queueing**: Offline capability with TTL and retry queues in case of connectivity loss.
5. **Role-Based Access (RBAC)**: Supports roles ranging from Owner and Super Admin to Developer and Moderator.
