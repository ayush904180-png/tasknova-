# Route Protection System

TaskNova AI implements sophisticated route guard wrappers around its view layouts to enforce proper security permissions.

## Reusable Guards

We provide four standard protection wrappers inside `/src/auth/routes/AuthRoutes.tsx`:

1. **`GuestRoute`**:
   * **Purpose**: Restricts entry to non-authenticated users only (e.g. Login, Signup, Forgot password).
   * **Authenticated Behavior**: Displays a clean "Already Authenticated" card with user info and a quick disconnect option.

2. **`ProtectedRoute`**:
   * **Purpose**: Restricts entry to authenticated accounts.
   * **Guest Behavior**: Standard routes would redirect to `/login`. However, to prevent jarring context switches, our route guard displays an elegant, high-contrast **"Authentication Required" Portal Overlay** in-context with an option to instantly authenticate.

3. **`RoleProtectedRoute`**:
   * **Purpose**: Enforces access boundaries based on specific roles.
   * **Violation Behavior**: Displays a crisp, red-bordered **"Access Violation" terminal** stating the exact roles cleared for access.

4. **`PermissionProtectedRoute`**:
   * **Purpose**: Performs fine-grained attribute checking (e.g. `tasks:claim`).
   * **Violation Behavior**: Informs the user of the missing secure permission node.

---

## Integration Code Sample

```typescript
import { RoleProtectedRoute } from './auth/routes/AuthRoutes';
import { UserRole } from './auth/types';

function AppRouter() {
  return (
    <RoleProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.BUSINESS]}>
      <EnterpriseDashboardView />
    </RoleProtectedRoute>
  );
}
```
