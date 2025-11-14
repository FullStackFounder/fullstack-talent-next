# 🚀 FullstackTalent Web App

A pixel-perfect clone of the FullstackTalent homepage built with Next.js 15, React 19 RC, Tailwind CSS, and Framer Motion.

## ✨ Features

- **Modern Tech Stack**: Next.js 15 + React 19 RC + TypeScript
- **Beautiful Animations**: Framer Motion for smooth transitions
- **Fully Responsive**: Mobile-first design approach
- **Component-Based**: Modular and reusable components
- **Type-Safe**: Full TypeScript support
- **Performance Optimized**: Next.js optimizations + CSS optimization

## 🎨 Design Elements

### Navigation
- Sticky header with dropdown menu
- Responsive mobile menu
- Active link highlighting
- Smooth hover transitions

### Hero Section
- Gradient badge with animation
- Large typography with brand colors
- Stats grid (25K+ alumni, 95% job placement, 500+ partners, 4.9★ rating)
- Dual CTA buttons
- Animated dashboard mockup
- Floating rating and job placement cards

### Career Path Selector
- Two interactive cards (IT Professional vs Technopreneur)
- Hover effects and selection states
- Feature lists with checkmarks
- Career progression info
- Bottom CTA section

### Quick Start Options
- 4 interactive cards
- Icon-based design
- Hover animations
- Direct action buttons

### Success Stories
- Tab-based navigation (IT Professional, Technopreneur, Impact Statistics)
- Story cards with testimonials
- Animated tab transitions
- Statistics dashboard

### Live Feed
- Real-time activity feed simulation
- Community statistics with live updates
- Trust & recognition section
- Sticky sidebar on desktop

### Footer
- Dark theme with 5-column layout
- Social media links
- App download buttons
- Contact information
- "Made in Indonesia" badge

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install dependencies**:
```bash
npm install
# or
yarn install
```

2. **Run the development server**:
```bash
npm run dev
# or
yarn dev
```

3. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
fullstack-talent-homepage/
├── app/
│   ├── globals.css          # Global styles & Tailwind
│   ├── layout.tsx            # Root layout with metadata
│   └── page.tsx              # Homepage
├── components/
│   ├── Navigation.tsx        # Header navigation with dropdown
│   ├── HeroSection.tsx       # Hero with stats and CTAs
│   ├── CareerPathSelector.tsx # Career path selection cards
│   ├── QuickStartOptions.tsx  # Quick start action cards
│   ├── SuccessStories.tsx    # Tabbed success stories
│   ├── LiveFeed.tsx          # Activity feed & community stats
│   └── Footer.tsx            # Footer with links and social
├── public/                   # Static assets
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
├── next.config.js            # Next.js configuration
└── package.json              # Dependencies
```

## 🎨 Color Palette

- **Primary Blue**: `#2563eb` (blue-600)
- **Secondary Green**: `#10b981` (green-600)
- **Dark Background**: `#111827` (gray-900)
- **Text Primary**: `#111827` (gray-900)
- **Text Secondary**: `#6b7280` (gray-500)

## 🔤 Typography

- **Primary Font**: Inter
- **Secondary Font**: Plus Jakarta Sans
- Weights: 300, 400, 500, 600, 700, 800, 900

## 🎭 Animations

All animations are powered by Framer Motion:
- Fade in/out transitions
- Slide up/down effects
- Scale transformations
- Stagger animations for lists
- Hover state transitions

## 📱 Responsive Breakpoints

```css
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X Extra large devices */
```

## 🛠️ Customization

### Changing Colors

Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: {
    DEFAULT: '#2563eb', // Change this
    // ... other shades
  },
}
```

### Adding New Sections

1. Create component in `components/` folder
2. Import in `app/page.tsx`
3. Add to the component tree

### Modifying Content

All content is hardcoded in components for easy customization:
- Stats in `HeroSection.tsx`
- Success stories in `SuccessStories.tsx`
- Activity feed in `LiveFeed.tsx`

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📦 Dependencies

### Core
- **Next.js 15**: React framework
- **React 19 RC**: UI library
- **TypeScript**: Type safety

### UI & Styling
- **Tailwind CSS**: Utility-first CSS
- **Framer Motion**: Animation library
- **Lucide React**: Icon library

## 🎯 Key Features to Note

1. **Navigation Dropdown**: Hover-activated menu for "Program"
2. **Career Path Selection**: Interactive cards with state management
3. **Tabbed Interface**: Success stories with smooth transitions
4. **Live Updates**: Real-time clock in community stats
5. **Responsive Design**: Mobile-first approach with breakpoints
6. **Performance**: Next.js 15 optimizations enabled

## 🐛 Known Issues

- Dashboard image in hero section is a placeholder (gradient simulation)
- Some company logos in footer may need actual images
- Mobile menu needs to be implemented (hamburger icon present)

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel
```

### Other Platforms
Build the project and deploy the `.next` folder:
```bash
npm run build
```

## 📝 License

This is a clone project for educational purposes.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📧 Contact

For questions or support, reach out to the FullstackTalent team.

---

**Built with ❤️ using Next.js 15 + React 19 + Tailwind CSS**