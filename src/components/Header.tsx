import { Button, Layout } from 'antd';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
    const { logout } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await logout();
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <AntHeader className="flex justify-between items-center px-6 bg-yt-light-gray">
            <h1 className="text-xl font-bold text-white m-0">Society Management</h1>
            <Button 
                type="primary" 
                onClick={handleLogout}
                loading={isLoggingOut}
            >
                Logout
            </Button>
        </AntHeader>
    );
};

export default Header; 