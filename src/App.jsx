import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { SupabaseAuthProvider } from '@/lib/SupabaseAuthContext';
import { ErrorBoundary } from '@/lib/errorBoundary';
import Landing from './pages/Landing';
import { SpeedInsights } from '@vercel/speed-insights/react';

function App() {
  return (
    <ErrorBoundary message="The app failed to load. Please refresh the page.">
      <SupabaseAuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Router>
          <Toaster />
          <SpeedInsights />
        </QueryClientProvider>
      </SupabaseAuthProvider>
    </ErrorBoundary>
  );
}

export default App;