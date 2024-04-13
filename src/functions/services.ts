import clientPromise from "@/db/db";
import type {
  DBServiceCollectionType,
  DBServiceType,
  ServiceCollectionType,
  ServiceType,
} from "../types/services";
import { matchPermissions } from "./auth";
import { Response, ServerFunctionResponse } from "./functions";
import config from "@/config";
import { ObjectId } from "mongodb";

export async function createServiceCollection(
  data: ServiceCollectionType,
  path?: string
): Promise<ServerFunctionResponse<ServiceCollectionType | null>> {
  try {
    // Match permissions to view user
    // If the user has the permission to view user, then return the user
    const t = await matchPermissions(["service_add"]);
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
    const db = client.db(config.db.service_name);

    // Check if the service collection already exists.
    const serviceCollection = await db
      .collection<DBServiceCollectionType>(data.slug)
      .findOne({});

    if (serviceCollection)
      return Response(
        "error",
        null,
        400,
        "Service collection with this slug already exists"
      );

    // Create the service collection.
    const result = await db
      .collection<DBServiceCollectionType>(data.slug)
      .insertOne({
        title: data.title,
        slug: data.slug,
        is_published: data.is_published,
        description: data.description,
        thumbnail: data.thumbnail,
        services: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    if (!result.insertedId)
      return Response(
        "error",
        null,
        500,
        "Service collection could not be created"
      );

    // Return the service collection.
    const serviceCollectionData = await db
      .collection<DBServiceCollectionType>(data.slug)
      .findOne({ _id: result.insertedId });

    if (!serviceCollectionData)
      return Response(
        "error",
        null,
        500,
        "Service collection could not be created"
      );

    return Response(
      "success",
      {
        ...serviceCollectionData,
        _id: null,
        services: [],
      } as ServiceCollectionType,
      200,
      "Service collection created"
    );
  } catch (error) {
    console.error(error);
    return Response("error", null, 500, "Internal server error");
  }
}

export async function addServiceToCollection(
  data: ServiceType,
  collectionSlug: string,
  path?: string
): Promise<ServerFunctionResponse<ServiceType | null>> {
  try {
    // Match permissions to view user
    // If the user has the permission to view user, then return the user
    const t = await matchPermissions(["service_add"]);
    if (!t)
      return Response(
        "error",
        null,
        401,
        "You don't have the permission to add services"
      );
    const { session, isMatched, matches } = t;

    if (!isMatched)
      return Response(
        "error",
        null,
        401,
        "You don't have the permission to add services"
      );

    const client = await clientPromise;
    const db = client.db(config.db.service_name);

    // Check if the service collection already exists.
    const serviceCollection = await db
      .collection<DBServiceCollectionType>(collectionSlug)
      .findOne({});

    if (!serviceCollection)
      return Response(
        "error",
        null,
        400,
        "Service collection with this slug does not exist"
      );

    // Create the service collection.
    const result = await db
      .collection<DBServiceType>(collectionSlug)
      .insertOne({
        ...data,
        _id: new ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    if (!result.insertedId)
      return Response("error", null, 500, "Service could not be created");

    // Return the service collection.
    const serviceData = await db
      .collection<DBServiceType>(collectionSlug)
      .findOne({ _id: result.insertedId });

    if (!serviceData)
      return Response("error", null, 500, "Service could not be created");

    return Response(
      "success",
      {
        ...serviceData,
        _id: serviceData._id.toHexString(),
      } as ServiceType,
      200,
      "Service created"
    );
  } catch (error) {
    console.error(error);
    return Response("error", null, 500, "Internal server error");
  }
}
