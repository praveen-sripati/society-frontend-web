export interface Notice {
    id: string;
    title: string;
    content: string;
    category: NoticeCategory;
    posted_by: string;
    updated_at: string;
    created_at: string;
    attachments?: any;
    image_url?: string;
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