# Premium Icon System Documentation

## Overview

This project now uses **Heroicons 2** from the `react-icons` library to provide a cohesive, premium, and professional icon set throughout the application. All icons follow a consistent stroke weight (1.8) and minimalist line art style that aligns with modern wealth management aesthetics.

## Icon Library

### React Icons
- **Library**: `react-icons` (v5.x)
- **Icon Set**: Heroicons 2 (Outline style)
- **Style**: Minimalist line art with consistent stroke weight
- **Quality**: Premium, professionally designed by Tailwind Labs

## Icon Components

### Location
All icon exports are centralized in:
```
app/components/icons/
├── NavigationIcons.tsx   # Navigation & UI icons
├── FeatureIcons.tsx      # Feature & activity icons
└── index.ts              # Barrel exports
```

### NavigationIcons

Primary navigation and UI control icons:

| Icon Name | Component | Usage |
|-----------|-----------|-------|
| Home | `HiOutlineHome` | Dashboard home navigation |
| Prospects | `HiOutlineUsers` | Prospects list navigation |
| Signals | `HiOutlineBolt` | Signals/alerts navigation |
| Network | `HiOutlineGlobeAlt` | Network view navigation |
| Analytics | `HiOutlineChartBar` | Analytics dashboard |
| AIInsights | `HiOutlineLightBulb` | AI insights section |
| Compliance | `HiOutlineShieldCheck` | Compliance dashboard |
| DeepDive | `HiOutlineMagnifyingGlass` | Deep dive/search |
| Notifications | `HiOutlineBell` | Notification bell |
| Profile | `HiOutlineUser` | User profile |
| Settings | `HiOutlineCog` | Settings menu |
| Logout | `HiOutlineArrowRightOnRectangle` | Logout action |
| ChevronDown | `HiOutlineChevronDown` | Dropdown indicators |
| Sun | `HiOutlineSun` | Light mode theme |
| Moon | `HiOutlineMoon` | Dark mode theme |

### FeatureIcons

Activity, metrics, and feature-specific icons:

| Icon Name | Component | Usage |
|-----------|-----------|-------|
| Call | `HiOutlinePhone` | Phone call activities |
| Email | `HiOutlineEnvelope` | Email communications |
| Meeting | `HiOutlineVideoCamera` | Meeting/conference |
| Calendar | `HiOutlineCalendar` | Scheduled events |
| Document | `HiOutlineDocumentText` | Documents/notes |
| Currency | `HiOutlineCurrencyDollar` | Financial metrics (AUM) |
| Portfolio | `HiOutlineChartPie` | Wallet share/portfolio |
| Growth | `HiOutlineTrendingUp` | Growth/lifetime value |
| Time | `HiOutlineClock` | Time-based metrics |
| Success | `HiOutlineCheckCircle` | Success states/strength |
| Error | `HiOutlineXCircle` | Error states |
| Warning | `HiOutlineExclamationCircle` | Warning alerts |
| Info | `HiOutlineInformationCircle` | Information messages |

## Usage Examples

### Basic Usage

```tsx
import { NavigationIcons, FeatureIcons } from '@/app/components/icons';

// Navigation icon
<NavigationIcons.Home className="w-5 h-5" strokeWidth={1.8} />

// Feature icon
<FeatureIcons.Call className="w-4 h-4" strokeWidth={2} />
```

### In Components

```tsx
const Icon = NavigationIcons['Home'];
return <Icon className="w-6 h-6" strokeWidth={1.8} />;
```

### Dynamic Icon Selection

```tsx
function getActivityIcon(type: string) {
  switch (type) {
    case 'call':
      return <FeatureIcons.Call className="w-4 h-4" strokeWidth={2} />;
    case 'email':
      return <FeatureIcons.Email className="w-4 h-4" strokeWidth={2} />;
    default:
      return null;
  }
}
```

## Design Standards

### Stroke Weight
- **Navigation Icons**: `strokeWidth={1.8}` (consistent with design system)
- **Feature Icons**: `strokeWidth={2}` (standard Heroicons weight)

### Sizing
- **Small**: `w-4 h-4` (16px) - Activity timeline, inline icons
- **Medium**: `w-5 h-5` (20px) - Navigation sidebar
- **Large**: `w-6 h-6` (24px) - Header actions, prominent UI elements

### Colors
Icons inherit color from parent text color:
```tsx
<div className="text-[var(--text-primary)]">
  <NavigationIcons.Home className="w-5 h-5" />
</div>
```

## Updated Components

The following components have been upgraded with premium Heroicons:

### Layout Components
- ✅ `Sidebar.tsx` - All navigation icons
- ✅ `Header.tsx` - Search, notifications, settings, user menu icons
- ✅ `ThemeToggle.tsx` - Sun/moon theme icons

### Feature Components
- ✅ `ActivityTimeline.tsx` - Activity type icons (call, email, meeting, note, signal)
- ✅ `MetricsGrid.tsx` - Metric icons (currency, portfolio, growth, time, calendar)

## Benefits

### Visual Consistency
- All icons from the same design system (Heroicons 2)
- Consistent stroke weight and style
- Professional, minimalist aesthetic

### Maintainability
- Centralized icon management
- Type-safe icon names
- Easy to update or replace icons

### Performance
- Tree-shakeable imports
- Only used icons are bundled
- Optimized SVG rendering

### Developer Experience
- Clear icon naming conventions
- TypeScript autocomplete support
- Documented usage patterns

## Extending the Icon System

### Adding New Icons

1. **Choose from Heroicons**: Visit https://heroicons.com/ (Outline style)

2. **Add to appropriate file**:

```tsx
// In NavigationIcons.tsx or FeatureIcons.tsx
import { HiOutlineNewIcon } from 'react-icons/hi2';

export const NavigationIcons = {
  // ... existing icons
  NewIcon: HiOutlineNewIcon,
};
```

3. **Update TypeScript types** (automatic via `keyof typeof`)

4. **Document in this file**

### Creating New Icon Categories

If you need specialized icon sets:

```tsx
// app/components/icons/CustomIcons.tsx
import { HiOutlineIcon1, HiOutlineIcon2 } from 'react-icons/hi2';

export const CustomIcons = {
  Icon1: HiOutlineIcon1,
  Icon2: HiOutlineIcon2,
};

export type CustomIconName = keyof typeof CustomIcons;
```

## Alternative Icon Sources

If you need icons not available in Heroicons:

### Feather Icons
```tsx
import { FiIcon } from 'react-icons/fi';
```

### Font Awesome
```tsx
import { FaIcon } from 'react-icons/fa6';
```

### Material Design
```tsx
import { MdOutlineIcon } from 'react-icons/md';
```

All available through the same `react-icons` package.

## Migration Notes

### From SVG Paths
Old approach:
```tsx
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2..." />
</svg>
```

New approach:
```tsx
<NavigationIcons.Home className="w-5 h-5" strokeWidth={1.8} />
```

Benefits:
- ✅ Shorter, cleaner code
- ✅ Type-safe icon names
- ✅ Centralized management
- ✅ Better tree-shaking
- ✅ Consistent styling

## Resources

- **React Icons**: https://react-icons.github.io/react-icons/
- **Heroicons**: https://heroicons.com/
- **Tailwind UI**: https://tailwindui.com/components (uses Heroicons)

## Support

For questions or issues with the icon system, refer to:
1. This documentation
2. React Icons documentation
3. Heroicons documentation
4. Project technical team
