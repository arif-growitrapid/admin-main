
export const detailed_permissions = [
    {
        id: "visit_admin_panel",
        name: "Visit Admin Panel",
        description: "Access and navigate the administrative control panel with system-wide settings."
    },
    // User Management
    {
        id: "user_add",
        name: "Add User",
        description: "Privilege to create new user accounts with specified roles and permissions."
    },
    {
        id: "user_edit",
        name: "Edit User",
        description: "Modify and update user profiles, including personal and access details."
    },
    {
        id: "user_delete",
        name: "Delete User",
        description: "Ability to permanently remove user accounts from the system."
    },
    {
        id: "user_view",
        name: "View User",
        description: "Permission to see user profiles, including their roles and activity."
    },
    {
        id: "user_edit_others",
        name: "Edit Other Users",
        description: "Modify profiles of other users, subject to specific access permissions."
    },
    // Role Management
    {
        id: "role_add",
        name: "Add Role",
        description: "Create new roles with defined sets of permissions and assign them to users."
    },
    {
        id: "role_edit",
        name: "Edit Role",
        description: "Alter role permissions, affecting what actions users with that role can perform."
    },
    {
        id: "role_delete",
        name: "Delete Role",
        description: "Remove roles, affecting users' access and permissions associated with the role."
    },
    {
        id: "role_view",
        name: "View Role",
        description: "Review and access details of roles within the system."
    },
    // Permission Management
    {
        id: "permission_add",
        name: "Add Permission",
        description: "Introduce new permissions for fine-grained control over user actions."
    },
    {
        id: "permission_edit",
        name: "Edit Permission",
        description: "Modify existing permissions, changing access rights for users or roles."
    },
    {
        id: "permission_delete",
        name: "Delete Permission",
        description: "Remove a permission, affecting user capabilities and access."
    },
    {
        id: "permission_view",
        name: "View Permission",
        description: "Inspect the details and scope of specific permissions."
    },
    // Blog Management
    {
        id: "blogs_add",
        name: "Add Blog",
        description: "Create and publish new blog posts, sharing information and insights."
    },
    {
        id: "blogs_edit",
        name: "Edit Blog",
        description: "Modify and update existing blog posts, refining content and information."
    },
    {
        id: "blogs_delete",
        name: "Delete Blog",
        description: "Remove published blog posts from the platform."
    },
    {
        id: "blogs_edit_others",
        name: "Edit Other's Blog",
        description: "Edit and update blog posts created by other users, if allowed."
    },
    {
        id: "blogs_delete_others",
        name: "Delete Other's Blog",
        description: "Remove blog posts created by other users, subject to permissions."
    },
    {
        id: "blogs_view_published",
        name: "View Published Blog",
        description: "Access and read published blog posts, gaining insights and information."
    },
    {
        id: "blogs_view_draft",
        name: "View Draft Blog",
        description: "View unpublished, draft blog posts for review and editing."
    },
    {
        id: "blogs_like",
        name: "Like Blog",
        description: "Express approval and appreciation for blog posts through 'likes.'"
    },
    {
        id: "blogs_comment",
        name: "Comment on Blog",
        description: "Engage with blog posts by leaving comments and feedback."
    },
    {
        id: "blogs_comment_like",
        name: "Like Blog Comment",
        description: "Show appreciation for specific comments on blog posts."
    },
    {
        id: "blogs_comment_edit",
        name: "Edit Blog Comment",
        description: "Revise and improve comments made on blog posts."
    },
    {
        id: "blogs_comment_delete",
        name: "Delete Blog Comment",
        description: "Remove comments left on blog posts, subject to permissions."
    },
    {
        id: "blogs_comment_edit_others",
        name: "Edit Other's Comment",
        description: "Edit comments made by other users on blog posts, if allowed."
    },
    {
        id: "blogs_comment_delete_others",
        name: "Delete Other's Comment",
        description: "Remove comments made by other users on blog posts, subject to permissions."
    },
    {
        id: "blogs_save",
        name: "Save Blog",
        description: "Bookmark and save blog posts for future reference and viewing."
    },
    // Course Management
    {
        id: "course_enroll",
        name: "Enroll in Course",
        description: "Register for and join courses, accessing educational content and materials."
    },
    {
        id: "course_add",
        name: "Add Course",
        description: "Create new courses, offering educational content and resources to users."
    },
    {
        id: "course_edit",
        name: "Edit Course",
        description: "Modify and update course details, improving the educational experience."
    },
    {
        id: "course_delete",
        name: "Delete Course",
        description: "Remove courses from the platform, affecting user access to educational content."
    },
    {
        id: "course_edit_others",
        name: "Edit Other's Course",
        description: "Modify courses created by other users, if allowed by permissions."
    },
    {
        id: "course_delete_others",
        name: "Delete Other's Course",
        description: "Remove courses created by other users, subject to permissions."
    },
    {
        id: "course_view_published",
        name: "View Published Course",
        description: "Access and explore published courses, acquiring knowledge and skills."
    },
    {
        id: "course_view_draft",
        name: "View Draft Course",
        description: "Review and access unpublished, draft courses for development and improvement."
    },
    // Service Management
    {
        id: "service_enroll",
        name: "Enroll in Service",
        description: "Register for and utilize specific services offered through the platform."
    },
    {
        id: "service_add",
        name: "Add Service",
        description: "Create and offer new services, delivering value to platform users."
    },
    {
        id: "service_edit",
        name: "Edit Service",
        description: "Modify and update service details, enhancing the service offering."
    },
    {
        id: "service_delete",
        name: "Delete Service",
        description: "Remove services from the platform, affecting user access to those services."
    },
    {
        id: "service_edit_others",
        name: "Edit Other's Service",
        description: "Modify services created by other users, if permitted by permissions."
    },
    {
        id: "service_delete_others",
        name: "Delete Other's Service",
        description: "Remove services created by other users, subject to specific permissions."
    },
    {
        id: "service_view_published",
        name: "View Published Service",
        description: "Access and explore published services, benefiting from their offerings."
    },
    {
        id: "service_view_draft",
        name: "View Draft Service",
        description: "Review and access unpublished, draft services for improvements."
    },
    {
        id: "service_like",
        name: "Like Service",
        description: "Express approval and appreciation for specific services through 'likes.'"
    },
    {
        id: "service_comment",
        name: "Comment on Service",
        description: "Engage with services by leaving comments and feedback."
    },
    {
        id: "service_save",
        name: "Save Service",
        description: "Bookmark and save services for future reference and utilization."
    },
    // Other Management
    {
        id: "manage_database",
        name: "Manage Database",
        description: "Oversee and control the database, ensuring data integrity and efficiency."
    },
    {
        id: "view_dashboard",
        name: "View Dashboard",
        description: "Access and interact with the system's dashboard for real-time insights."
    },
    {
        id: "view_settings",
        name: "View Settings",
        description: "Explore and configure system settings to customize your experience."
    },
    {
        id: "view_logs",
        name: "View Logs",
        description: "Inspect system logs to track and analyze system activities and events."
    },
    {
        id: "view_notifications",
        name: "View Notifications",
        description: "Access system notifications to stay informed about important updates."
    },
    {
        id: "view_reports",
        name: "View Reports",
        description: "Access and review detailed reports to gain insights into system performance."
    },
    {
        id: "view_unlighthouse_reports",
        name: "View Unlighthouse Reports",
        description: "Examine specific, in-depth reports for advanced data analysis."
    },
    {
        id: "view_hidden_profiles",
        name: "View Hidden Profiles",
        description: "Access and view user profiles that are not publicly visible."
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

