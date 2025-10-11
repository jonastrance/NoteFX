import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useMemo } from 'react';
import { AppShell } from '@/components/AppShell';

const queryClient = new QueryClient();

const Providers = ({ children }: { children: ReactNode }) => {
  const client = useMemo(() => queryClient, []);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

const App = () => {
  return (
    <Providers>
      <AppShell />
    </Providers>
  );
};

export default App;
