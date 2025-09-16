# Range Slider

A dual-handle range slider component for the Mango tech test.

## Setup

```bash
pnpm install
pnpm dev
```

Runs on http://localhost:8080

## Structure

- `/exercise1` - Continuous range (fetches min/max from API)
- `/exercise2` - Discrete range with predefined values

The Range component supports both modes:

```jsx
// Continuous
<Range mode="continuous" min={0} max={100} />

// Discrete 
<Range mode="discrete" values={[1.99, 5.99, 10.99]} />
```

## API

- `GET /api/range/normal` - Returns `{min, max}`
- `GET /api/range/fixed` - Returns `{rangeValues: number[]}`

## Commands

- `pnpm dev` - Development server
- `pnpm build` - Production build  
- `pnpm test` - Run tests
- `pnpm lint` - Check code style
