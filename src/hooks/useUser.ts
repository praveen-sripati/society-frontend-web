import { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
    userId: string;
    role: 'resident' | 'committee' | 'admin';
    email: string;
}

export const useUser = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('/api/users/me', { withCredentials: true });
                setUser(response.data);
                setError(null);
            } catch (err: any) {
                setError(err.response?.data?.error || 'Failed to fetch user data');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const canCreateNotice = user?.role === 'committee' || user?.role === 'admin';

    return { user, loading, error, canCreateNotice };
}; 