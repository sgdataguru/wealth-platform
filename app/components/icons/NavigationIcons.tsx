/**
 * @file NavigationIcons.tsx
 * @description Premium navigation icons using react-icons (Heroicons 2)
 * Consistent stroke weight and minimalist line art style
 */

import {
  HiOutlineHome,
  HiOutlineUsers,
  HiOutlineBolt,
  HiOutlineGlobeAlt,
  HiOutlineChartBar,
  HiOutlineLightBulb,
  HiOutlineShieldCheck,
  HiOutlineMagnifyingGlass,
  HiOutlineBell,
  HiOutlineUser,
  HiOutlineCog,
  HiOutlineArrowRightOnRectangle,
  HiOutlineChevronDown,
  HiOutlineSun,
  HiOutlineMoon,
} from 'react-icons/hi2';

export const NavigationIcons = {
  Home: HiOutlineHome,
  Prospects: HiOutlineUsers,
  Signals: HiOutlineBolt,
  Network: HiOutlineGlobeAlt,
  Analytics: HiOutlineChartBar,
  AIInsights: HiOutlineLightBulb,
  Compliance: HiOutlineShieldCheck,
  DeepDive: HiOutlineMagnifyingGlass,
  Notifications: HiOutlineBell,
  Profile: HiOutlineUser,
  Settings: HiOutlineCog,
  Logout: HiOutlineArrowRightOnRectangle,
  ChevronDown: HiOutlineChevronDown,
  Sun: HiOutlineSun,
  Moon: HiOutlineMoon,
};

export type NavigationIconName = keyof typeof NavigationIcons;
