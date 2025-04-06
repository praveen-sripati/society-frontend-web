/**
 * Common API response interface used across the application
 */
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

/**
 * Common error response interface
 */
export interface ApiError {
    message: string;
    status: number;
}

/**
 * Common notification configuration
 */
export const NOTIFICATION_CONFIG = {
    duration: 5,
    placement: 'top' as const
}; 