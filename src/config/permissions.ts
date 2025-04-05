export type UserRole = 'resident' | 'committee' | 'admin';

export type Permission = 
    | 'create:notice'
    | 'edit:notice'
    | 'delete:notice'
    // Add more permissions as needed
    ;

// Define which roles have which permissions
export const rolePermissions: Record<UserRole, Permission[]> = {
    admin: [
        'create:notice',
        'edit:notice',
        'delete:notice'
    ],
    committee: [
        'create:notice',
        'edit:notice',
        'delete:notice'
    ],
    resident: []
};

// Helper function to check if a role has a specific permission
export const hasPermission = (role: UserRole | undefined, permission: Permission): boolean => {
    if (!role) return false;
    return rolePermissions[role].includes(permission);
}; 