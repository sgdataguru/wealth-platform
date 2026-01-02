/**
 * @file app/intelligence/page.tsx
 * @description Intelligence dashboard page
 */

import { Header, Sidebar } from '@/app/components/layout';
import SignalsList from '@/app/components/features/intelligence/SignalsList';

export default function IntelligencePage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header userName="John Smith" userInitials="JS" />

      <div className="flex">
        <Sidebar activePage="signals" />

        <main className="flex-1 p-8">
          <SignalsList />
        </main>
      </div>
    </div>
  );
}
