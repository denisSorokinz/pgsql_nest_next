// app/providers.jsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useState } from 'react';

export default function Providers({ children }: { children?: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { placeholderData: (prev: unknown) => prev } } }));

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
