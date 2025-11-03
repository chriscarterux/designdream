# Kanban Board Components

A complete drag-and-drop Kanban board implementation for managing design and development requests.

## Components

### KanbanBoard
Main container component that manages the drag-and-drop context and coordinates between columns.

**Usage:**
```tsx
import { KanbanBoard } from '@/components/kanban/kanban-board';

<KanbanBoard onCardClick={(requestId) => console.log(requestId)} />
```

**Props:**
- `onCardClick?: (requestId: string) => void` - Optional callback when a card is clicked

**Features:**
- Drag-and-drop between columns
- Reordering within columns
- Smooth animations with @dnd-kit
- Visual feedback during drag
- Keyboard navigation support

### KanbanColumn
Represents a single column in the Kanban board with droppable functionality.

**Features:**
- Visual feedback when cards are dragged over
- Displays card count
- WIP limit indicators for "In Progress" column
- Color-coded styling per column
- Empty state messaging

### RequestCard
Individual request card component with sortable drag handles.

**Features:**
- Priority color coding (urgent, high, medium, low)
- Request type badges (design, development, bug-fix, etc.)
- Client name display
- Timeline information
- Hover effects
- Click handlers for details view

## Hooks

### useKanban
Custom hook for managing Kanban board state and operations.

**Usage:**
```tsx
import { useKanban } from '@/hooks/use-kanban';

const { columns, moveRequest, reorderWithinColumn, canMoveToColumn } = useKanban();
```

**Returns:**
- `columns` - Current state of all columns with their requests
- `moveRequest(requestId, targetColumnId)` - Move a request to a different column
- `reorderWithinColumn(columnId, requestId, newIndex)` - Reorder within same column
- `canMoveToColumn(request, targetColumnId)` - Check if a move is allowed (WIP limits)

**Features:**
- WIP limit enforcement (1 request per client in "In Progress")
- Optimistic UI updates
- Mock data for development (ready for backend integration)
- Type-safe operations

## Types

All types are defined in `/src/types/kanban.ts`:

```typescript
type RequestPriority = 'urgent' | 'high' | 'medium' | 'low';
type RequestType = 'design' | 'development' | 'bug-fix' | 'enhancement' | 'consultation';
type RequestStatus = 'backlog' | 'up-next' | 'in-progress' | 'review' | 'done';

interface Request {
  id: string;
  title: string;
  description?: string;
  type: RequestType;
  priority: RequestPriority;
  status: RequestStatus;
  timeline?: string;
  clientId: string;
  clientName: string;
  createdAt: string;
  updatedAt: string;
}
```

## Styling

The components use Tailwind CSS with custom color schemes:

- **Backlog**: Gray
- **Up Next**: Blue
- **In Progress**: Purple (#6E56CF)
- **Review**: Amber
- **Done**: Green

Priority colors:
- **Urgent**: Red
- **High**: Orange
- **Medium**: Blue
- **Low**: Gray

## Integration Points

### Backend Integration (TODO)
The `useKanban` hook has placeholder comments for backend integration:

```typescript
// TODO: Sync with backend
// await updateRequestStatus(requestId, targetColumnId);
// await updateRequestOrder(columnId, newOrder);
```

### Supabase Realtime (Planned)
The architecture supports real-time updates through Supabase subscriptions:

1. Subscribe to request changes in the hook
2. Update local state when changes occur
3. Handle optimistic updates with rollback on error

### Example Integration:
```typescript
useEffect(() => {
  const subscription = supabase
    .from('requests')
    .on('UPDATE', (payload) => {
      // Update local state
    })
    .subscribe();

  return () => subscription.unsubscribe();
}, []);
```

## Responsive Design

- **Mobile**: Single column stack
- **Tablet**: 3 columns
- **Desktop**: 5 columns (all columns visible)

## Accessibility

- Keyboard navigation enabled via @dnd-kit sensors
- Proper ARIA labels on interactive elements
- Color contrast meets WCAG standards
- Focus indicators on all interactive elements

## Performance

- Optimistic UI updates for instant feedback
- Memoized components where appropriate
- Efficient re-rendering with proper React keys
- Lazy loading ready for large datasets
