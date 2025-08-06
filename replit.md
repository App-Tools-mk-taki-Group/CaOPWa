# Overview

CaOPWa (Cosmic Operations Platform) is a comprehensive full-stack web application that serves as a multi-functional cosmic-themed workspace. The platform features tabbed navigation with a main dashboard, advanced notes system, and sophisticated utility tools. All functionality operates entirely offline without external APIs, including real-time chat, calendar viewing, universal translation, password generation, encryption tools, and full virtual keyboard support across all input areas.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for build tooling
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom cosmic theme variables and glass morphism effects
- **State Management**: TanStack React Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing (with tabbed navigation overlay)
- **Real-time Communication**: Custom WebSocket hook for chat functionality
- **Input Enhancement**: Custom virtual keyboard component with cosmic styling
- **Navigation**: Tab-based interface for Dashboard, Notes, and Advanced Tools sections

## Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **Development Server**: Vite middleware integration for seamless development experience
- **Real-time Communication**: WebSocket server using 'ws' library for chat functionality
- **API Design**: RESTful endpoints with WebSocket enhancement for real-time features
- **Error Handling**: Centralized error middleware with structured error responses

## Data Storage Solutions
- **Database**: PostgreSQL configured through Drizzle ORM
- **ORM**: Drizzle with TypeScript-first schema definitions
- **Development Storage**: In-memory storage implementation for development/testing
- **Schema Management**: Centralized schema definitions in shared directory
- **Database Provider**: Neon Database serverless PostgreSQL integration
- **Notes Storage**: Full CRUD operations for encrypted notes with Standard Notes inspired architecture
- **Chat Storage**: Persistent message storage by room with WebSocket synchronization

## Authentication and Authorization
- **Session Management**: PostgreSQL session store using connect-pg-simple
- **User Model**: Basic username/password authentication schema
- **Security**: Express middleware for request parsing and validation

## Application Features

### Main Dashboard
- **Calendar**: Month/year viewing without scheduling functionality
- **Real-time Chat**: Multi-room chat with persistent history and virtual keyboard support
- **Universal Translator**: Offline text translation with quick phrases and virtual keyboard
- **Utility Tools**: Basic calculator, unit converter, and color tools

### Notes System
- **Standard Notes Architecture**: Inspired encryption-ready note storage system
- **Full CRUD Operations**: Create, read, update, delete notes with PostgreSQL persistence
- **Rich Text Support**: Markdown-compatible note editing with virtual keyboard support
- **Secure Storage**: Database-backed with encryption-ready architecture

### Advanced Tools Suite
- **QR Code Generator**: Text-based QR code generation with customizable size and color
- **Password Generator**: Cryptographically secure passwords with customizable character sets
- **Hash Calculator**: MD5, SHA-1, SHA-256 hash generation for text input
- **Base64 Encoder/Decoder**: Bidirectional Base64 text conversion
- **JSON Formatter**: Pretty-print JSON with syntax validation
- **URL Encoder/Decoder**: URI component encoding/decoding functionality

### Virtual Keyboard System
- **Universal Integration**: Available across all text input areas (chat, translator, notes, tools)
- **Full QWERTY Layout**: Complete keyboard with numbers and special characters
- **Cosmic Styling**: Themed to match application design with glass morphism effects
- **Responsive Design**: Adapts to different screen sizes and input contexts

## External Dependencies
- **Database**: Neon Database (serverless PostgreSQL)
- **UI Components**: Radix UI primitives for accessible component foundation
- **WebSocket**: Native WebSocket implementation for real-time chat
- **Development Tools**: Replit-specific plugins for enhanced development experience
- **Build Tools**: Vite with React plugin and esbuild for production builds
- **Validation**: Zod for runtime type checking and schema validation

## Recent Changes (January 2025)
- Added comprehensive Notes system with CRUD operations and database persistence
- Implemented Advanced Tools suite with 6 utility tools (QR, Password, Hash, Base64, JSON, URL)
- Created universal Virtual Keyboard component with cosmic styling
- Integrated virtual keyboard support across all input areas (Chat, Translator, Notes, Tools)
- Enhanced navigation with tabbed interface for Dashboard, Notes, and Advanced Tools
- Updated schemas and API routes to support notes functionality
- Fixed all TypeScript errors and LSP diagnostics for production readiness