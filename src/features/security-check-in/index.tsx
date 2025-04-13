import { Spin } from 'antd';
import React, { Suspense } from 'react';

// Lazy load components
const SecurityGuardVisitorManagement = React.lazy(() => import('./components/SecurityGuardVisitorManagement'));

// Loading fallback component
const LoadingFallback = () => (
    <div className="flex justify-center items-center h-full min-h-[400px]">
        <Spin size="large" />
    </div>
);

// Wrapped components with Suspense
export const LazySecurityGuardVisitorManagement = () => (
    <Suspense fallback={<LoadingFallback />}>
        <SecurityGuardVisitorManagement />
    </Suspense>
);

// Direct exports for non-lazy usage
export { default as SecurityGuardVisitorManagement } from './components/SecurityGuardVisitorManagement';
