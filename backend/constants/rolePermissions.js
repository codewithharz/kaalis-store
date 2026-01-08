// backend/constants/rolePermissions.js
const ROLE_PERMISSIONS = {
    SuperAdmin: ['*'], // All permissions
    Admin: [
      'manage_users',
      'manage_content',
      'view_reports',
      'manage_products',
      'manage_orders'
    ],
    Moderator: [
      'manage_content',
      'view_reports'
    ]
  };
  
  module.exports = ROLE_PERMISSIONS;