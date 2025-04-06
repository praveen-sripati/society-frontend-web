import axios from 'axios';
import { CreateNoticePayload, Notice, NoticeFilters } from '../types/notice';
import { API_ENDPOINTS } from '../constants';

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const noticeService = {
    // Get all notices with optional filters
    getNotices: async (filters?: NoticeFilters): Promise<Notice[]> => {
        const params = new URLSearchParams();
        if (filters?.category) {
            params.append('category', filters.category);
        }
        if (filters?.search) {
            params.append('search', filters.search);
        }
        
        const url = `${API_ENDPOINTS.NOTICES.BASE}${params.toString() ? `?${params.toString()}` : ''}`;
        console.log('[NoticeService] Making request to:', url);
        
        try {
            const response = await axios.get<ApiResponse<{ notices: Notice[] }>>(url, { withCredentials: true });
            
            // Log the raw response for debugging
            console.log('[NoticeService] Raw response data:', JSON.stringify(response.data, null, 2));

            if (!response.data?.success) {
                console.error('[NoticeService] API returned unsuccessful response');
                return [];
            }

            if (!response.data?.data?.notices || !Array.isArray(response.data.data.notices)) {
                console.error('[NoticeService] Missing or invalid notices array in response');
                return [];
            }

            const notices = response.data.data.notices;
            console.log('[NoticeService] Successfully extracted notices:', {
                length: notices.length,
                firstNotice: notices[0] ? {
                    id: notices[0].id,
                    title: notices[0].title,
                    category: notices[0].category
                } : 'none'
            });

            return notices;
        } catch (error) {
            console.error('[NoticeService] Error fetching notices:', error);
            throw error;
        }
    },

    // Get a single notice by ID
    getNoticeById: async (id: string): Promise<Notice> => {
        const response = await axios.get<ApiResponse<{ notice: Notice }>>(
            API_ENDPOINTS.NOTICES.BY_ID(id),
            { withCredentials: true }
        );
        
        if (!response.data?.success) {
            throw new Error('Failed to fetch notice');
        }

        if (!response.data?.data?.notice) {
            throw new Error('Notice not found');
        }

        return response.data.data.notice;
    },

    // Create a new notice
    createNotice: async (notice: CreateNoticePayload): Promise<ApiResponse<Notice>> => {
        const response = await axios.post<ApiResponse<Notice>>(
            API_ENDPOINTS.NOTICES.BASE,
            notice,
            { withCredentials: true }
        );
        return response.data;
    },

    // Delete a notice
    deleteNotice: async (id: string): Promise<void> => {
        await axios.delete(
            API_ENDPOINTS.NOTICES.BY_ID(id),
            { withCredentials: true }
        );
    }
}; 