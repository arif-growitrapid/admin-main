"use server";

import { Filter, ObjectId } from "mongodb";
import {
    COURSE_PROVIDERS,
    COURSE_PROVIDER_NAMES,
    COURSE_PROVIDER_URLS
} from "@/types/course.types";

import type { DBCourseType } from "@/types/course.types";
import { Response, ServerFunctionResponse } from "./functions";
import { matchPermissions } from "./auth";
import clientPromise from "@/db/db";
import config from "@/config";

export async function getCoursesByProvider(provider: keyof typeof COURSE_PROVIDER_NAMES): Promise<ServerFunctionResponse<DBCourseType<typeof provider>[] | null>> {
    try {
        // Match permissions to view user
        // If the user has the permission to view user, then return the user
        const t = await matchPermissions(["course_view_published", "course_view_draft"]);
        const { session, isMatched, matches } = t ?? {
            session: null,
            isMatched: false,
            matches: ["course_view_published"] as ["course_view_published" | "course_view_draft"],
        };

        const should_view_draft = matches.includes("course_view_draft");

        const client = await clientPromise;
        const db = client.db(config.db.course_name);

        // Get the courses collection: Provider
        const collection = db.collection<DBCourseType<typeof provider>>(provider);

        // Get the courses
        const courses = await collection
            .find({
                "meta.is_published": should_view_draft ? { $in: [true, false] } : true
            })
            .toArray();

        // Return the courses
        return Response("success", courses, 200, "Courses fetched successfully");
    } catch (error) {
        console.error(error);
        return Response("error", null, 500, "Internal server error");
    }
}

export async function getCourseBySlug(provider: keyof typeof COURSE_PROVIDER_NAMES, slug: string): Promise<ServerFunctionResponse<DBCourseType<typeof provider> | null>> {
    try {
        // Match permissions to view user
        // If the user has the permission to view user, then return the user
        const t = await matchPermissions(["course_view_published", "course_view_draft"]);
        const { session, isMatched, matches } = t ?? {
            session: null,
            isMatched: false,
            matches: ["course_view_published"] as ["course_view_published" | "course_view_draft"],
        };

        const should_view_draft = matches.includes("course_view_draft");

        const client = await clientPromise;
        const db = client.db(config.db.course_name);

        // Get the courses collection: Provider
        const collection = db.collection<DBCourseType<typeof provider>>(provider);

        // Get the course
        const course = await collection.findOne({
            "meta.slug": slug,
            "meta.is_published": should_view_draft ? { $in: [true, false] } : true
        });

        // Return the course
        return Response("success", course, 200, "Course fetched successfully");
    } catch (error) {
        console.error(error);
        return Response("error", null, 500, "Internal server error");
    }
}

export async function getCourseById(provider: keyof typeof COURSE_PROVIDER_NAMES, id: string): Promise<ServerFunctionResponse<DBCourseType<typeof provider> | null>> {
    try {
        // Match permissions to view user
        // If the user has the permission to view user, then return the user
        const t = await matchPermissions(["course_view_published", "course_view_draft"]);
        const { session, isMatched, matches } = t ?? {
            session: null,
            isMatched: false,
            matches: ["course_view_published"] as ["course_view_published" | "course_view_draft"],
        };

        const should_view_draft = matches.includes("course_view_draft");

        const client = await clientPromise;
        const db = client.db(config.db.course_name);

        // Get the courses collection: Provider
        const collection = db.collection<DBCourseType<typeof provider>>(provider);

        // Get the course
        const course = await collection.findOne({
            _id: new ObjectId(id),
            "meta.is_published": should_view_draft ? { $in: [true, false] } : true
        });

        // Return the course
        return Response("success", course, 200, "Course fetched successfully");
    } catch (error) {
        console.error(error);
        return Response("error", null, 500, "Internal server error");
    }
}

export async function filterCourse(
    provider: keyof typeof COURSE_PROVIDER_NAMES,
    filter: Filter<DBCourseType<keyof typeof COURSE_PROVIDER_NAMES>>,
    limit: number = 10,
    skip: number = 0,
): Promise<ServerFunctionResponse<DBCourseType<typeof provider>[] | null>> {
    try {
        // Match permissions to view user
        // If the user has the permission to view user, then return the user
        const t = await matchPermissions(["course_view_published", "course_view_draft"]);
        const { session, isMatched, matches } = t ?? {
            session: null,
            isMatched: false,
            matches: ["course_view_published"] as ["course_view_published" | "course_view_draft"],
        };

        const should_view_draft = matches.includes("course_view_draft");

        const client = await clientPromise;
        const db = client.db(config.db.course_name);

        // Get the courses collection: Provider
        const collection = db.collection<DBCourseType<typeof provider>>(provider);

        // Get the course
        const courses = await collection.find({
            ...filter,
            "meta.is_published": should_view_draft ? { $in: [true, false] } : true
        }).limit(limit).skip(skip).toArray();

        // Return the course
        return Response("success", courses, 200, "Course fetched successfully");
    } catch (error) {
        console.error(error);
        return Response("error", null, 500, "Internal server error");
    }
}
