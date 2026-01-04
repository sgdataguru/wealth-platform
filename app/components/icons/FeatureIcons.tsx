/**
 * @file FeatureIcons.tsx
 * @description Premium feature & activity icons using react-icons
 * Consistent minimalist line art style for professional aesthetic
 */

import {
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineVideoCamera,
  HiOutlineCalendar,
  HiOutlineDocumentText,
  HiOutlineCurrencyDollar,
  HiOutlineChartPie,
  HiOutlineArrowTrendingUp,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineExclamationCircle,
  HiOutlineInformationCircle,
} from 'react-icons/hi2';

export const FeatureIcons = {
  Call: HiOutlinePhone,
  Email: HiOutlineEnvelope,
  Meeting: HiOutlineVideoCamera,
  Calendar: HiOutlineCalendar,
  Document: HiOutlineDocumentText,
  Currency: HiOutlineCurrencyDollar,
  Portfolio: HiOutlineChartPie,
  Growth: HiOutlineArrowTrendingUp,
  Time: HiOutlineClock,
  Success: HiOutlineCheckCircle,
  Error: HiOutlineXCircle,
  Warning: HiOutlineExclamationCircle,
  Info: HiOutlineInformationCircle,
};

export type FeatureIconName = keyof typeof FeatureIcons;
