"use server";

import { Filter, ObjectId } from "mongodb";
import {
  COURSE_PROVIDERS,
  COURSE_PROVIDER_NAMES,
  COURSE_PROVIDER_URLS,
} from "@/types/course.types";

import type { CoursesTypes, DBCourseType } from "@/types/course.types";
import { Response, ServerFunctionResponse } from "./functions";
import { matchPermissions } from "./auth";
import clientPromise from "@/db/db";
import config from "@/config";
import { revalidatePath } from "next/cache";

export async function createCourse(
  provider: (typeof COURSE_PROVIDERS)[number],
  tagString: string,
  newCourse: CoursesTypes[typeof provider],
  path?: string
): Promise<ServerFunctionResponse<DBCourseType<typeof provider> | null>> {
  try {
    // Match permissions to view user
    // If the user has the permission to view user, then return the user
    const t = await matchPermissions(["course_add"]);
    if (!t)
      return Response(
        "error",
        null,
        401,
        "You don't have the permission to create blogs"
      );
    const { session, isMatched, matches } = t;

    if (!isMatched)
      return Response(
        "error",
        null,
        401,
        "You don't have the permission to create blogs"
      );

    const client = await clientPromise;
    const db = client.db(config.db.course_name);

    // Get the courses collection: Provider
    const collection = db.collection<DBCourseType<typeof provider>>(provider);

    const currentTimestamp = new Date();

    // Create the course
    const newCourseRef = await collection.insertOne({
      _id: new ObjectId(),
      data: newCourse,
      meta: {
        provider,
        slug: newCourse.title.toLowerCase().replace(/ /g, "-"),
        published_by: session?.user._id.toString() ?? "",
        published_at: currentTimestamp,
        updated_by: session?.user._id.toString() ?? "",
        updated_at: currentTimestamp,

        is_published: false,
        is_featured: false,
        is_verified: false,
        is_approved: false,
        is_premium: false,

        tag_string: tagString,

        views: 0,
        likes: 0,
        saves: 0,
        viewed_by: [],
        viewed_by_ip: [],
        liked_by: [],
        saved_by: [],

        is_seo_compatabile: false,
        is_open_graph_compatabile: false,
      },
    });

    if (!newCourseRef.insertedId)
      return Response("error", null, 500, "Internal server error");

    const newCreatedCourse = path
      ? null
      : await collection.findOne({
          _id: newCourseRef.insertedId,
        });

    // Return the course
    path && revalidatePath(path);
    return Response(
      "success",
      newCreatedCourse,
      200,
      "Blog created successfully"
    );
  } catch (error) {
    console.error(error);
    return Response("error", null, 500, "Internal server error");
  }
}

export async function getCoursesByProvider(
  provider: keyof typeof COURSE_PROVIDER_NAMES
): Promise<ServerFunctionResponse<DBCourseType<typeof provider>[] | null>> {
  try {
    // Match permissions to view user
    // If the user has the permission to view user, then return the user
    const t = await matchPermissions([
      "course_view_published",
      "course_view_draft",
    ]);
    const { session, isMatched, matches } = t ?? {
      session: null,
      isMatched: false,
      matches: ["course_view_published"] as [
        "course_view_published" | "course_view_draft",
      ],
    };

    const should_view_draft = matches.includes("course_view_draft");

    const client = await clientPromise;
    const db = client.db(config.db.course_name);

    // Get the courses collection: Provider
    const collection = db.collection<DBCourseType<typeof provider>>(provider);

    // Get the courses
    const courses = await collection
      .find({
        "meta.is_published": should_view_draft ? { $in: [true, false] } : true,
      })
      .toArray();

    // Return the courses
    return Response("success", courses, 200, "Courses fetched successfully");
  } catch (error) {
    console.error(error);
    return Response("error", null, 500, "Internal server error");
  }
}

export async function getCourseBySlug(
  provider: keyof typeof COURSE_PROVIDER_NAMES,
  slug: string
): Promise<ServerFunctionResponse<DBCourseType<typeof provider> | null>> {
  try {
    // Match permissions to view user
    // If the user has the permission to view user, then return the user
    const t = await matchPermissions([
      "course_view_published",
      "course_view_draft",
    ]);
    const { session, isMatched, matches } = t ?? {
      session: null,
      isMatched: false,
      matches: ["course_view_published"] as [
        "course_view_published" | "course_view_draft",
      ],
    };

    const should_view_draft = matches.includes("course_view_draft");

    const client = await clientPromise;
    const db = client.db(config.db.course_name);

    // Get the courses collection: Provider
    const collection = db.collection<DBCourseType<typeof provider>>(provider);

    // Get the course
    const course = await collection.findOne({
      "meta.slug": slug,
      "meta.is_published": should_view_draft ? { $in: [true, false] } : true,
    });

    // Return the course
    return Response("success", course, 200, "Course fetched successfully");
  } catch (error) {
    console.error(error);
    return Response("error", null, 500, "Internal server error");
  }
}

export async function getCourseById(
  provider: keyof typeof COURSE_PROVIDER_NAMES,
  id: string
): Promise<ServerFunctionResponse<DBCourseType<typeof provider> | null>> {
  try {
    // Match permissions to view user
    // If the user has the permission to view user, then return the user
    const t = await matchPermissions([
      "course_view_published",
      "course_view_draft",
    ]);
    const { session, isMatched, matches } = t ?? {
      session: null,
      isMatched: false,
      matches: ["course_view_published"] as [
        "course_view_published" | "course_view_draft",
      ],
    };

    const should_view_draft = matches.includes("course_view_draft");

    const client = await clientPromise;
    const db = client.db(config.db.course_name);

    // Get the courses collection: Provider
    const collection = db.collection<DBCourseType<typeof provider>>(provider);

    // Get the course
    const course = await collection.findOne({
      _id: new ObjectId(id),
      "meta.is_published": should_view_draft ? { $in: [true, false] } : true,
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
  skip: number = 0
): Promise<ServerFunctionResponse<DBCourseType<typeof provider>[] | null>> {
  try {
    // Match permissions to view user
    // If the user has the permission to view user, then return the user
    const t = await matchPermissions([
      "course_view_published",
      "course_view_draft",
    ]);
    const { session, isMatched, matches } = t ?? {
      session: null,
      isMatched: false,
      matches: ["course_view_published"] as [
        "course_view_published" | "course_view_draft",
      ],
    };

    const should_view_draft = matches.includes("course_view_draft");

    const client = await clientPromise;
    const db = client.db(config.db.course_name);

    // Get the courses collection: Provider
    const collection = db.collection<DBCourseType<typeof provider>>(provider);

    // Get the course
    const courses = await collection
      .find({
        ...filter,
        "meta.is_published": should_view_draft ? { $in: [true, false] } : true,
      })
      .limit(limit)
      .skip(skip)
      .toArray();

    // Return the course
    return Response("success", courses, 200, "Course fetched successfully");
  } catch (error) {
    console.error(error);
    return Response("error", null, 500, "Internal server error");
  }
}
