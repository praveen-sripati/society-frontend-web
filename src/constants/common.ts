/**
 * Common notification configuration
 */
export const NOTIFICATION_CONFIG = {
    duration: 5,
    placement: 'top' as const
};

/**
 * Common validation messages
 */
export const VALIDATION_MESSAGES = {
    REQUIRED: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_MOBILE: 'Please enter a valid mobile number',
    INVALID_PASSWORD: 'Password must be at least 8 characters long',
    PASSWORDS_NOT_MATCH: 'Passwords do not match'
};

/**
 * Common API endpoints
 */
export const API_ENDPOINTS = {
    BASE_URL: 'http://localhost:3000/api',
    AUTH: {
        LOGIN: '/users/login',
        REGISTER: '/users/register',
        LOGOUT: '/users/logout',
        ME: '/users/me'
    },
    NOTICES: {
        BASE: '/notices',
        BY_ID: (id: string) => `/notices/${id}`
    }
};

/**
 * Common form validation rules
 */
export const FORM_RULES = {
    required: { required: true, message: VALIDATION_MESSAGES.REQUIRED },
    email: {
        type: 'email' as const,
        message: VALIDATION_MESSAGES.INVALID_EMAIL
    },
    mobile: {
        pattern: /^[0-9]{10}$/,
        message: VALIDATION_MESSAGES.INVALID_MOBILE
    },
    password: {
        min: 8,
        message: VALIDATION_MESSAGES.INVALID_PASSWORD
    }
}; 