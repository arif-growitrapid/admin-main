const permissions = [
    "visit_admin_panel",

    // User Management
    "user_add",
    "user_edit",
    "user_delete",
    "user_view",
    "user_edit_others",
    "user_delete_others",

    // Role Management
    "role_add",
    "role_edit",
    "role_delete",
    "role_view",
    "role_assign",

    // Permission Management
    "permission_add",
    "permission_edit",
    "permission_delete",
    "permission_view",

    // Blog Management
    "blogs_add",
    "blogs_edit",
    "blogs_delete",
    "blogs_edit_others",
    "blogs_delete_others",
    "blogs_view_published",
    "blogs_view_draft",
    "blogs_like",
    "blogs_comment",
    "blogs_comment_like",
    "blogs_comment_edit",
    "blogs_comment_delete",
    "blogs_comment_edit_others",
    "blogs_comment_delete_others",
    "blogs_save",

    // Course Management
    "course_enroll",
    "course_add",
    "course_edit",
    "course_delete",
    "course_edit_others",
    "course_delete_others",
    "course_view_published",
    "course_view_draft",

    // Service Management
    "service_add",
    "service_edit",
    "service_delete",
    "service_edit_others",
    "service_delete_others",
    "service_view_published",
    "service_view_draft",

    // Other Management
    "manage_database",
    "view_dashboard",
    "view_settings",
    "view_logs",
    "view_notifications",
    "view_reports",
    "view_unlighthouse_reports",
    "view_hidden_profiles",
] as const;

export default permissions;
export type PermissionsArrayType = typeof permissions[number];

// Operators will have all the permissions
export const operator_permissions = permissions;
export const user_permissions: PermissionsArrayType[] = [
    "blogs_view_published",
    "course_view_published",
    "service_view_published",
];

