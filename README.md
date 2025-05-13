# CartPilot Assistant Frontend

A smart shopping assistant that helps customers find the perfect products through an interactive quiz and AI-powered chat interface.

## Features

- Interactive product quiz
- AI-powered chat interface
- Smart product recommendations
- Seamless integration with any e-commerce site
- Real-time product search and filtering
- Responsive and modern UI

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
- Copy `.env.local.example` to `.env.local`
- Update the API endpoints and keys

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Integration

To integrate the CartPilot Assistant into your e-commerce site:

1. Build the project:
```bash
npm run build
```

2. Host the built files on your CDN or server

3. Add the following script to your site:
```html
<script src="https://your-cdn.com/cartpilot-assistant.js"></script>
```

4. Initialize the assistant:
```html
<div id="cartpilot-assistant" data-client-id="your-client-id"></div>
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run linter
- `npm run test` - Run tests

## Environment Variables

- `NEXT_PUBLIC_GPT_API_URL` - GPT API endpoint
- `NEXT_PUBLIC_GPT_API_KEY` - GPT API key
- `NEXT_PUBLIC_RECOMMEND_API_URL` - Product recommendation API endpoint

## Architecture

The assistant follows a modular architecture:

- `pages/` - Next.js pages
- `components/` - React components
- `lib/` - API clients and utilities
- `hooks/` - Custom React hooks
- `types/` - TypeScript type definitions
- `styles/` - Global styles and Tailwind config

## License

MIT License - See LICENSE file for details 