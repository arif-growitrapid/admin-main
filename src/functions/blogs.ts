"use server";

import { BlogTagType, DBBlogPostType } from "@/types/blog";
import { ObjectId, WithId } from "mongodb";
import { Response, ServerFunctionResponse } from "./functions";
import { MinifyAuth, matchPermissions } from "./auth";
import config from "@/config";
import clientPromise from "@/db/db";
import { revalidatePath } from "next/cache";
import { AuthType } from "@/types/auth";

export async function createBlog(path?: string): Promise<ServerFunctionResponse<boolean | null>> {
    try {
        // Match permissions to view user
        // If the user has the permission to view user, then return the user
        const t = await matchPermissions(["blogs_add"]);
        if (!t) return Response("error", null, 401, "You don't have the permission to create blogs");
        const { session, isMatched, matches } = t;

        if (!isMatched) return Response("error", null, 401, "You don't have the permission to create blogs");

        const client = await clientPromise;

        const db = client.db(config.db.blog_name);
        const collection = db.collection<DBBlogPostType>("posts");

        const blogToCreate: DBBlogPostType = {
            _id: new ObjectId(),
            title: "Untitled",
            slug: `untitled-${new ObjectId().toHexString()}`,
            is_published: false,
            content: "Your content goes here",
            excerpt: "A short description of your blog",
            thumbnail: "https://images.pexels.com/photos/1037992/pexels-photo-1037992.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            time_to_read: 0,
            createdAt: new Date(),
            updatedAt: new Date(),

            author: await MinifyAuth(session.user),
            tags: [],
            categories: [],
            comments: [],

            views: 0,
            likes: 0,
            saves: 0,
            viewed_by: [],
            viewed_by_ip: [],
            liked_by: [],
            saved_by: [],

            is_seo_compatabile: false,
        };

        const createdBlogRef = await collection.insertOne(blogToCreate);
        const createdBlog = await collection.findOne({ _id: createdBlogRef.insertedId });

        path && revalidatePath(path);
        return Response("success", true, 200, "Blog created successfully");
    } catch (error) {
        console.error(error);
        return Response("error", null, 500, "Internal server error");
    }
}

export async function getBlogsByUser(id: string): Promise<ServerFunctionResponse<WithId<DBBlogPostType>[] | null>> {
    try {
        // Match permissions to view user
        // If the user has the permission to view user, then return the user
        const t = await matchPermissions(["blogs_view_published", "blogs_view_draft"]);
        if (!t) return Response("error", null, 401, "You don't have the permission to view users");
        const { session, isMatched, matches } = t;

        if (!isMatched) return Response("error", null, 401, "You don't have the permission to view users");

        const should_view_draft = matches.includes("blogs_view_draft") || session.user.id === id;

        const client = await clientPromise;

        const db = client.db(config.db.blog_name);
        const collection = db.collection<DBBlogPostType>("posts");

        const blogs = await collection.find({
            "author.id": id,
            is_published: should_view_draft ? { $in: [true, false] } : true,
        }).toArray();

        return Response("success", blogs, 200, "Blogs fetched successfully");
    } catch (error) {
        console.error(error);
        return Response("error", null, 500, "Internal server error");
    }
}

export async function getBlogByID(id: string): Promise<ServerFunctionResponse<WithId<DBBlogPostType> | null>> {
    try {
        // Match permissions to view user
        // If the user has the permission to view user, then return the user
        const t = await matchPermissions(["blogs_view_published", "blogs_view_draft"]);
        if (!t) return Response("error", null, 401, "You don't have the permission to view blogs");
        const { session, isMatched, matches } = t;

        if (!isMatched) return Response("error", null, 401, "You don't have the permission to view blogs");

        const should_view_draft = matches.includes("blogs_view_draft");

        const client = await clientPromise;

        const db = client.db(config.db.blog_name);
        const collection = db.collection<DBBlogPostType>("posts");

        const blog = await collection.findOne({
            _id: new ObjectId(id),
            is_published: should_view_draft ? { $in: [true, false] } : true,
        });

        if (!blog) return Response("error", null, 404, "Blog not found");

        // If the blog is not published, then only the author can view the blog
        // Or, if the user has the permission to view draft blogs
        if (blog.is_published === false && blog.author.id !== session.user.id && !should_view_draft)
            return Response("error", null, 401, "You don't have the permission to view this blog");

        return Response("success", blog, 200, "Blog fetched successfully");
    } catch (error) {
        console.error(error);
        return Response("error", null, 500, "Internal server error");
    }
}

export async function getBlogBySlug(slug: string): Promise<ServerFunctionResponse<WithId<DBBlogPostType> | null>> {
    try {
        // Match permissions to view user
        // If the user has the permission to view user, then return the user
        const t = await matchPermissions(["blogs_view_published", "blogs_view_draft"]);
        const { session, isMatched, matches } = t ?? {
            session: null,
            isMatched: false,
            matches: ["blogs_view_published"] as ["blogs_view_published" | "blogs_view_draft"],
        };

        const should_view_draft = matches.includes("blogs_view_draft");

        const client = await clientPromise;
        const db = client.db(config.db.blog_name);
        const collection = db.collection<DBBlogPostType>("posts");

        const blog = await collection.findOne({
            slug,
            is_published: should_view_draft ? { $in: [true, false] } : true,
        });

        if (!blog) return Response("error", null, 404, "Blog not found");

        // If the blog is not published, then only the author can view the blog
        // Or, if the user has the permission to view draft blogs
        if (blog.is_published === false && blog.author.id !== session?.user?.id && !should_view_draft)
            return Response("error", null, 401, "You don't have the permission to view this blog");

        return Response("success", blog, 200, "Blog fetched successfully");
    } catch (error) {
        console.error(error);
        return Response("error", null, 500, "Internal server error");
    }
}

export async function likeBlog(blog_id: string, path?: string): Promise<ServerFunctionResponse<boolean | null>> {
    try {
        // Match permissions to view user
        // If the user has the permission to view user, then return the user
        const t = await matchPermissions(["blogs_like"]);
        if (!t) return Response("error", null, 401, "You don't have the permission to like blogs");
        const { session, isMatched, matches } = t;

        if (!isMatched) return Response("error", null, 401, "You don't have the permission to like blogs");

        const client = await clientPromise;

        const db = client.db(config.db.blog_name);
        const collection = db.collection<DBBlogPostType>("posts");

        const blog = await collection.findOne({
            _id: new ObjectId(blog_id),
        });

        if (!blog) return Response("error", null, 404, "Blog not found");

        // If the blog is not published, then only the author can view the blog
        // Or, if the user has the permission to view draft blogs
        if (blog.is_published === false)
            return Response("error", null, 401, "This blog is not published yet");

        // Check if the user has already liked the blog
        if (blog.liked_by.find((user) => user.id === session.user.id))
            return Response("error", null, 401, "You have already liked this blog");

        const updatedBlog = await collection.findOneAndUpdate(
            {
                _id: new ObjectId(blog_id),
            },
            {
                $inc: { likes: 1 },
                $push: { liked_by: await MinifyAuth(session.user) },
            },
            { returnDocument: "after" }
        );

        path && revalidatePath(path);
        return Response("success", true, 200, "Blog liked successfully");
    } catch (error) {
        console.error(error);
        return Response("error", null, 500, "Internal server error");
    }
}

export async function removeLikeBlog(blog_id: string, path?: string): Promise<ServerFunctionResponse<boolean | null>> {
    try {
        // Match permissions to view user
        // If the user has the permission to view user, then return the user
        const t = await matchPermissions(["blogs_like"]);
        if (!t) return Response("error", null, 401, "You don't have the permission to like blogs");
        const { session, isMatched, matches } = t;

        if (!isMatched) return Response("error", null, 401, "You don't have the permission to like blogs");

        const client = await clientPromise;

        const db = client.db(config.db.blog_name);
        const collection = db.collection<DBBlogPostType>("posts");

        const blog = await collection.findOne({
            _id: new ObjectId(blog_id),
        });

        if (!blog) return Response("error", null, 404, "Blog not found");

        // If the blog is not published, then only the author can view the blog
        // Or, if the user has the permission to view draft blogs
        if (blog.is_published === false)
            return Response("error", null, 401, "This blog is not published yet");

        // Check if the user has already liked the blog
        if (!blog.liked_by.find((user) => user.id === session.user.id))
            return Response("error", null, 401, "You have not liked this blog yet");

        const updatedBlog = await collection.findOneAndUpdate(
            {
                _id: new ObjectId(blog_id),
            },
            {
                $inc: { likes: -1 },
                $pull: { liked_by: await MinifyAuth(session.user) },
            },
            { returnDocument: "after" }
        );

        path && revalidatePath(path);
        return Response("success", true, 200, "Blog like removed successfully");
    } catch (error) {
        console.error(error);
        return Response("error", null, 500, "Internal server error");
    }
}

export async function saveBlog(blog_id: string, path?: string): Promise<ServerFunctionResponse<boolean | null>> {
    try {
        // Match permissions to view user
        // If the user has the permission to view user, then return the user
        const t = await matchPermissions(["blogs_save"]);
        if (!t) return Response("error", null, 401, "You don't have the permission to save blogs");
        const { session, isMatched, matches } = t;

        if (!isMatched) return Response("error", null, 401, "You don't have the permission to save blogs");

        const client = await clientPromise;

        const auth_db = client.db(config.db.auth_name);
        const user_collection = auth_db.collection<AuthType>("users");

        const blog_db = client.db(config.db.blog_name);
        const collection = blog_db.collection<DBBlogPostType>("posts");

        const user = await user_collection.findOne({
            _id: new ObjectId(session.user.id),
        });

        const blog = await collection.findOne({
            _id: new ObjectId(blog_id),
        });

        if (!blog) return Response("error", null, 404, "Blog not found");

        // If the blog is not published, then only the author can view the blog
        // Or, if the user has the permission to view draft blogs
        if (blog.is_published === false)
            return Response("error", null, 401, "This blog is not published yet");

        // Check if the user has already saved the blog
        const is_saved_in_blog = blog.saved_by.find((user) => user.id === session.user.id);
        const is_saved_in_user = user?.savedContent?.find((blog) => blog.ref === blog_id);

        if (is_saved_in_blog && is_saved_in_user)
            return Response("error", null, 401, "You have already saved this blog");

        // Update user
        if (!is_saved_in_user)
            await user_collection.findOneAndUpdate(
                {
                    _id: new ObjectId(session.user.id),
                },
                {
                    $push: {
                        savedContent: {
                            ref: blog_id,
                            type: "blog",
                            createdAt: new Date(),
                        }
                    },
                }
            );

        // Update blog
        if (!is_saved_in_blog)
            await collection.findOneAndUpdate(
                {
                    _id: new ObjectId(blog_id),
                },
                {
                    $inc: { saves: 1 },
                    $push: { saved_by: await MinifyAuth(session.user) },
                },
            );

        path && revalidatePath(path);
        return Response("success", true, 200, "Blog saved successfully");
    } catch (error) {
        console.error(error);
        return Response("error", null, 500, "Internal server error");
    }
}

export async function unsaveBlog(blog_id: string, path?: string): Promise<ServerFunctionResponse<boolean | null>> {
    try {
        // Match permissions to view user
        // If the user has the permission to view user, then return the user
        // await matchPermissions(["blogs_save"]);
        const t = await matchPermissions(["blogs_save"]);
        if (!t) return Response("error", null, 401, "You don't have the permission to save/unsave blogs");
        const { session, isMatched, matches } = t;

        if (!isMatched) return Response("error", null, 401, "You don't have the permission to save/unsave blogs");

        const client = await clientPromise;

        const auth_db = client.db(config.db.auth_name);
        const user_collection = auth_db.collection<AuthType>("users");

        const blog_db = client.db(config.db.blog_name);
        const collection = blog_db.collection<DBBlogPostType>("posts");

        const user = await user_collection.findOne({
            _id: new ObjectId(session.user.id),
        });

        const blog = await collection.findOne({
            _id: new ObjectId(blog_id),
        });

        if (!blog) return Response("error", null, 404, "Blog not found");

        // If the blog is not published, then only the author can view the blog
        // Or, if the user has the permission to view draft blogs
        if (blog.is_published === false)
            return Response("error", null, 401, "This blog is not published yet");

        // Check if the user has already saved the blog
        const is_saved_in_blog = blog.saved_by.find((user) => user.id === session.user.id);
        const is_saved_in_user = user?.savedContent?.find((blog) => blog.ref === blog_id);

        if (!is_saved_in_blog && !is_saved_in_user)
            return Response("error", null, 401, "You have not saved this blog yet");

        // Update user
        if (is_saved_in_user)
            await user_collection.findOneAndUpdate(
                {
                    _id: new ObjectId(session.user.id),
                },
                {
                    $pull: {
                        savedContent: {
                            ref: blog_id,
                            type: "blog",
                        }
                    },
                }
            );

        // Update blog
        if (is_saved_in_blog)
            await collection.findOneAndUpdate(
                {
                    _id: new ObjectId(blog_id),
                },
                {
                    $inc: { saves: -1 },
                    $pull: { saved_by: await MinifyAuth(session.user) },
                },
            );

        path && revalidatePath(path);
        return Response("success", true, 200, "Blog unsaved successfully");
    } catch (error) {
        console.error(error);
        return Response("error", null, 500, "Internal server error");
    }
}

export async function viewBlog(blog_id: string, ip: string, path?: string): Promise<ServerFunctionResponse<WithId<DBBlogPostType> | null>> {
    try {
        // Match permissions to view user
        // If the user has the permission to view user, then return the user
        const t = await matchPermissions(["blogs_view_published", "blogs_view_draft"]);
        const { session, isMatched, matches } = t ?? {
            session: null,
            isMatched: false,
            matches: ["blogs_view_published"] as ["blogs_view_published" | "blogs_view_draft"],
        };

        const should_view_draft = matches.includes("blogs_view_draft");

        const client = await clientPromise;

        const db = client.db(config.db.blog_name);
        const collection = db.collection<DBBlogPostType>("posts");

        const blog = await collection.findOne({
            _id: new ObjectId(blog_id),
        });

        if (!blog) return Response("error", null, 404, "Blog not found");

        // If the blog is not published, then only the author can view the blog
        // Or, if the user has the permission to view draft blogs
        if (blog.is_published === false)
            return Response("error", null, 401, "This blog is not published yet");

        // Check if the user has already viewed the blog
        if (blog.viewed_by.find((user) => user.id === ip))
            return Response("error", null, 401, "You have already viewed this blog");

        const updatedBlog = await collection.findOneAndUpdate(
            {
                _id: new ObjectId(blog_id),
                is_published: should_view_draft ? { $in: [true, false] } : true,
            },
            {
                $inc: { views: 1 },
                $push: session ? { viewed_by: await MinifyAuth(session.user) } : {},
            },
            { returnDocument: "after" }
        );

        path && revalidatePath(path);
        return Response("success", updatedBlog, 200, "Blog viewed successfully");
    } catch (error) {
        console.error(error);
        return Response("error", null, 500, "Internal server error");
    }
}

export async function searchForBlog(
    query: string,
    limit: number,
    skip: number,
): Promise<ServerFunctionResponse<{
    blogs: WithId<DBBlogPostType>[];
    total: number;
} | null>> {
    try {
        // Match permissions to view user
        // If the user has the permission to view user, then return the user
        const t = await matchPermissions(["blogs_view_published", "blogs_view_draft"]);
        const { session, isMatched, matches } = t ?? {
            session: null,
            isMatched: false,
            matches: ["blogs_view_published"] as ["blogs_view_published" | "blogs_view_draft"],
        };

        const should_view_draft = matches.includes("blogs_view_draft");

        const client = await clientPromise;

        const db = client.db(config.db.blog_name);
        const collection = db.collection<DBBlogPostType>("posts");

        const blogs = await collection.find({
            $text: {
                $search: query,
                $caseSensitive: false,
                $diacriticSensitive: false,
            },
            is_published: should_view_draft ? { $in: [true, false] } : true,
        }).skip(skip).limit(limit).toArray();

        const total = await collection.countDocuments({
            $text: {
                $search: query,
                $caseSensitive: false,
                $diacriticSensitive: false,
            },
            is_published: should_view_draft ? { $in: [true, false] } : true,
        });

        return Response("success", {
            blogs,
            total,
        }, 200, "Blogs fetched successfully");
    } catch (error) {
        console.error(error);
        return Response("error", null, 500, "Internal server error");
    }
}

export async function filterBlogs(
    filter: "views" | "likes" | "saves",
    limit: number,
    skip: number,
): Promise<ServerFunctionResponse<{
    blogs: WithId<DBBlogPostType>[];
    total: number;
} | null>> {
    try {
        // Match permissions to view user
        // If the user has the permission to view user, then return the user
        // await matchPermissions(["blogs_view_published", "blogs_view_draft"]);

        const client = await clientPromise;

        const db = client.db(config.db.blog_name);
        const collection = db.collection<DBBlogPostType>("posts");

        const blogs = await collection.find({
            is_published: true,
        }).sort({
            [filter]: -1,
        }).skip(skip).limit(limit).toArray();

        const total = await collection.countDocuments({
            is_published: true,
        });

        return Response("success", {
            blogs,
            total,
        }, 200, "Blogs fetched successfully");
    } catch (error) {
        console.error(error);
        return Response("error", null, 500, "Internal server error");
    }
}

export async function deleteBlog(blog_id: string, path?: string): Promise<ServerFunctionResponse<boolean | null>> {
    try {
        // Match permissions to view user
        // If the user has the permission to view user, then return the user
        const t = await matchPermissions(["blogs_delete", "blogs_delete_others"]);
        if (!t) return Response("error", null, 401, "You don't have the permission to delete blogs");
        const { session, isMatched, matches } = t;

        if (!isMatched) return Response("error", null, 401, "You don't have the permission to delete blogs");

        const client = await clientPromise;

        const db = client.db(config.db.blog_name);
        const collection = db.collection<DBBlogPostType>("posts");

        const blog = await collection.findOne({
            _id: new ObjectId(blog_id),
        });

        if (!blog) return Response("error", null, 404, "Blog not found");

        // If the blog is not published, then only the author can view the blog
        // Or, if the user has the permission to view draft blogs
        if (blog.author.id !== session.user.id && !matches.includes("blogs_delete_others"))
            return Response("error", null, 401, "You don't have the permission to delete this blog");

        const deletedBlog = await collection.findOneAndDelete({
            _id: new ObjectId(blog_id),
        });

        path && revalidatePath(path);
        return Response("success", true, 200, "Blog deleted successfully");
    } catch (error) {
        console.error(error);
        return Response("error", null, 500, "Internal server error");
    }
}

export async function changeVisibilityBlog(blog_id: string, path?: string): Promise<ServerFunctionResponse<boolean | null>> {
    try {
        // Match permissions to view user
        // If the user has the permission to view user, then return the user
        const t = await matchPermissions(["blogs_edit", "blogs_edit_others"]);
        if (!t) return Response("error", null, 401, "You don't have the permission to change the visibility of blogs");
        const { session, isMatched, matches } = t;

        if (!isMatched) return Response("error", null, 401, "You don't have the permission to change the visibility of blogs");

        const client = await clientPromise;

        const db = client.db(config.db.blog_name);
        const collection = db.collection<DBBlogPostType>("posts");

        const blog = await collection.findOne({
            _id: new ObjectId(blog_id),
        });

        if (!blog) return Response("error", null, 404, "Blog not found");

        // If the blog is not published, then only the author can view the blog
        // Or, if the user has the permission to view draft blogs
        if (blog.author.id !== session.user.id && !matches.includes("blogs_edit_others"))
            return Response("error", null, 401, "You don't have the permission to change the visibility of this blog");

        const updatedBlog = await collection.findOneAndUpdate(
            {
                _id: new ObjectId(blog_id),
            },
            {
                $set: { is_published: !blog.is_published },
            },
            { returnDocument: "after" }
        );

        path && revalidatePath(path);
        return Response("success", true, 200, "Blog visibility changed successfully");
    } catch (error) {
        console.error(error);
        return Response("error", null, 500, "Internal server error");
    }
}

export async function updateBlog(blog_id: string, data: Partial<DBBlogPostType>, path?: string): Promise<ServerFunctionResponse<WithId<DBBlogPostType> | null>> {
    try {
        // Match permissions to view user
        // If the user has the permission to view user, then return the user
        const t = await matchPermissions(["blogs_edit", "blogs_edit_others"]);
        if (!t) return Response("error", null, 401, "You don't have the permission to update blogs");
        const { session, isMatched, matches } = t;

        if (!isMatched) return Response("error", null, 401, "You don't have the permission to update blogs");

        const client = await clientPromise;

        const db = client.db(config.db.blog_name);
        const tags_collection = db.collection<WithId<BlogTagType>>("tags");
        const collection = db.collection<DBBlogPostType>("posts");

        const blog = await collection.findOne({
            _id: new ObjectId(blog_id),
        });

        if (!blog) return Response("error", null, 404, "Blog not found");

        // If the blog is not published, then only the author can view the blog
        // Or, if the user has the permission to view draft blogs
        if (blog.author.id !== session.user.id && !matches.includes("blogs_edit_others"))
            return Response("error", null, 401, "You don't have the permission to update this blog");

        const updatedBlog = await collection.findOneAndUpdate(
            {
                _id: new ObjectId(blog_id),
            },
            {
                $set: {
                    title: data.title ?? blog.title,
                    slug: data.slug ?? blog.slug,
                    is_published: data.is_published ?? blog.is_published,
                    content: data.content ?? blog.content,
                    excerpt: data.excerpt ?? blog.excerpt,
                    thumbnail: data.thumbnail ?? blog.thumbnail,
                    time_to_read: data.time_to_read ?? blog.time_to_read,
                    updatedAt: new Date(),

                    tags: data.tags ?? blog.tags,
                    categories: data.categories ?? blog.categories,
                    comments: data.comments ?? blog.comments,

                    is_seo_compatabile: data.is_seo_compatabile ?? blog.is_seo_compatabile,
                },
            },
            { returnDocument: "after" }
        );

        // Add tag if not exists
        // If the tag exists, then add the blog id to the tag
        // Don't await this
        data.tags?.forEach(async (tag) => {
            const tagExists = await tags_collection.findOne({ name: tag });
            if (tagExists) {
                await tags_collection.findOneAndUpdate(
                    {
                        name: tag,
                    },
                    {
                        $addToSet: { posts: blog_id },
                    }
                );
            } else {
                await tags_collection.insertOne({
                    _id: new ObjectId(),
                    name: tag,
                    createdAt: new Date(),
                    posts: [blog_id],
                });
            }
        });

        // Add id to category if category exists
        // Don't await this
        data.categories?.forEach(async (category) => {
            const categoryExists = await tags_collection.findOne({ name: category });
            if (categoryExists) {
                await tags_collection.findOneAndUpdate(
                    {
                        name: category,
                    },
                    {
                        $addToSet: { posts: blog_id },
                    }
                );
            }
        });

        path && revalidatePath(path);
        return Response("success", updatedBlog, 200, "Blog updated successfully");
    } catch (error) {
        console.error(error);
        return Response("error", null, 500, "Internal server error");
    }
}
