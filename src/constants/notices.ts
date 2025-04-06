import { DefaultOptionType } from 'antd/es/select';

export const NOTICE_CATEGORIES: DefaultOptionType[] = [
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'events', label: 'Events' },
    { value: 'security', label: 'Security' },
    { value: 'general', label: 'General' }
];

export const NOTICE_FILTER_CATEGORIES: DefaultOptionType[] = [
    { value: 'all', label: 'All' },
    ...NOTICE_CATEGORIES
];

export const NOTICE_MESSAGES = {
    CREATE: {
        SUCCESS: 'Notice Created',
        ERROR: 'Failed to create notice'
    },
    FETCH: {
        ERROR: 'Failed to fetch notices',
        SINGLE_ERROR: 'Failed to fetch notice'
    },
    UPDATE: {
        SUCCESS: 'Notice Updated',
        ERROR: 'Failed to update notice'
    },
    DELETE: {
        SUCCESS: 'Notice Deleted',
        ERROR: 'Failed to delete notice'
    }
} as const; 

export const CATEGORY_COLORS = {
    maintenance: '#059212',
    events: '#AA60C8',
    security: '#BF3131',
    general: '#108ee9',
};