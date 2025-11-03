# 📦 Component Guide

Detailed guide for each component in the FullstackTalent homepage.

---

## 🧭 Navigation Component

**File**: `components/Navigation.tsx`

### Features
- Sticky header that stays at top when scrolling
- Dropdown menu for "Program" with 4 options
- Active link highlighting
- Responsive design (hamburger menu button for mobile)

### Customization
```typescript
// Change menu items
const programItems = [
  { label: 'Your Item', href: '/your-path' },
  // Add more items here
];

// Change logo
<span className="text-xl font-bold text-blue-600">
  YourBrand // Change this text
</span>
```

### Key Props
- No props needed - fully self-contained
- Uses `useState` for dropdown state management

---

## 🎯 HeroSection Component

**File**: `components/HeroSection.tsx`

### Features
- Gradient badge with animation
- Large heading with brand colors
- 4 stats cards
- 2 CTA buttons
- Dashboard mockup with rating badge
- Job placement card

### Customization
```typescript
// Change stats
const stats = [
  {
    icon: Users,
    value: '50,000+', // Your number
    label: 'Your Label',
  },
  // Add more stats
];

// Change heading
<h1>
  Your Heading <span className="text-blue-600">Highlight</span>
</h1>

// Change CTA buttons
<button className="...">
  Your CTA Text
</button>
```

### Animation
- Uses Framer Motion for smooth animations
- Stagger effect on stats (delay: 0.1s each)
- Fade-in and slide-up transitions

---

## 🛤️ CareerPathSelector Component

**File**: `components/CareerPathSelector.tsx`

### Features
- Two selectable cards (IT Professional & Technopreneur)
- Selection state with visual feedback
- Feature lists with checkmarks
- Career info and CTA buttons
- Bottom assessment CTA

### Customization
```typescript
// Add or modify career paths
const paths = [
  {
    id: 'your-path',
    icon: YourIcon, // From lucide-react
    title: 'YOUR PATH',
    subtitle: 'Your Subtitle',
    description: 'Your description',
    features: ['Feature 1', 'Feature 2'],
    salary: 'Your salary info',
    career: 'Your career progression',
    buttonText: 'Your CTA',
    buttonColor: 'blue', // or 'green'
  },
];
```

### State Management
- Uses `useState` to track selected path
- Click to select, visual feedback on selection

---

## ⚡ QuickStartOptions Component

**File**: `components/QuickStartOptions.tsx`

### Features
- 4 action cards in grid
- Icon-based design
- Hover effects
- Optional "FREE" badge

### Customization
```typescript
// Modify options
const options = [
  {
    icon: YourIcon,
    title: 'Your Title',
    description: 'Your description',
    cta: 'Your CTA',
    badge: 'FREE', // Optional
    color: 'blue', // blue, purple, green, orange
  },
];
```

### Color System
Predefined color maps for icons and backgrounds:
- `blue`, `purple`, `green`, `orange`

---

## 🏆 SuccessStories Component

**File**: `components/SuccessStories.tsx`

### Features
- 3 tabs: IT Professional, Technopreneur, Impact Stats
- Story cards with testimonials
- Statistics dashboard
- Smooth tab transitions

### Customization
```typescript
// Add IT Professional stories
const itStories = [
  {
    initials: 'AB',
    name: 'Your Name',
    position: 'Your Position @ Company',
    company: 'Company Name',
    quote: 'Your testimonial quote',
    background: 'Background info',
    journey: 'Journey description',
    result: 'Result achieved',
  },
];

// Modify statistics
const statsData = {
  itProfessional: {
    salaryIncrease: '300%',
    jobPlacement: '98%',
    topCompanies: [...],
    totalAlumni: '15,000+',
  },
  startup: {
    startupsLaunched: '600+',
    fundingSuccess: '65%',
    totalFunding: 'Rp 3T',
    highlights: ['Your highlights'],
  },
};
```

### Tab Management
- `useState` for active tab
- `AnimatePresence` for smooth transitions
- Content switches based on `activeTab` state

---

## 📊 LiveFeed Component

**File**: `components/LiveFeed.tsx`

### Features
- Activity feed with user avatars
- Community statistics cards
- Trust & recognition section
- Real-time clock update

### Customization
```typescript
// Add activities
const activities = [
  {
    initials: 'AB',
    text: 'Your activity text',
    time: 'Time ago',
    company: 'Company Name', // Optional
    badge: 'Badge Text', // Optional
    badgeColor: 'green', // or 'blue'
  },
];

// Modify stats
const stats = [
  {
    icon: YourIcon,
    label: 'Your Label',
    value: '12,345',
    subtext: 'Additional info',
    color: 'blue', // Color variant
  },
];
```

### Real-time Updates
```typescript
// Clock updates every second
useEffect(() => {
  const timer = setInterval(() => setTime(new Date()), 1000);
  return () => clearInterval(timer);
}, []);
```

---

## 🦶 Footer Component

**File**: `components/Footer.tsx`

### Features
- Dark theme design
- 5-column layout
- Social media links
- App download buttons
- Contact information
- "Made in Indonesia" badge

### Customization
```typescript
// Modify footer sections
const footerSections = [
  {
    title: 'Your Section',
    links: [
      { label: 'Link Text', href: '/path' },
    ],
  },
];

// Change contact info
<Mail className="w-4 h-4 text-green-500" />
<span>youremail@example.com</span>

// Modify social links
<a href="your-social-url">
  {/* Your social icon SVG */}
</a>
```

---

## 🎨 Global Styling

**File**: `app/globals.css`

### Custom Classes
```css
.gradient-text {
  /* Blue to green gradient text */
}

.gradient-border {
  /* Gradient border effect */
}
```

### Scrollbar Styling
Custom scrollbar with gray theme that matches the design

### Font Loading
- Inter: Primary font
- Plus Jakarta Sans: Secondary font

---

## 🔧 Configuration Files

### tailwind.config.ts
- Custom color palette
- Font configuration
- Animation keyframes

### tsconfig.json
- TypeScript settings
- Path aliases (`@/*`)

### next.config.js
- Image optimization settings
- CSS optimization enabled

---

## 📱 Responsive Design

All components use Tailwind's responsive prefixes:

```tsx
// Mobile first approach
<div className="
  grid                    // Mobile: 1 column
  md:grid-cols-2         // Tablet: 2 columns
  lg:grid-cols-3         // Desktop: 3 columns
">
```

### Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

---

## 🎭 Animation Patterns

### Fade In
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
```

### Slide Up
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
```

### Stagger Children
```tsx
{items.map((item, index) => (
  <motion.div
    key={index}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
))}
```

---

## 🎯 Best Practices

1. **Keep Components Focused**: Each component does one thing well
2. **Use TypeScript**: Type safety prevents bugs
3. **Mobile First**: Design for mobile, enhance for desktop
4. **Consistent Naming**: Follow the established naming patterns
5. **Reuse Colors**: Use Tailwind's color palette
6. **Optimize Images**: Use Next.js Image component when adding real images

---

## 💡 Tips for Extending

### Adding a New Section
1. Create `components/YourSection.tsx`
2. Import in `app/page.tsx`
3. Follow the pattern of existing components
4. Use Framer Motion for animations
5. Keep it responsive

### Changing the Theme
1. Edit `tailwind.config.ts` colors
2. Update component color classes
3. Test on all sections

### Adding Dynamic Data
1. Create a data fetching function
2. Use Next.js App Router data fetching
3. Pass data as props to components

---

**Need more help?** Check the comments in each component file for additional guidance!