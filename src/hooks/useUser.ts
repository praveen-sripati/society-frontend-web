import { useState, useEffect } from 'react';
import axios from 'axios';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface User {
  id: number;
  apartment_number: string;
  mobile_number: string;
  role: 'resident' | 'committee' | 'admin';
  registration_date: string;
}

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get<ApiResponse<User>>('/users/me', { withCredentials: true });
        setUser(response.data.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch user data');
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