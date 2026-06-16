import { Suspense } from 'react';
import DashboardContent from '../../components/dashboard-content';

export default function DashboardPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#03001e] text-white/50 font-mono gap-4">
          <div className="h-8 w-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
          <span className="text-xs uppercase tracking-widest animate-pulse">INIT_INTELLIGENCE_CORE...</span>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
