import React, { Suspense } from 'react';
import { Spin } from 'antd';

// Lazy load components
const NoticeBoard = React.lazy(() => import('./components/NoticeBoard'));
const NoticeDetails = React.lazy(() => import('./components/NoticeDetails'));
const CreateNotice = React.lazy(() => import('./components/CreateNotice'));

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

export const LazyCreateNotice = () => (
    <Suspense fallback={<LoadingFallback />}>
        <CreateNotice />
    </Suspense>
);

// Direct exports for non-lazy usage
export { default as NoticeBoard } from './components/NoticeBoard';
export { default as CreateNotice } from './components/CreateNotice';
export { default as NoticeDetails } from './components/NoticeDetails'; 