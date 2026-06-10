import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import AppShell from '@/components/layout/AppShell';
import { Spinner } from '@/components/common/Spinner';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { getAllTools } from '@/config/tool.registry';

// Eagerly loaded pages
const HomePage = lazy(() => import('@/pages/HomePage'));
const CategoryPage = lazy(() => import('@/pages/CategoryPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

function LazyPage({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Spinner />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

export default function AppRoutes() {
  const tools = getAllTools();

  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route
          index
          element={
            <LazyPage>
              <HomePage />
            </LazyPage>
          }
        />
        <Route
          path="category/:categoryId"
          element={
            <LazyPage>
              <CategoryPage />
            </LazyPage>
          }
        />
        {tools.map((tool) => (
          <Route
            key={tool.id}
            path={tool.route.replace(/^\//, '')}
            element={
              <LazyPage>
                <tool.component />
              </LazyPage>
            }
          />
        ))}
        <Route
          path="*"
          element={
            <LazyPage>
              <NotFoundPage />
            </LazyPage>
          }
        />
      </Route>
    </Routes>
  );
}
