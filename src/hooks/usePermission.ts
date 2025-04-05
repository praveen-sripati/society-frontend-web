import { useAuth } from '../context/AuthContext';
import { Permission } from '../config/permissions';

export const usePermission = () => {
    const { checkPermission } = useAuth();

    const can = (permission: Permission): boolean => {
        return checkPermission(permission);
    };

    return { can };
}; 