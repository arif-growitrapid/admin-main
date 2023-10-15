
export const detailed_permissions = [
    {
        id: "visit_admin_panel",
        name: "Visit Admin Panel",
        description: "Can visit admin panel",
    },
    // User Management
    {
        id: "user_add",
        name: "Add User",
        description: "Can add new users",
    },
    {
        id: "user_edit",
        name: "Edit User",
        description: "Can edit user profiles",
    },
    {
        id: "user_delete",
        name: "Delete User",
        description: "Can delete user accounts",
    },
    {
        id: "user_view",
        name: "View User",
        description: "Can view user profiles",
    },
    {
        id: "user_edit_others",
        name: "Edit Other Users",
        description: "Can edit profiles of other users",
    },
    // Role Management
    {
        id: "role_add",
        name: "Add Role",
        description: "Can add new roles",
    },
    {
        id: "role_edit",
        name: "Edit Role",
        description: "Can edit role permissions",
    },
    {
        id: "role_delete",
        name: "Delete Role",
        description: "Can delete roles",
    },
    {
        id: "role_view",
        name: "View Role",
        description: "Can view role details",
    },
    // Permission Management
    {
        id: "permission_add",
        name: "Add Permission",
        description: "Can add new permissions",
    },
    {
        id: "permission_edit",
        name: "Edit Permission",
        description: "Can edit permission details",
    },
    {
        id: "permission_delete",
        name: "Delete Permission",
        description: "Can delete permissions",
    },
    {
        id: "permission_view",
        name: "View Permission",
        description: "Can view permission details",
    },
    // Blog Management
    {
        id: "blogs_add",
        name: "Add Blog",
        description: "Can create new blog posts",
    },
    {
        id: "blogs_edit",
        name: "Edit Blog",
        description: "Can edit blog posts",
    },
    {
        id: "blogs_delete",
        name: "Delete Blog",
        description: "Can delete blog posts",
    },
    {
        id: "blogs_edit_others",
        name: "Edit Other's Blog",
        description: "Can edit blog posts created by others",
    },
    {
        id: "blogs_delete_others",
        name: "Delete Other's Blog",
        description: "Can delete blog posts created by others",
    },
    {
        id: "blogs_view_published",
        name: "View Published Blog",
        description: "Can view published blog posts",
    },
    {
        id: "blogs_view_draft",
        name: "View Draft Blog",
        description: "Can view draft blog posts",
    },
    {
        id: "blogs_like",
        name: "Like Blog",
        description: "Can like blog posts",
    },
    {
        id: "blogs_comment",
        name: "Comment on Blog",
        description: "Can comment on blog posts",
    },
    {
        id: "blogs_comment_like",
        name: "Like Blog Comment",
        description: "Can like comments on blog posts",
    },
    {
        id: "blogs_comment_edit",
        name: "Edit Blog Comment",
        description: "Can edit comments on blog posts",
    },
    {
        id: "blogs_comment_delete",
        name: "Delete Blog Comment",
        description: "Can delete comments on blog posts",
    },
    {
        id: "blogs_comment_edit_others",
        name: "Edit Other's Comment",
        description: "Can edit comments on blog posts made by others",
    },
    {
        id: "blogs_comment_delete_others",
        name: "Delete Other's Comment",
        description: "Can delete comments on blog posts made by others",
    },
    {
        id: "blogs_save",
        name: "Save Blog",
        description: "Can save blog posts for later viewing",
    },
    // Course Management
    {
        id: "course_enroll",
        name: "Enroll in Course",
        description: "Can enroll in courses",
    },
    {
        id: "course_add",
        name: "Add Course",
        description: "Can add new courses",
    },
    {
        id: "course_edit",
        name: "Edit Course",
        description: "Can edit course details",
    },
    {
        id: "course_delete",
        name: "Delete Course",
        description: "Can delete courses",
    },
    {
        id: "course_edit_others",
        name: "Edit Other's Course",
        description: "Can edit courses created by others",
    },
    {
        id: "course_delete_others",
        name: "Delete Other's Course",
        description: "Can delete courses created by others",
    },
    {
        id: "course_view_published",
        name: "View Published Course",
        description: "Can view published courses",
    },
    {
        id: "course_view_draft",
        name: "View Draft Course",
        description: "Can view draft courses",
    },
    // Service Management
    {
        id: "service_enroll",
        name: "Enroll in Service",
        description: "Can enroll in services",
    },
    {
        id: "service_add",
        name: "Add Service",
        description: "Can add new services",
    },
    {
        id: "service_edit",
        name: "Edit Service",
        description: "Can edit service details",
    },
    {
        id: "service_delete",
        name: "Delete Service",
        description: "Can delete services",
    },
    {
        id: "service_edit_others",
        name: "Edit Other's Service",
        description: "Can edit services created by others",
    },
    {
        id: "service_delete_others",
        name: "Delete Other's Service",
        description: "Can delete services created by others",
    },
    {
        id: "service_view_published",
        name: "View Published Service",
        description: "Can view published services",
    },
    {
        id: "service_view_draft",
        name: "View Draft Service",
        description: "Can view draft services",
    },
    {
        id: "service_like",
        name: "Like Service",
        description: "Can like services",
    },
    {
        id: "service_comment",
        name: "Comment on Service",
        description: "Can comment on services",
    },
    {
        id: "service_save",
        name: "Save Service",
        description: "Can save services for later viewing",
    },
    // Other Management
    {
        id: "manage_database",
        name: "Manage Database",
        description: "Can manage the database",
    },
    {
        id: "view_dashboard",
        name: "View Dashboard",
        description: "Can access the dashboard",
    },
    {
        id: "view_settings",
        name: "View Settings",
        description: "Can access and view settings",
    },
    {
        id: "view_logs",
        name: "View Logs",
        description: "Can view system logs",
    },
    {
        id: "view_notifications",
        name: "View Notifications",
        description: "Can view system notifications",
    },
    {
        id: "view_reports",
        name: "View Reports",
        description: "Can access and view reports",
    },
    {
        id: "view_unlighthouse_reports",
        name: "View Unlighthouse Reports",
        description: "Can view specific reports",
    },
    {
        id: "view_hidden_profiles",
        name: "View Hidden Profiles",
        description: "Can access and view hidden user profiles",
    },
] as const;

const permissions = detailed_permissions.map((permission) => permission.id);

export default permissions;
export type PermissionsArrayType = typeof detailed_permissions[number]["id"];

// Operators will have all the permissions
export const operator_permissions = permissions;
export const user_permissions: PermissionsArrayType[] = [
    "blogs_view_published",
    "course_view_published",
    "service_view_published",
];

