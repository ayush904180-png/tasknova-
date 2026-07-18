# Global Event Bus Pipeline

The dashboard core implements a high-performance, strongly typed event emitter to orchestrate communications across independent widgets and databases.

## Emitted Event Signatures

All actions dispatching updates across the console must use one of the predefined `DashboardEventType` keys:

- `UserLoggedIn`: Handled when credentials clear security rules.
- `ProfileUpdated`: Dispatched on level-ups or country profile updates.
- `TaskCompleted`: Fired when a RLHF alignment evaluation task is transmitted.
- `WalletUpdated`: Emitted when balance coin increments or locked escrows reconcile.
- `NotificationCreated`: Broadcasts administrative bulletins.
- `BadgeUnlocked`: Unlocks achievement nodes in real time.
- `DeveloperModeChanged`: Toggles visual telemetry monitors.

## Subscription Mechanics

To listen and react to any platform event cleanly:

```typescript
import { EventBus, DashboardEventType } from '../events/EventBus';

useEffect(() => {
  // Subscribe to live task completions
  const unsubscribe = EventBus.on(DashboardEventType.TaskCompleted, (payload) => {
    console.log(`Validator ${payload.userId} submitted task ${payload.taskId}`);
  });

  // Always trigger cleanups on unmount
  return () => unsubscribe();
}, []);
```
