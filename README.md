# EMS Web Client

Modern, responsive web client for the Event Management System platform.

## Features

- 🎨 **Beautiful UI**: Modern design with gradient accents, animations, and glass morphism effects
- 🌙 **Dark Mode**: Full dark mode support with system preference detection
- 📱 **Responsive**: Mobile-first responsive design
- ⚡ **Fast**: Built with React 19 and Vite for optimal performance
- 🔐 **Authentication**: JWT-based authentication with token refresh
- 🎭 **Rich Components**: Pre-built UI components with variants and states

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 8
- **Routing**: React Router DOM 7
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Utilities**: clsx, class-variance-authority

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | Authentication page |
| Register | `/register` | User registration |
| Dashboard | `/dashboard` | Overview with stats and charts |
| Events | `/events` | Event management |
| Tickets | `/tickets` | Ticket management |
| Speakers | `/speakers` | Speaker directory |
| Chat | `/chat` | Real-time chat rooms |
| AI Assistant | `/ai-assistant` | RAG-powered AI chatbot |
| Analytics | `/analytics` | Data visualization |
| Data Catalog | `/data-catalog` | OpenMetadata + Iceberg integration |
| Notifications | `/notifications` | Notification center |
| Settings | `/settings` | User preferences |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

## UI Components

### Button
```tsx
<Button variant="primary" size="md" loading={false}>
  Click me
</Button>
```

### Card
```tsx
<Card hover onClick={() => console.log('clicked')}>
  <CardContent>Content</CardContent>
</Card>
```

### Badge
```tsx
<Badge variant="success" size="sm" dot>
  Active
</Badge>
```

### Modal
```tsx
<Modal open={isOpen} onClose={() => setIsOpen(false)} title="Title">
  Content
</Modal>
```

### Input
```tsx
<Input label="Email" type="email" placeholder="you@example.com" />
```

## API Integration

The web client integrates with:

- **Event Service** (`/api/v1`) - Core event API
- **AI Service** (`http://localhost:8081`) - Chat and RAG

### Example API Call

```typescript
import { eventsApi } from '@/services/api';

// List events
const { data } = await eventsApi.list({ page: 1, page_size: 10 });
```

## Design System

### Colors

| Token | Light | Dark |
|-------|-------|------|
| Background | `#f8f9fc` | `#0a0a1a` |
| Primary | `#9333ea` | `#9333ea` |
| Secondary | `#3b82f6` | `#3b82f6` |

### Typography

- **Font**: Inter
- **Base**: 14px
- **Headings**: Bold, tracking-tight

### Animations

| Name | Duration | Easing |
|------|----------|--------|
| fade-in | 300ms | ease-out |
| slide-up | 400ms | ease-out |
| scale-in | 200ms | ease-out |

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run linter
```

## License

MIT
