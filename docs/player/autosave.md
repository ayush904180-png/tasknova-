# Auto-Save System Specification
Version 1.0.0 | Operational Resilience

Data preservation is critical to maintaining high contributor satisfaction and minimizing dropped sessions. The Task Player features a fully automatic background auto-save system.

## 1. Synchronization Flow & Debounce Loop
To avoid performance stuttering and excessive storage access during rapid typing or scrolling, auto-saves are heavily throttled and debounced:
1. When a contributor interacts with a plugin element, the `onChange` event updates the component state.
2. The player shell triggers a `useEffect` watcher that debounces writes by **1500 milliseconds**.
3. During the debounce window, any additional input resets the timer.
4. When the timer expires, the draft state is serialized and synced with local storage.

```
[User Input] ──> [State Changed] ──> [1.5s Debounce Timer] ──> [Save to Local Storage]
                                              │
                                              └─── (Reset on new input)
```

## 2. Storage Keys & Scopes
Draft sessions are isolated by task and user boundaries to allow multi-user workspaces on the same browser:
* **Key Format**: `tasknova_session_{taskId}_{userId}`
* **Value**: Full JSON-serialized `PlayerSession` record, including current answers, elapsed seconds, and localization flags.

## 3. Recovery After Refresh
Upon loading a task, the player check-runs this storage pattern. If a matching key is identified, the shell interrupts the setup process and triggers the `ResumeDialog` modal. The validator can elect to resume their previous progress or scrap it and start fresh.
