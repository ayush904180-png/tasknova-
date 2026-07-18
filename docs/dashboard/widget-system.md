# Widget Registration and Discovery System

The TaskNova Dashboard relies on a dynamic, extensible Widget Registry to maintain clean segregation of concerns.

## Sizing Specifications

Widgets can claim one of four grid dimensions in the responsive bento grid container:

| Sizing Enum | Grid Layout Output | Best Use Cases |
| :--- | :--- | :--- |
| `WidgetSize.SMALL` | `1x1 cell` | Simple counters, single KPI gauges, status indicators |
| `WidgetSize.MEDIUM` | `2x1 wide cell` | Compact tables, profile identity, task listings |
| `WidgetSize.LARGE` | `2x2 tall & wide` | Detailed audits, logs feed, multi-metric summaries |
| `WidgetSize.FULL` | `Spans entire row` | High-density graphs, complex interactive forms |

## Dynamic Authorization Matrix

When resolving visible widgets, the registry checks the user's role against the widget's required `minRole` metadata:

- **Contributor (lowest)**: Access to standard Tasks, Profile, Wallet, and Leaderboards.
- **Creator**: Access to standard tools plus Campaign Matrix, persona checks, and target settings.
- **Business**: Access to standard tools plus budget campaigns, escrow balances, and dataset compliance graphs.
- **Admin**: Master administrative controls.
- **Developer**: Fully unconstrained access, including active telemetry monitors and runtime event triggers.

## Architectural Placeholders

Every widget is designed with a visible `WidgetShell` displaying its corresponding architectural contract:

```typescript
export interface WidgetMetadata {
  id: string;
  name: string;
  category: WidgetCategory;
  defaultSize: WidgetSize;
  minRole: UserRole;
}
```

This ensures that developers can clearly see the expected repositories, databases, fields, and connection syntaxes even when reviewing isolated mock models.
