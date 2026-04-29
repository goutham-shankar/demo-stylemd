# DesignProbe UI - Next.js Website

A modern, responsive Next.js website built with Tailwind CSS and shadcn/ui components. This project implements the DesignProbe design system from the provided Figma mockup.

## Features

- **Responsive Design**: Mobile-first approach with breakpoints for tablet and desktop
- **Modern Components**: Navbar, Hero Section, Main Content, Integration Logos, Style Library, Footer
- **Tailwind CSS**: Utility-first styling with custom configuration
- **TypeScript**: Full type safety across the application
- **Next.js 15**: Latest Next.js with app router
- **Optimized**: Fast load times with next/image and code splitting

## Project Structure

```
stylemd-ui/
├── app/
│   ├── globals.css          # Global styles and Tailwind setup
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   ├── Navbar.tsx           # Navigation header
│   ├── Hero.tsx             # Hero section
│   ├── MainContent.tsx      # Two-column content area
│   ├── IntegrationLogos.tsx # Integration logos section
│   ├── StyleLibrary.tsx     # Style library grid
│   └── Footer.tsx           # Footer section
├── style.md                 # Comprehensive design system documentation
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── next.config.ts           # Next.js configuration
├── postcss.config.mjs       # PostCSS configuration
└── package.json             # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build

```bash
# Create production build
npm run build

# Start production server
npm start
```

## Design System

The website follows a comprehensive design system documented in `style.md`. Key elements include:

- **Colors**: Primary brand cyan (#0EA5E9), teal (#14B8A6), and supporting accent colors
- **Typography**: Inter font family with defined heading and body styles
- **Spacing**: Consistent spacing scale from 4px to 64px
- **Components**: Pre-defined button styles, input fields, and card styles
- **Responsive**: Mobile-first design with clear breakpoints

## Customization

### Colors

Edit `tailwind.config.ts` to customize the color palette:

```typescript
colors: {
  brand: {
    cyan: "#0EA5E9",
    teal: "#14B8A6",
    // ... more colors
  }
}
```

### Typography

Modify font family and sizes in `tailwind.config.ts` and `app/globals.css`

### Components

All components are in `components/` folder. Each component is self-contained and can be customized independently.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Optimized images with next/image
- CSS-in-JS with Tailwind for minimal bundle size
- Server-side rendering for SEO
- Code splitting for faster page loads

## License

MIT

## Support

For issues or questions, please refer to the documentation or create an issue in the repository.
