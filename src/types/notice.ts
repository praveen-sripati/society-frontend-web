export interface Notice {
    id: string;
    title: string;
    content: string;
    category: NoticeCategory;
    createdAt: string;
    createdBy: string;
    attachments?: any;
}

export type NoticeCategory = 'maintenance' | 'events' | 'security' | 'general';

export type NoticeCategoryFilter = NoticeCategory | 'all';

export interface NoticeFilters {
    category?: NoticeCategoryFilter;
    search?: string;
}

export interface CreateNoticePayload {
    title: string;
    content: string;
    category: NoticeCategory;
    attachments?: any;
} 