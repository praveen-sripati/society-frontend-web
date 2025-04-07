import React, { Suspense } from 'react';
import { Spin } from 'antd';

// Lazy load components
const NoticeBoard = React.lazy(() => import('./components/NoticeBoard'));
const NoticeDetails = React.lazy(() => import('./components/NoticeDetails'));
const NoticeForm = React.lazy(() => import('./components/NoticeForm'));

// Loading fallback component
const LoadingFallback = () => (
    <div className="flex justify-center items-center h-full min-h-[400px]">
        <Spin size="large" />
    </div>
);

// Wrapped components with Suspense
export const LazyNoticeBoard = () => (
    <Suspense fallback={<LoadingFallback />}>
        <NoticeBoard />
    </Suspense>
);

export const LazyNoticeDetails = () => (
    <Suspense fallback={<LoadingFallback />}>
        <NoticeDetails />
    </Suspense>
);

export const LazyNoticeForm = () => (
    <Suspense fallback={<LoadingFallback />}>
        <NoticeForm />
    </Suspense>
);

// Direct exports for non-lazy usage
export { default as NoticeBoard } from './components/NoticeBoard';
export { default as NoticeForm } from './components/NoticeForm';
export { default as NoticeDetails } from './components/NoticeDetails'; 