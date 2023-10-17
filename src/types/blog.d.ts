import { ObjectId } from "mongodb";
import { MinAuthType } from "./auth";

export interface DBBlogPostType {
    _id: ObjectId;
    title: string;
    slug: string;
    is_published: boolean;
    content: string;
    excerpt: string;
    thumbnail: string;
    time_to_read: number;
    createdAt: Date;
    updatedAt: Date;

    author: MinAuthType;
    tags: ObjectId[];
    categories: ObjectId[];
    comments: BlogCommentType[];

    // For internal use
    views: number;
    likes: number;
    saves: number;
    viewed_by: MinAuthType[];
    viewed_by_ip: string[];
    liked_by: MinAuthType[];
    saved_by: MinAuthType[];

    is_seo_compatabile: boolean;
}

export interface BlogPostType {
    _id: string;
    title: string;
    slug: string;
    is_published: boolean;
    content: string;
    excerpt: string;
    thumbnail: string;
    time_to_read: number;
    createdAt: Date;
    updatedAt: Date;

    author: MinAuthType;
    tags: string[];
    categories: string[];
    comments: BlogCommentType[];

    // For internal use
    views: number;
    likes: number;
    saves: number;
    viewed_by: MinAuthType[];
    viewed_by_ip: string[];
    liked_by: MinAuthType[];
    saved_by: MinAuthType[];

    is_seo_compatabile: boolean;
}

export type BlogCommentType = {
    author: MinAuthType;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    replies: BlogCommentType[];
};
