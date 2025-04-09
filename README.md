# Sequence Test Project

A modern web application built with Angular and JSON Server.

## Features

- Angular frontend application
- JSON Server for mock API endpoints
- Hot Module Replacement (HMR) for development
- Responsive design

## Prerequisites

- Node.js
- npm

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run start:dev
   ```

3. Access the application:
   - Frontend: http://localhost:4200
   - API: http://localhost:3000

## API Endpoints

The JSON Server provides the following endpoints:

- `GET /songs` - List all songs
- `GET /artists` - List all artists
- `GET /companies` - List all companies

## Project Structure

```
sequence-test/
├── src/                    # Source files
├── mock.json              # Mock data for JSON Server
└── package.json          # Project dependencies and scripts
```

## Development

The project uses Angular CLI for development with the following features:
- Hot Module Replacement (HMR)
- TypeScript compilation
- SCSS processing
- JSON Server for mock API

## Author

Melo Ortega