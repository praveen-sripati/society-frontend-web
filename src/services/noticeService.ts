import axios from 'axios';
import { CreateNoticePayload, Notice, NoticeFilters } from '../types/notice';

const BASE_URL = 'http://localhost:3000/api';

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
        
        const response = await axios.get(
            `${BASE_URL}/notices${params.toString() ? `?${params.toString()}` : ''}`,
            { withCredentials: true }
        );
        return response.data;
    },

    // Get a single notice by ID
    getNoticeById: async (id: string): Promise<Notice> => {
        const response = await axios.get(`${BASE_URL}/notices/${id}`, {
            withCredentials: true
        });
        return response.data;
    },

    // Create a new notice
    createNotice: async (notice: CreateNoticePayload): Promise<Notice> => {
        const response = await axios.post(`${BASE_URL}/notices`, notice, {
            withCredentials: true
        });
        return response.data;
    },

    // Delete a notice
    deleteNotice: async (id: string): Promise<void> => {
        await axios.delete(`${BASE_URL}/notices/${id}`, {
            withCredentials: true
        });
    }
}; 