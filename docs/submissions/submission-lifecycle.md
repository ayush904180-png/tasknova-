# Submission Lifecycle

The Submission lifecycle spans 14 distinct states designed to capture offline caching, network sync queues, automated validation checks, manual consensus reviews, and eventual archival logs.

## The 14 Standard Submission States

1. **Draft**: Initial sandbox environment state when a user starts a task but has not yet published answers.
2. **Saving**: Transient background state when answers are being compiled into localized frames.
3. **Saved**: The draft is stored successfully on client disk, preparing for transmission.
4. **Queued**: The task is locked, and the compiled block is staged in the local queue awaiting gateway sync.
5. **Offline**: Staged specifically in the offline retry buffer due to disconnected network interfaces.
6. **Pending Validation**: Transmitted successfully to the staging ledger, awaiting automated rule evaluations.
7. **AI Reviewing**: Background AI consensus modules are actively assessing translation accuracy, safety flags, and syntax relevance.
8. **Human Review**: Escalated to expert manual operator audits due to low AI confidence or high task complexity.
9. **Approved**: Successfully matched consensus rules; the alignment is officially registered in the consensus matrix.
10. **Rejected**: Failed verification, speed traps, or spam pattern audits.
11. **Reward Pending**: System has confirmed validation and holds reward allocation locks (immutable buffer).
12. **Archived**: Permanently locked and saved as warm historical data for long-term machine-learning training.
13. **Cancelled**: Explicitly scrapped or aborted by the contributor during active player sessions.
14. **Expired**: The task locking reservation window timed out before the contributor completed work.

## State Transition Matrix

```
       [ Draft ]
           │
           ▼
       [ Saving ] ───> [ Saved ]
                           │
                           ▼
  ┌─────────────────────────────────────────────────┐
  │                 Is Online?                      │
  └─────────────────────────────────────────────────┘
        │                                     │
     (Online)                              (Offline)
        │                                     │
        ▼                                     ▼
[ Pending Validation ]                     [ Offline ]
        │                                     │
        ▼                                 (Reconnected)
[ AI Reviewing ] <────────────────────────────┘
        │
        ├─── (High Confidence) ───> [ Approved ] ───> [ Reward Pending ] ───> [ Archived ]
        │
        ├─── (Flagged / Spam) ───> [ Rejected ]
        │
        └─── (Low Confidence) ───> [ Human Review ] ───> [ Approved / Rejected ]
```
