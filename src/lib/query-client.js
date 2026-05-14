import { QueryClient } from '@tanstack/react-query';

/**
 * Production-grade React Query configuration:
 * - Exponential backoff retries (don't hammer a struggling server)
 * - Don't retry on 4xx client errors (they won't fix themselves)
 * - Sensible stale/cache times to reduce redundant network calls
 * - Global error logging for observability
 */
const shouldRetry = (failureCount, error) => {
  // Don't retry on client-side errors (auth, validation, not found)
  const status = error?.status ?? error?.code;
  if (status === 401 || status === 403 || status === 404 || status === '42501') return false;
  return failureCount < 3;
};

const retryDelay = (attempt) => Math.min(1000 * 2 ** attempt, 15000); // 1s → 2s → 4s → max 15s

export const queryClientInstance = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: shouldRetry,
      retryDelay,
      staleTime: 30_000,        // data is fresh for 30s — avoids redundant fetches
      gcTime: 5 * 60_000,       // keep unused cache for 5 min
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

// Global error observer for observability — log all query/mutation errors
queryClientInstance.getQueryCache().subscribe((event) => {
  if (event?.query?.state?.status === 'error') {
    const err = event.query.state.error;
    console.error('[QueryCache] Query failed:', {
      queryKey: event.query.queryKey,
      message: err?.message,
      code: err?.code,
      timestamp: new Date().toISOString(),
    });
  }
});

queryClientInstance.getMutationCache().subscribe((event) => {
  if (event?.mutation?.state?.status === 'error') {
    const err = event.mutation.state.error;
    console.error('[MutationCache] Mutation failed:', {
      message: err?.message,
      code: err?.code,
      timestamp: new Date().toISOString(),
    });
  }
});