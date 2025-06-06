# start-comp-lib

A modern component library platform built with **TanStack Start** and **TailwindCSS** that allows you to create, preview, and share UI components similar to shadcn/ui.

## ✨ Features

### 🎯 Component Preview System

- **Live Component Preview**: Interactive preview of components in a dedicated sandbox environment
- **Code Display**: View the source code of components with syntax highlighting
- **Error Boundaries**: Graceful error handling for component rendering issues
- **Dark Mode Support**: Toggle between light and dark themes

### 📚 Component Organization

- **Library Structure**: Organize components into different libraries (e.g., `new-york`, `internal`)
- **Component Types**: Support for different component types (`ui`, `blocks`, `pages`)
- **Sidebar Navigation**: Easy browsing through available components with filtering
- **Dynamic Routing**: Clean URLs for each component (`/libs/{library}/{type}/{component}`)

### 🔧 Developer Experience

- **TypeScript Support**: Full TypeScript integration with type safety
- **Hot Reload**: Development server with instant updates
- **Modern Tooling**: Built with Vite, TanStack Start, and modern React patterns
- **Component Auto-Discovery**: Automatic detection and registration of components

## 🚀 Getting Started

### Prerequisites

- Node.js >= 24.0.0
- pnpm (recommended package manager)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd start-comp-lib

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Adding Components

1. Create your component in the appropriate library directory:

   ```
   src/libs/{library-name}/{component-type}/{component-name}.tsx
   ```

2. Export your component(s) from the file:

   ```tsx
   export function MyComponent() {
   	return <div>Hello World</div>
   }
   ```

3. The component will automatically appear in the sidebar and be available for preview

## Changelog

### 0.1.0 (2025-05-26)

- Initial release of start-comp-lib
- Component preview system with live rendering
- Code display with syntax highlighting
- Sidebar navigation with component discovery and filtering
- Dark mode support
- TypeScript integration with full type safety
- Error boundaries for component safety

## 📁 Project Structure

```
src/
├── libs/                   # Component libraries
│   ├── new-york/           # shadcn/ui New York style components
│   │   └── ui/             # UI components
│   └── internal/           # Internal/utility components
│       └── ui/             # Internal UI (sidebar, code-display)
├── routes/                 # TanStack Router routes
├── components/             # Shared components
├── logic/                  # Business logic and utilities
└── styles/                 # Global styles and CSS
```

## 🛠 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm test` - Run tests
- `pnpm shad:add` - Add shadcn/ui components

## 🎨 Built With

- **[TanStack Start](https://tanstack.com/start)** - Full-stack React framework
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible UI primitives
- **[Lucide React](https://lucide.dev/)** - Beautiful & consistent icon toolkit
- **[TypeScript](https://www.typescriptlang.com/)** - Type-safe JavaScript

## 🗺 Roadmap

### ✅ Completed

- [x] Component preview system with live rendering
- [x] Code display with syntax highlighting
- [x] Sidebar navigation with component discovery
- [x] Dark mode support
- [x] TypeScript integration
- [x] Error boundaries for component safety

### 🚧 In Progress

- [ ] Component documentation system
- [ ] Copy/paste component sharing
- [ ] Extended registry items (hooks, pages, blocks)

### 📋 Planned Features

- [ ] Dynamic form generation for component props
- [ ] shadcn CLI integration with dynamic registry
- [ ] NPM package publishing with tsdown
- [ ] Component dependency management
- [ ] Export/import functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
