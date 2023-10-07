"use server";

import clientPromise from "@/db/db";
import config from "@/config";

export default async function setup_db() {
    try {
        console.log("Setting up database");

        // Connect to MongoDB & Get the client
        const client = (await clientPromise);

        // Get the databases
        const root_db = client.db(config.db.root_name);
        const auth_db = client.db(config.db.auth_name);
        const blog_db = client.db(config.db.blog_name);

        // Create the collections if they don't exist
        // auth db is usually managed by next-auth
        
        // Create Root Collections if they don't exist
        // (roles)
        const root_roles_collection_exists = await root_db.listCollections({ name: "roles" }).hasNext();
        if (!root_roles_collection_exists) {
            await root_db.createCollection("roles");
        }


        // Create Blog Collections if they don't exist
        // (posts, categories, tags)
        const blog_posts_collection_exists = await blog_db.listCollections({ name: "posts" }).hasNext();
        if (!blog_posts_collection_exists) {
            await blog_db.createCollection("posts");
        }
        const blog_posts_collection = blog_db.collection("posts");

        const blog_categories_collection_exists = await blog_db.listCollections({ name: "categories" }).hasNext();
        if (!blog_categories_collection_exists) {
            await blog_db.createCollection("categories");
        }
        const blog_categories_collection = blog_db.collection("categories");

        const blog_tags_collection_exists = await blog_db.listCollections({ name: "tags" }).hasNext();
        if (!blog_tags_collection_exists) {
            await blog_db.createCollection("tags");
        }
        const blog_tags_collection = blog_db.collection("tags");

    } catch (err) {
        console.error(err);
        return false;
    }
}
