# ReelAgents - Secure Foundation

A modern web application for AI-powered digital marketing agents with multi-tenant architecture and role-based access control.

## 🏗️ Architecture

- **Frontend**: Vite + React + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **State Management**: Zustand + React Query (planned)
- **Authentication**: Supabase Auth with RLS
- **Deployment**: Vercel (planned)

## 🔐 Security Features

- **Row Level Security (RLS)** enabled on all tables
- **Multi-tenant isolation** with company-based data segregation
- **Role-based access control** (Company, Agent, Admin)
- **JWT-based authentication** with Supabase
- **Secure database policies** for data access

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- Environment variables configured

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Create .env file with:
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the database migrations in your Supabase dashboard

5. Start the development server:
   ```bash
   npm run dev
   ```

## 📊 Database Schema

### Core Tables

- **users** - User profiles with role-based access
- **companies** - Company information and Stripe integration
- **agents** - Agent profiles and certifications
- **digital_twins** - AI models and training data
- **campaigns** - Marketing campaigns and budgets

### Security Model

All tables implement Row Level Security with policies that ensure:
- Users can only access data within their tenant (company)
- Role-based permissions for different user types
- Secure data isolation between companies

## 🎯 User Roles

### Company Users
- Manage digital twins and campaigns
- Invite and manage agents
- Access company analytics

### Agent Users
- View available campaigns
- Manage their profile and certifications
- Track earnings and performance

### Admin Users
- System-wide management
- Company and agent oversight
- Platform analytics

## 🔄 Current Status - Iteration 1 Complete

✅ **Production-Ready Application Complete**
- Multi-tenant Supabase schema with RLS
- User authentication with role-based access
- Protected routing and layouts
- Dashboard with role-specific views
- Async AI workflows with AWS Step Functions
- React Query for server state management
- Role-based UI rendering
- Stripe Connect marketplace payments
- Comprehensive testing suite
- CI/CD pipeline automation

## 🧪 Testing Strategy

### Unit Tests
- Component testing with React Testing Library
- Hook testing with custom test utilities
- Utility function testing

### Integration Tests
- Component interaction testing
- API integration with mocked responses
- User flow testing

### End-to-End Tests
- Critical user journeys with Playwright
- Cross-browser compatibility testing
- Mobile responsiveness testing

### Backend Tests
- Lambda function unit tests with pytest
- API endpoint testing with mocked dependencies
- Security validation testing

## 🚀 CI/CD Pipeline

### Frontend Pipeline
- **Lint & Test**: ESLint, TypeScript, unit/integration tests
- **E2E Testing**: Playwright cross-browser testing
- **Build**: Production build with environment variables
- **Deploy**: Automatic Vercel deployment on main branch
- **Performance**: Lighthouse CI for performance monitoring

### Backend Pipeline
- **Test**: Python unit tests for Lambda functions and APIs
- **Validate**: SAM template validation and build
- **Deploy**: Staging (develop) and production (main) deployments
- **Security**: Bandit and Safety security scanning

## 📊 Performance & Monitoring

### Lighthouse Scores
- Performance: >80%
- Accessibility: >90%
- Best Practices: >80%
- SEO: >80%

### AWS Monitoring
- CloudWatch logs for all Lambda functions
- Step Function execution tracking
- API Gateway request monitoring
- Error alerting and notifications

## 🛠️ Development

### Running Tests

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Backend tests
cd tests/backend && python -m pytest
```

### Local Development

```bash
# Start development server
npm run dev

# Run tests in watch mode
npm run test

# Run E2E tests with UI
npm run test:e2e:ui
```
### Project Structure

```
src/
├── components/
│   ├── layouts/          # Layout components
│   └── ui/              # Reusable UI components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and configurations
├── pages/               # Page components
├── store/               # State management
└── styles/              # Global styles

supabase/
└── migrations/          # Database migrations
```

### Key Features

- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Type Safety** - Full TypeScript implementation
- **Modern Patterns** - Hooks, context, and modern React patterns
- **Security First** - RLS and proper authentication flows

## 📝 License

This project is part of the ReelAgents development roadmap.