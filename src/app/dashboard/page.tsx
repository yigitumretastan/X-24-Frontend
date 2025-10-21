import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Lazy loading ile dashboard bileşenini yükle
const DashboardComponent = dynamic(
  () => import("@/app/components/dashboard/DashboardComponent"),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }
);

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    }>
      <DashboardComponent />
    </Suspense>
  );
}
