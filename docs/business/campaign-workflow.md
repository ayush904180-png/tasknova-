# Campaign Approval Workflow State Machine

The Campaign Approval Workflow is built on a formal, deterministic state machine model designed to meet the strict compliance requirements of enterprise customers (comparable to Scale AI and Appen). 

## State Transitions Flow

The workflow enforces transition validation from initial draft to final archive/deletion:

```
[Draft] 
   │
   ▼
[Submitted] 
   │
   ▼
[AI Pre-Validation] ─────(Fails)─────► [Draft] (with suggestions)
   │
   ▼
[Pending Admin Review] ──(Rejected)──► [Draft] (with rejection reason)
   │
   ▼
[Approved] ───────────────(Rollback)──► [Pending Admin Review]
   │
   ▼
[Scheduled]
   │
   ▼
[Published]
   │
   ▼
[Running] ◄──────────────(Pause)──────► [Paused]
   │
   ▼
[Completed]
   │
   ▼
[Archived]
   │
   ▼
[Deleted (Soft Delete Only)]
```

## Transition Validation Rules

1. **Immutable History**: Every state transition is recorded in an immutable audit ledger (`approval_history` collection).
2. **Rollback Boundaries**: 
   - A campaign can be rolled back to `Pending Admin Review` from `Approved` but never from `Published` or `Running`.
   - Running campaigns can only be `Paused` or `Completed`.
3. **Approver Identity**: State changes from `Pending Admin Review` to `Approved` require a valid supervisor/administrator signature, matching role capabilities.
4. **Rejection Protocols**: Rejections require a mandatory comment describing why the campaign was declined (e.g., schema validation failure, reward budget mismatch).
