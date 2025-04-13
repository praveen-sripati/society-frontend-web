import React, { Suspense } from 'react';
import { Spin } from 'antd';

// Lazy load components
const VisitorPreApprovalForm = React.lazy(() => import('./components/VisitorPreApprovalForm'));
const VisitorPreApprovalList = React.lazy(() => import('./components/VisitorPreApprovalList'));

// Loading fallback component
const LoadingFallback: React.FC = () => (
    <div className="flex justify-center items-center h-full min-h-[400px]">
        <Spin size="large" />
    </div>
);

// Wrapped components with Suspense
export const LazyVisitorPreApprovalForm = () => (
    <Suspense fallback={<LoadingFallback />}>
        <VisitorPreApprovalForm />
    </Suspense>
);

export const LazyVisitorPreApprovalList = () => (
    <Suspense fallback={<LoadingFallback />}>
        <VisitorPreApprovalList />
    </Suspense>
);

// Direct exports for non-lazy usage (if needed)
export { default as VisitorPreApprovalForm } from './components/VisitorPreApprovalForm';
export { default as VisitorPreApprovalList } from './components/VisitorPreApprovalList';