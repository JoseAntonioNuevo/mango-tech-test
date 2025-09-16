# Mango Range Component

A custom dual-handle range slider component built with Next.js, TypeScript, and React.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Run development server
pnpm dev
```

Open [http://localhost:8080](http://localhost:8080)

## 📁 Project Structure

```
src/
├── app/
│   ├── exercise1/        # Continuous range demo
│   ├── exercise2/        # Discrete range demo
│   └── api/             # Mock API endpoints
├── components/
│   └── Range/           # Range component
├── config/
│   └── api.ts           # API configuration
└── tests/               # Test suites
```

## 🎯 Features

### Exercise 1: Continuous Range (`/exercise1`)
- Custom range slider (not HTML5 input)
- Two draggable handles
- Editable min/max input fields
- Values clamped within bounds
- Handles cannot cross
- Fetches config from mock API

### Exercise 2: Discrete Range (`/exercise2`)
- Snaps to fixed values: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99]
- Currency formatting (€)
- Non-editable value labels
- Handles snap to nearest value
- Fetches values from mock API

## 🛠️ Component Usage

```tsx
// Continuous mode
<Range 
  mode="continuous"
  min={0}
  max={100}
  initialMin={20}
  initialMax={80}
  onChange={(values) => console.log(values)}
/>

// Discrete mode
<Range 
  mode="discrete"
  values={[1.99, 5.99, 10.99]}
  initialMinIndex={0}
  initialMaxIndex={2}
  currency="€"
  onChange={(values) => console.log(values)}
/>
```

## 🌐 API Endpoints

### `GET /api/range/normal`
Returns continuous range configuration:
```json
{ "min": 1, "max": 100 }
```

### `GET /api/range/fixed`
Returns discrete range values:
```json
{ "rangeValues": [1.99, 5.99, 10.99, 30.99, 50.99, 70.99] }
```

## 🚀 Deployment

### Environment Variables

Set `NEXT_PUBLIC_API_URL` in your hosting platform:

#### Netlify
1. Go to Site settings → Environment variables
2. Add: `NEXT_PUBLIC_API_URL` = `https://your-app.netlify.app`

#### Vercel
1. Go to Project Settings → Environment Variables
2. Add: `NEXT_PUBLIC_API_URL` = `https://your-app.vercel.app`

#### Other Platforms
The app automatically detects standard deployment URLs from:
- `URL` (Netlify)
- `VERCEL_URL` (Vercel)
- `RENDER_EXTERNAL_URL` (Render)
- `RAILWAY_STATIC_URL` (Railway)

### Build & Deploy

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test -- --watch

# Check code quality
pnpm lint
```

## ♿ Accessibility

- Full keyboard navigation (Arrow keys, PageUp/Down, Home/End)
- ARIA labels and roles
- Focus indicators
- Screen reader support
- Touch-friendly (44px minimum touch targets)
- Responsive design

## 🎨 Technical Highlights

- **TypeScript**: Full type safety with strict mode
- **Performance**: RequestAnimationFrame for smooth dragging
- **Optimizations**: useMemo, debouncing, lazy loading
- **Error Handling**: Graceful API failures with fallbacks
- **Mobile Support**: Touch events and responsive design
- **Testing**: Comprehensive unit and integration tests
- **Clean Architecture**: Single component, shared logic

## 📝 Scripts

- `pnpm dev` - Start development server (port 8080)
- `pnpm build` - Create production build
- `pnpm start` - Start production server (port 8080)
- `pnpm test` - Run test suite
- `pnpm lint` - Check code style

## 🏗️ Built With

- Next.js 15.5 (App Router)
- React 19
- TypeScript 5
- Vitest & Testing Library
- CSS Modules

## 👤 Author

Jose Antonio Nuevo
