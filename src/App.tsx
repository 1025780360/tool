import { BrowserRouter } from 'react-router-dom';
import AppRoutes from '@/router';
import { ToolFilterProvider } from '@/hooks/useToolFilter';

export default function App() {
  return (
    <BrowserRouter>
      <ToolFilterProvider>
        <AppRoutes />
      </ToolFilterProvider>
    </BrowserRouter>
  );
}
